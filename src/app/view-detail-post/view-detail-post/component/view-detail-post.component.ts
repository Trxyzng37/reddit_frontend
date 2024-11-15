import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetPostService } from '../service/get-post/get-post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import tinymce from 'tinymce';
import { GetCommentsService } from '../service/get-comments/get-comments.service';
import { CommentInfo } from '../pojo/comment';
import { CreateCommentService } from '../service/create-comment/create-comment.service';
import { CreateCommentResponse } from '../pojo/create-comment-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import Swal from 'sweetalert2';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { EditorSettingService } from 'src/app/shared/services/editor-setting/editor-setting.service';
import { EditorObj } from 'src/app/shared/services/share_data/editor';
import { ClearFormatService } from 'src/app/shared/services/clear-format/clear-format.service';
import { CommentCallback } from '../pojo/comment-callback';

@Component({
  selector: 'app-view-detail-post',
  templateUrl: './view-detail-post.component.html',
  styleUrl: './view-detail-post.component.scss'
})
export class ViewDetailPostComponent {

  public constructor(
    private route: ActivatedRoute,
    private dateTimeService: DateTimeService,
    private getPostService: GetPostService,
    private getCommentService: GetCommentsService,
    private createCommentService: CreateCommentService,
    private storageService: StorageService,
    private recentVisitPostService: RecentVisitService,
    private communityService: CommunityService,
    private darkmodeSerive: DarkModeService,
    private checkRefreshTokenService: CheckRefreshTokenService,
    private activeRoute: ActivatedRoute,
    private shareDataService: ShareDataService,
    public editorSettingService: EditorSettingService,
    private formatService: ClearFormatService
  ) {}

  public post: DetailPost = new DetailPost();
  public shownDate: string = "";
  public commentResults: CommentInfo[] = [];
  public content: string = "";
  public isDeleted: boolean = false;
  public width: string[] = [];
  public isAuthor: boolean = true;
  public isAllow: boolean = true;

  public isDataLoad: boolean = false;
  public wait: boolean = false;

  public mode: number = 0;
  public editorSettings: any;

  public img_count = 0;

  public isModPage: boolean = false;
  public selected_mod_post: number = 0;

  public isPostExist: boolean = false;
  public isCommentLoad: boolean = false;
  public commentWait: boolean = false;

  public prev_content = "";

  public editor_arr: EditorObj[] = [];
  public isCreateComment: boolean = false;

  ngOnInit() {
    this.shareDataService.editor$.subscribe((e) => {
      // console.log("editor id: "+e.editor_id);
      this.editor_arr.push(e);
      // console.log("editor length: "+this.editor_arr.length)
      // this.editor_arr.forEach(e => {
      //   console.log("comment_id: "+e.comment_id);
      //   console.log("editor_id: "+e.editor_id);
      // })
    })
    this.darkmodeSerive.useDarkMode();
    this.checkRefreshTokenService.runCheckRefreshTokenWithoutNotification();
    this.isModPage = window.location.href.includes("/mod/");
    if(this.isModPage) {
      this.shareDataService.mod_detail_post$.subscribe(res => {
        if(res != undefined) {
          this.wait = false;
          this.open = false;
          this.commentResults = [];
          if(res.post_id == 0) {
            this.isPostExist = false;
            this.post = new DetailPost();
          }
          else {
            this.isPostExist = true;
            this.post = res;
            this.getInfo(res);
            this.isDeleted = this.post.deleted == 1 ? true : false;
            this.isAllow = this.post.allow == 1 ? true : false;
          }
        }
        this.shareDataService.changed_post$.subscribe(res => {
          this.isDeleted = res.deleted == 1 ? true : false;
          this.isAllow = res.allow == 1 ? true : false;
        })
      });
    }
    if(!this.isModPage) {
      const post_id = this.route.snapshot.params['post_id'];
      const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      this.getPostService.getDetailPostByUidAndPostId(uid, post_id).subscribe({
        next: (response: DetailPost) => {
          if(response.post_id == 0) {
            this.isPostExist = false;
          }
          else {
            this.isPostExist = true;
            this.getInfo(response);
          }
        },
         error: (e: HttpErrorResponse) => {
           console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
           this.isDeleted = true;
         }
      })  
    }
  }

