import { Component } from '@angular/core';
import { PostResponse } from '../../pojo/post-response';
import { GetPostsService } from '../../service/get-posts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-link-list',
  templateUrl: './post-link-list.component.html',
  styleUrl: './post-link-list.component.scss'
})
export class PostLinkListComponent {
  public constructor(
    private getPostService: GetPostsService,
    private sanitizer: DomSanitizer

  ) {
    this.trustedHtml = this.sanitizer
    .bypassSecurityTrustHtml(this.htmlContent)
  }

  public post_result: PostResponse[] = [];
  trustedHtml: any;
  htmlContent = "<h1>Html content</h1><img src='https://res.cloudinary.com/trxyzng-photo-storage/image/upload/v1711289964/test/test.jpg' style='width: 100px; height: 50px'/>";
  
  ngOnInit() {
    this.getPostService.getAllPosts().subscribe({
      next: (response: PostResponse[]) => {
        this.post_result = response;
        console.log(this.post_result)
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  addPost(o: PostResponse) {
    this.post_result.push(o);
  }
}
