import { Component } from '@angular/core';
import { GetPostResponse } from '../../pojo/get-post-response';
import { GetPostsService } from '../../service/get-posts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';

@Component({
  selector: 'app-post-link-list',
  templateUrl: './post-link-list.component.html',
  styleUrl: './post-link-list.component.scss'
})
export class PostLinkListComponent {
  public constructor(
    private getPostService: GetPostsService,
    private sanitizer: DomSanitizer,
    private DatetimeService: DateTimeService
  ) {
    this.trustedHtml = this.sanitizer
    .bypassSecurityTrustHtml(this.htmlContent)
  }

  public post_result: GetPostResponse[] = [];

  trustedHtml: any;
  htmlContent = "<h1>Html content</h1><img src='https://res.cloudinary.com/trxyzng-photo-storage/image/upload/v1711289964/test/test.jpg' style='width: 100px; height: 50px'/>";
  
  ngOnInit() {
    this.getPostService.getAllPosts().subscribe({
      next: (response: GetPostResponse[]) => {
        this.post_result = response;
        console.log(this.post_result)
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  addPost(o: GetPostResponse) {
    this.post_result.push(o);
  }
}