  getInfo(post: DetailPost) {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.post = post;
    this.isAuthor = uid === post.uid;
    this.isAllow = post.allow === 0 ? false : true;
    this.isDeleted = post.deleted === 1 ? true : false;
    if(!this.isDeleted && this.isAllow) {
      if(uid !== 0 && !this.isModPage) {
        this.recentVisitPostService.setRecentVisit("/set-recent-visit-post", uid, post.post_id).subscribe();
      }
      else {
        let recent_post_array: number[] = this.storageService.getItem("recent_posts") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_posts") + "]");
        recent_post_array = recent_post_array.filter(
          (id) => {return id != post.post_id;}
        )
        let t = recent_post_array.unshift(post.post_id);
        this.storageService.setItem("recent_posts", recent_post_array.toString());
      }
    }
    this.isCommentLoad = true;
    this.getCommentService.getComments(post.post_id).subscribe({
      next: (response: CommentInfo[]) => {
        this.isCommentLoad = false;
        this.commentWait = true;
        this.commentResults = response;
        this.wait = true;
        const comment_id = this.route.snapshot.params['comment_id'];
        if(comment_id != 0) {
          const t = setInterval(() => {
            let element = document.getElementById("c"+comment_id);
            if(element != null) {
              element.scrollIntoView();
              clearInterval(t);
            }
          }, 50);
        }
      },
      error: (e: HttpErrorResponse) => {
        this.isCommentLoad = false;
        this.commentWait = true;
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  open: boolean = false;
  openEditor() {
    this.open = !this.open;
  }

  onContentChanged = (event: any) =>{
    this.content = event.editor.getContent({ format: 'html' });
    if(this.formatService.hasInlineStyle(this.content)) {
      this.content = this.formatService.removeInlineStyle(this.content);
      tinymce.EditorManager.get(this.editor_arr[1].editor_id)!.setContent(this.content);
    }
  }

  cancelComment() {
    if(this.content != "") {
      Swal.fire({
        titleText: "Do you want to clear this comment",
        icon: "warning",
        heightAuto: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusCancel: false,
        focusConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Swal.fire('Clear comment successfully', '', 'success')
          this.content = "";
          tinymce.activeEditor?.setContent(this.content);
          this.open = false;
        } 
      })
    }
    else {
      this.open = false;
    }
  }

  createComment(event: Event) {
    const uid = this.storageService.getItem("uid") == "" ? 0 : parseInt(this.storageService.getItem("uid"));
    if(uid === 0) {
      Swal.fire({
        title: "Authentication fail",
        text: "Please sign-in to do this action",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "Confirm",
        footer: '<a href="signin" style="color:red;font-size: 18px"><b>Click here to go to sign-in page<b/></a>'
      })
    }
    else {
      this.content = this.formatService.formatForCreatePost(this.content);
      this.content = this.formatService.removeInlineStyle(this.content);
      this.isCreateComment = true;
      this.createCommentService.createComment(this.post.post_id, 0, this.content, 0).subscribe({
        next: (response: CreateCommentResponse) => {
          tinymce.activeEditor?.setContent("");
          this.getCommentService.getCommentInfoById(response.comment_id, this.post.post_id).subscribe({
            next: (res: CommentInfo) => {
              this.open = false;
              this.isCreateComment = false;
              this.reloadComment(new CommentCallback(response.comment_id, "create_comment"));
              this.commentResults.push(res);
            }
          })
        },
        error: (e: HttpErrorResponse) => {
          this.isCreateComment = false;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          Swal.fire({
            titleText: "Error create comment. Please try again",
            icon: "error",
            heightAuto: true,
            showConfirmButton: true,
            focusCancel: false,
            focusConfirm: false
          })
        }
      })
    }
  }

  reloadComment(event: CommentCallback) {
     if(event.type == "create_comment") {
      const index = this.editor_arr.findIndex(obj => obj.comment_id === event.comment_id.toString());
      if (index !== -1) {
        const [CommentInfo] = this.editor_arr.splice(index, 1); // Remove the CommentInfo from its position
        this.editor_arr.push(CommentInfo);                      // Add it to the end of the array
      }
     }
     if(event.type == "reply_comment") {
        this.getCommentService.getCommentInfoById(event.comment_id, this.post.post_id).subscribe({
          next: (response: CommentInfo) => {
            const index = this.findLastIndexWithParentId(response.parent_id);
            this.commentResults.splice(index+1, 0, response);
            this.found_index = -1;
          }
        })
     }
     if(event.type == "delete_comment") {
      this.removeCommentInfo(event.comment_id);
     }
     if(event.type == "delete_community_owner") {
      this.removeCommentInfo(event.comment_id);
     }
  }

  private found_index: number = -1;
  findLastIndexWithParentId(parent_id: number): number {
    let count = 0;
    for(let i=0; i<this.commentResults.length; i++) {
      if(this.commentResults[i].parent_id == parent_id) {
        count++;
        this.found_index = i;
      }
    }
    console.info(`found ${count} objects with parent_id ${parent_id}`);
    if(count != 0) {
      const new_parent_id: number = this.commentResults[this.found_index]._id;
      this.findLastIndexWithParentId(new_parent_id);
    }
    if(count == 0) {
      for(let i=0; i<this.commentResults.length; i++) {
        if(this.commentResults[i]._id == parent_id) {
          this.found_index = i;
        }
      }
      console.info(`found object that have id equal parent_id ${parent_id} at index ${this.found_index}`);
    }
    console.info("return found_index: "+this.found_index);
    return this.found_index;
  }

  removeCommentInfo(id: number) {
    let index = -1;
    let count = 0;
    //get index of the comment in array
    for(let i=0; i<this.commentResults.length; i++) {
      if(this.commentResults[i]._id == id) {
        index = i;
        break;
      }
    }
    //check if comment has any children
    for(let i=0; i<this.commentResults.length; i++) {
      if(this.commentResults[i].parent_id == id) {
        count++;
        break;
      }
    }
    if(count == 0) {
      this.commentResults.splice(index, 1);
    }
    else {
      console.info("delete comment that have children")
      this.commentResults[index].content = '<em style="font-weight: 300;">Comment deleted</em>';
      this.commentResults[index].deleted = true;
    }
  }
}

