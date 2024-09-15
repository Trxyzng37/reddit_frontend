import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPostService } from '../../service/edit-post/edit-editor-post.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import Swal from 'sweetalert2';
import { EditPostResponse } from '../../pojo/edit-post-response';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';

@Component({
  selector: 'app-edit-video-view',
  templateUrl: './edit-video-view.component.html',
  styleUrl: './edit-video-view.component.scss'
})
export class EditVideoViewComponent {
  public constructor(
    private getPostService: GetPostService,
    private activeRoute: ActivatedRoute,
    private editPostService: EditPostService,
    private storageService: StorageService,
    private route: Router
  ) {}
  
  public post_id: number = 0;
  public edit_title: string = "";
  public edit_content: string = "";
  public characterCount: number = 0;
  public original_title: string = "";
  public original_content: string = "";
  public allowSubmit: boolean = false;
  public isLoad: boolean = false;

  ngOnInit() {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.post_id = this.activeRoute.snapshot.params['post_id'];
    this.getPostService.getDetailPostByUidAndPostId(uid, this.post_id).subscribe({
      next: (response: DetailPost) => {
        let title = (<HTMLInputElement>document.getElementById("input_post_title"));
        title.value = response.title;
        title.value = title.value.replace(/\r?\n|\r/g, "");
        title.style.height = 'auto';
        title.style.height = title.scrollHeight < 30 ? '30px' : `${title.scrollHeight}px`;
        this.original_title = response.title;
        this.original_content = response.content;
        this.edit_title = response.title;
        this.edit_content = response.content;
        this.characterCount = response.title.length;
        this.AllowSubmit();
      },
      error: (e: HttpErrorResponse) => {
        Swal.fire("Error edit post. Plase try again",'','error')
        // console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  inputTitle(event: any) {
    const textareaEle: any = event.target;
    textareaEle.value = textareaEle.value.replace(/(\r\n|\n|\r)/gm, "");
    textareaEle.style.height = 'auto';
    textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    this.characterCount = textareaEle.value.length;
    if (textareaEle.value === "") {
      textareaEle.style.height = '30px';
      this.characterCount = 0;
    }
    this.edit_title = textareaEle.value;
    this.AllowSubmit();
  }

  AllowSubmit() {
    this.allowSubmit = (this.original_title !== this.edit_title || this.original_content !== this.edit_content) &&
                       this.edit_title.length !== 0 &&
                       this.edit_content.length !== 0
                       ? false : true;
  }

  onVideoUpload(event: any) {
    const file = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.addEventListener("loadend", () => {
      const data = reader.result as string;
      if(data.length > 6700000) {
        Swal.fire("Maximum video size is 5MB",'','warning');
        this.AllowSubmit();
      }
      else {
        this.edit_content = data;
        this.AllowSubmit();
      }
    })
  }

  deleteVideo() {
    this.edit_content = "";
    const t = <HTMLInputElement>document.getElementById("input_upload_video");
    t.value = "";
    this.AllowSubmit();
  }

  editPost() {
    Swal.fire({
      titleText: "Are you sure you want to edit this post",
      icon: "warning",
      heightAuto: true,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: false,
      focusConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoad = true;
          const uid: number = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
          this.editPostService.editPost("/edit-video-post", "video", this.post_id, uid, this.edit_title, this.edit_content).subscribe({
            next: (response: EditPostResponse) => {
              this.isLoad = false;
              Swal.fire('Edit post successfully', '', 'success').then((result)=>{
                if(result.isConfirmed)
                  this.route.navigate(["/post/"+this.post_id]);
              });
            },
            error: (e: HttpErrorResponse) => {
              this.isLoad = false;
              Swal.fire('Fail to edit post. Please try again', '', 'error')
            }
          })
        }
      })
  }

  cancelEdit() {
    Swal.fire({
      titleText: "Cancel edit post",
      text: "The new content will not be saved",
      icon: "warning",
      heightAuto: true,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: false,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) 
        this.route.navigate(["/post/"+this.post_id]);
    })
  }
}
