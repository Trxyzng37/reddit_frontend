import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent {


  public isOptionMenuOpen: boolean = false;

  openOptionMenu() {
    this.isOptionMenuOpen = !this.isOptionMenuOpen;
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
        Swal.fire('Delete post successfully', '', 'success')
        this.isOptionMenuOpen = false;
      } 
    })
  }
}
