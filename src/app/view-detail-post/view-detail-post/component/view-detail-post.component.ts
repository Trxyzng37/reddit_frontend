import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { ActivatedRoute } from '@angular/router';
import { GetPostService } from '../service/get-post/get-post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import tinymce from 'tinymce';
import { GetCommentsService } from '../service/get-comments/get-comments.service';
import { Comment } from '../pojo/comment';
import { CreateCommentService } from '../service/create-comment/create-comment.service';
import { CreateCommentResponse } from '../pojo/create-comment-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import Swal from 'sweetalert2';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';

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
    private activeRoute: ActivatedRoute
  ) {}

  public postId: number = 0;
  public post: GetPostResponse = new GetPostResponse(0, "", 0, "", "", 0, "", "", "", "", "", 0,0,0);
  public shownDate: string = "";
  public commentResults: Comment[] = [];
  public content: string = "";
  public isDeleted: boolean = false;
  public width: string[] = [];
  public isCommunityOwner: boolean = false;
  public isAuthor: boolean = false;
  public isAllow: boolean = false;

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    this.checkRefreshTokenService.runCheckRefreshTokenWithoutNotification();
    this.postId = this.route.snapshot.params['post_id'];
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    const post_arr: GetPostResponse[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
    let is_post_exist: boolean = false;
    for(let post of post_arr) {
      if(post.post_id == Number.parseInt(this.activeRoute.snapshot.params['post_id'])) {
        this.post = post;
        this.getInfo(post);
        is_post_exist = true;
      }
    }
    if(!is_post_exist) {
      this.getPostService.getPostByPostId(this.postId).subscribe({
        next: (response: GetPostResponse) => {
          this.post = response;
          this.getInfo(response);
        },
         error: (e: HttpErrorResponse) => {
           console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
           this.isDeleted = true;
         }
      })
    }     
  }

  getInfo(post: GetPostResponse) {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isAuthor = uid === post.uid;
    this.isAllow = post.allow === 0 ? false : true;
    this.isDeleted = post.deleted === 1 ? true : false;
    this.communityService.getCommunityInfoById(post.community_id.toString()).subscribe({
      next: (response: Communities) => {
        this.isCommunityOwner = uid === response.uid;
      }  
    });
    if(!this.isDeleted && this.isAllow) {
      if(uid !== 0) {
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
    this.getCommentService.getComments(post.post_id).subscribe({
      next: (response: Comment[]) => {
        this.commentResults = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  img_count = 0;
  public editorSettings = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link lists codesample image autoresize', 
    toolbar: "bold italic underline strikethrough forecolor subscript superscript removeformat numlist bullist link blockquote codesample image",
    toolbar_mode: 'wrap',
    placeholder: 'Enter your comment',
    automatic_uploads: true,
    file_picker_types: 'image',
    images_file_types: 'jpg,svg,webp,png,jpeg',
    images_reuse_filename: true,
    image_dimensions: false,
    // image_caption: true,
    image_description: false,
    statusbar: true,
    elementpath: false,
    branding: false,
    resize: true,
    width: '100%',
    min_height: 100,
    // max_height:1000,
    autoresize_min_height: 200,
    // autoresize_max_height: 300,
    // height: '100px', 
    menubar: false, 
    draggable_modal: false,
    object_resizing: false,
    inline_boundaries: false,
    contenteditable: false,
    paste_data_images: false,
    paste_block_drop: false,
    color_default_foreground: '#E03E2D',
    color_default_background: '#000000',
    color_map_background: [
      '000000', 'Black'
    ],
    textcolor_map: ['#E03E2D', 'Red'],
    custom_colors: false,
    content_css: 'tinymce-5',
    content_style: 
      'p { margin: 0; } ' + 
      'img { display: block; out-line: 0; max-width: 200px; max-height: 200px}' +
      'body {line-height: normal}' +
      'pre[class*=language-] {font-family: Consolas}',
    file_picker_callback: (cb: any, value:any, meta:any) => {
      if(this.img_count == 0) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', (e:any) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const id = file.name;
            const blobCache =  tinymce.activeEditor!.editorUpload.blobCache;
            const base64 = (<string>reader.result).split(',')[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          });
          reader.readAsDataURL(file);
        })
        this.img_count++;
        input.click();
      }
      else {
        Swal.fire("Only 1 image is allow in a comment",'','warning')
      }
    }
  }

  onContentChanged = (event: any) =>{
    this.content = event.editor.getContent({ format: 'html' });
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
        } 
      })
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
      this.createCommentService.createComment(this.postId, 0, this.content, 0).subscribe({
        next: (response: CreateCommentResponse) => {
          tinymce.activeEditor?.setContent("");
          this.reloadComment(event);
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          Swal.fire({
            titleText: "Error create comment. Please try again",
            icon: "success",
            heightAuto: true,
            showConfirmButton: true,
            focusCancel: false,
            focusConfirm: false
          })
        }
      })
    }
  }

  reloadComment(event: Event) {
    this.getCommentService.getComments(this.postId).subscribe({
      next: (response: Comment[]) => {
        this.commentResults = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
     })
  }

}
