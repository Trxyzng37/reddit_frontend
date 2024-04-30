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
    private storageService: StorageService
  ) {}

  public postId: number = 0;
  public post!: GetPostResponse;
  public shownDate: string = "";
  public commentResults: Comment[] = [];
  public content: string = "";

  ngOnInit() {
     this.postId = this.route.snapshot.params['post_id'];
     this.getPostService.getPostByPostId(this.postId).subscribe({
      next: (response: GetPostResponse) => {
        this.post = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
     })
     this.getCommentService.getComments(this.postId).subscribe({
      next: (response: Comment[]) => {
        this.commentResults = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
     })
  }

  public editorSettings = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link lists codesample image autoresize', 
    toolbar: "bold italic underline strikethrough forecolor subscript superscript removeformat numlist bullist link blockquote codesample image",
    toolbar_mode: 'wrap',
    placeholder: '(Optional)',
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
      'img { display: block; out-line: 0; max-width: 100%; max-height: 100%}' +
      'body {line-height: normal}' +
      'pre[class*=language-] {font-family: Consolas}',
    file_picker_callback: (cb: any, value:any, meta:any) => {
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
      input.click();
    },
  }

  onContentChanged = (event: any) =>{
    this.content = event.editor.getContent({ format: 'html' });
    console.log(this.content)
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
          Swal.fire('Clear comment successfully', '', 'success')
          this.content = "";
          tinymce.activeEditor?.setContent(this.content);
        } 
      })
    }
  }

  createComment() {
    const uid = this.storageService.getItem("uid") == null ? 0 : parseInt(this.storageService.getItem("uid"));
    if(uid === 0) {
      Swal.fire({
        titleText: "You need to login to comment",
        icon: "warning",
        heightAuto: true,
        showConfirmButton: true,
        focusCancel: false,
        focusConfirm: false,
        footer: '<a href="signin" style="color:red"><b>Click to go to login page<b/></a>'
      })
    }
    else {
      this.createCommentService.createComment(this.postId, 0, this.content, 0).subscribe({
        next: (response: CreateCommentResponse) => {
          console.log("save comment: "+response.comment_created);
          alert("Create comment successfully");
          this.getCommentService.getComments(this.postId).subscribe({
            next: (response: Comment[]) => {
              this.commentResults = response;
            },
            error: (e: HttpErrorResponse) => {
              console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
            }
           })
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

  getNewCommentAfterReply(event: Event) {
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
