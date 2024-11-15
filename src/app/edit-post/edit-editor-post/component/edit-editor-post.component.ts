import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import Swal from 'sweetalert2';
import tinymce from 'tinymce';
import { EditPostService } from '../../service/edit-post/edit-editor-post.service';
import { EditPostResponse } from '../../pojo/edit-post-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { EditorSettingService } from 'src/app/shared/services/editor-setting/editor-setting.service';
import { ClearFormatService } from 'src/app/shared/services/clear-format/clear-format.service';

@Component({
  selector: 'app-edit-editor-post',
  templateUrl: './edit-editor-post.component.html',
  styleUrl: './edit-editor-post.component.scss'
})
export class EditEditorPostComponent {

  public constructor(
    private getPostService: GetPostService,
    private activeRoute: ActivatedRoute,
    private dateTimeService: DateTimeService,
    private editPostService: EditPostService,
    private storageService: StorageService,
    private route: Router,
    public editorSettingService: EditorSettingService,
    private formatService: ClearFormatService
  ) { }

  public post_id: number = 0;
  public shownDate: string = "";
  public postData: DetailPost = new DetailPost();
  public edit_title: string = "";
  public edit_content: string = "";
  public characterCount: number = 0;
  public original_title: string = "";
  public original_content: string = "";
  public allowSubmit: boolean = false;
  public isLoad: boolean = false;

  public prev_content: string = "";
  public editor_id: string = "";

  ngOnInit() {
    this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(this.postData.created_at);
    this.post_id = this.activeRoute.snapshot.params['post_id'];
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.getPostService.getDetailPostByUidAndPostId(uid, this.post_id).subscribe({
      next: (response: DetailPost) => {
        this.postData = response;
        const title = (<HTMLInputElement>document.getElementById("input_post_title"));
        title.value = this.postData.title;
        title.value = title.value.replace(/\r?\n|\r/g, "");
        // title.style.height = 'auto';
        title.style.height = `${title.scrollHeight}px`;
        this.edit_title = this.postData.title;
        this.edit_content = this.postData.content;
        this.characterCount = this.postData.title.length;
        this.original_title = this.postData.title;
        this.original_content = this.postData.content;
        tinymce.activeEditor?.setContent(this.postData.content);
        this.AllowSubmit();
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  AllowSubmit() {
    this.allowSubmit = (this.original_title !== this.edit_title || this.original_content !== this.edit_content) &&
      this.edit_title.length !== 0
      ? false : true;
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

  count = 0;
  setContent(event: any) {
    if (this.count == 0) {
      this.count++;
      tinymce.activeEditor?.setContent(this.postData.content);
      this.AllowSubmit();
    }
    this.count++;
    this.edit_content = event.editor.getContent({ format: 'html' });
    if(this.formatService.hasInlineStyle(this.edit_content)) {
      this.edit_content = this.formatService.removeInlineStyle(this.edit_content);
      tinymce.activeEditor!.setContent(this.edit_content);
    }
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
        this.edit_content = this.formatService.formatForCreatePost(this.edit_content);
        this.edit_content = this.formatService.removeInlineStyle(this.edit_content);
        this.editPostService.editPost("/edit-editor-post", "editor", this.post_id, uid, this.edit_title, this.edit_content).subscribe({
          next: (response: EditPostResponse) => {
            if (result.isConfirmed) {
              this.isLoad = false;
              Swal.fire('Edit post successfully', '', 'success').then((result) => {
                  this.route.navigate(["/post/" + this.post_id]);
              });
            }
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
        this.route.navigate(["/post/" + this.post_id]);
    })
  }
}
