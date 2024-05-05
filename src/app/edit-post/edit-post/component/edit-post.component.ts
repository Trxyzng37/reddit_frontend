import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { HttpErrorResponse } from '@angular/common/http';
import { DeletePostService } from '../../service/delete-post/delete-post.service';
import { DeletePostResponse } from '../../pojo/delete-post-response';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent {

  public constructor(
    private getPostService: GetPostService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private deletePostService: DeletePostService,
    private storageService: StorageService
  ) {}

  public post_type: string = "";
  public post_id: number = 0;

  ngOnInit() {
    this.post_id = this.activeRoute.snapshot.params['post_id'];
    this.getPostService.getPostByPostId(this.post_id).subscribe({
      next: (response: GetPostResponse) => {
          this.post_type = response.type;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  deletePost() {
    Swal.fire({
      titleText: "Are you sure you want to delete this post",
      icon: "warning",
      heightAuto: true,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: false,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
        this.deletePostService.deletePost("/delete-post", this.post_id, uid).subscribe({
          next: (response: DeletePostResponse) => {
            Swal.fire('Delete post successfully', '', 'success').then((result) => {
              if (result.isConfirmed)
                this.route.navigate([""]);
            })
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire('Error delete post. Please try again', '', 'error')
          }
        })
      }
    })
  }
}
