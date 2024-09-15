import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
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
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';

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
    private shareDataService: ShareDataService
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

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    this.updateEditorStyle();
    this.checkRefreshTokenService.runCheckRefreshTokenWithoutNotification();
    this.isModPage = window.location.href.includes("/mod/");
    if(this.isModPage) {
      this.shareDataService.mod_detail_post$.subscribe(res => {
        if(res != undefined) {
          this.wait = false;
          this.open = false;
          this.commentResults = [];
          if(res.post_id == 0) {
            this.post = new DetailPost();
          }
          else {
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
          this.getInfo(response);
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
    this.isDataLoad = true;
    this.getCommentService.getComments(post.post_id).subscribe({
      next: (response: CommentInfo[]) => {
        this.commentResults = response;
        this.isDataLoad = false;
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
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  open: boolean = false;
  openEditor() {
    this.open = !this.open;
  }

  updateEditorStyle(): void {
    this.mode = this.storageService.getItem("mode") == "1" ? 1 : 0;
    this.editorSettings = {
      base_url: '/tinymce',
      suffix: '.min',
      plugins: 'link lists codesample image autoresize', 
      toolbar: "bold italic underline strikethrough subscript superscript removeformat numlist bullist link blockquote codesample image",
      toolbar_mode: 'wrap',
      placeholder: 'Enter your comment',
      automatic_uploads: true,
      file_picker_types: 'image',
      images_file_types: 'jpg,svg,webp,png,jpeg',
      images_reuse_filename: true,
      image_dimensions: false,
      image_description: false,
      statusbar: true,
      menubar: false, 
      elementpath: false,
      branding: false,
      resize: true,
      width: '100%',
      min_height: 130,
      height: 130, 
      draggable_modal: false,
      object_resizing: false,
      inline_boundaries: false,
      contenteditable: false,
      paste_data_images: false,
      paste_block_drop: false,
      license_key: 'gpl',
      color_default_foreground: '#E03E2D',
      color_default_background: '#000000',
      color_map_background: [
        '000000', 'Black'
      ],
      textcolor_map: ['#E03E2D', 'Red'],
      custom_colors: false,
      content_css: 'tinymce-5',
      content_style: 
        'html body { overflow: auto !important; }' +
        'p { margin: 0; } ' + 
        'img { display: block; out-line: 0; max-width: 200px; max-height: 200px}' +
        'body {line-height: normal' +
        'pre[class*=language-] {font-family: Consolas}',
        setup: (editor: any) => {
          editor.on('init', () => {
            const backgroundColor = 'var(--neutral)';
            const textColor = 'var(--secondary_color)';
            // editor.getBody().style.backgroundColor = '#efefef';
            const container = editor.getContainer();
            let tox_tiny = container.parentElement.childNodes;
            let  tox_tinymce = tox_tiny[2];
            tox_tinymce.style.border = "1px solid var(--secondary_color)";
            container.querySelector('.tox-editor-header').style.backgroundColor = backgroundColor;
            container.querySelector('.tox-editor-container').style.backgroundColor = backgroundColor;
            container.querySelector('.tox-toolbar').style.backgroundColor = backgroundColor;
            container.querySelector('.tox-toolbar').style.color = textColor;
            container.querySelector('.tox-statusbar').style.backgroundColor = backgroundColor;
            container.querySelector('.tox-statusbar').style.height = '50px';
            let resize_icon = container.querySelector('.tox-statusbar').querySelector('.tox-statusbar__resize-handle').querySelector('svg');
            resize_icon.style.fill = 'var(--secondary_color)';
          });
        },
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
      // const post_id = this.route.snapshot.params['post_id'];
      this.createCommentService.createComment(this.post.post_id, 0, this.content, 0).subscribe({
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
    const post_id = this.post.post_id;
    this.getCommentService.getComments(post_id).subscribe({
      next: (response: CommentInfo[]) => {
        this.commentResults = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
     })
  }

}
