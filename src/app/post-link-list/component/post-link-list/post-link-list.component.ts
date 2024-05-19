import { Component, Input } from '@angular/core';
import { GetPostResponse } from '../../pojo/get-post-response';
import { GetPostsService } from '../../service/get-posts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
@Component({
  selector: 'app-post-link-list',
  templateUrl: './post-link-list.component.html',
  styleUrl: './post-link-list.component.scss'
})
export class PostLinkListComponent {
  public constructor(
    private getPostService: GetPostsService,
    private sanitizer: DomSanitizer,
    private DatetimeService: DateTimeService,
    private activeRoute: ActivatedRoute,
    private storageService: StorageService,
    private recentVisitService: RecentVisitService
  ) {}

  post_result: GetPostResponse[] = [];
  public isSortOptionShow: boolean = false;
  public isCommunityPage: boolean = false;
  public isHomePage: boolean = false;
  public isPopularPage: boolean = false;
  public isControlPage: boolean = false;
  public sort_option: string = "Hot";
  public community_id: number = 0;
  public joinCommunityEventCount: number = 0;

  ngOnInit() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isCommunityPage = window.location.href.includes("/r/");
    this.isHomePage = window.location.href.includes("/home");
    this.isPopularPage = window.location.href.includes("/popular");
    this.isControlPage = window.location.href.includes("/control-posts/");
    if(this.isHomePage) {
      this.getHomePost(uid, "hot");
    }
    if(this.isCommunityPage) {
      let regex = '/r/([0-9]+)';
      const a = window.location.href.match(regex);
      if(a!=null) {
        this.community_id = Number.parseInt(a[1]);
        this.getCommunityPost("hot");
        this.recentVisitService.setRecentVisit("/set-recent-visit-community", uid, this.community_id).subscribe({
          next: (response: DefaultResponse) => {},
        })
      }
    }
    if(this.isPopularPage) {
      this.getPopularPost(uid, "hot");
    }
    if(this.isControlPage) {
      this.community_id = this.activeRoute.snapshot.params["community_id"];
      this.getCommunityPostNotAllow(this.community_id);
    }
  }

  addPost(o: GetPostResponse) {
    this.post_result.push(o);
  }

  selectSort(sort_type: string) {
    this.sort_option = sort_type;
    this.isSortOptionShow = !this.isSortOptionShow;
    let sort_option = "";
    switch(sort_type) {
      case "Hot":
        sort_option = "hot";
        break;
      case "New":
        sort_option = "new";
        break;
      case "Top today":
        sort_option = "top_day";
        break; 
      case "Top this week":
        sort_option = "top_week";
        break;   
      case "Top this month":
        sort_option = "top_month";
        break;
      case "Top this year":
        sort_option = "top_year";
        break;
      case "Top all time":
        sort_option = "top_all_time";
        break;                      
    }
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    if(this.isCommunityPage)
      this.getCommunityPost(sort_option);
    if(this.isPopularPage)
      this.getPopularPost(uid, sort_option);
    if(this.isHomePage)
      this.getHomePost(uid, sort_option);
  }

  showSortOption() {
    this.isSortOptionShow = !this.isSortOptionShow;
  }

  getHomePost(uid: number, sort_type: string) {
    this.getPostService.getHomePosts("/get-home-posts", uid, sort_type).subscribe({
      next: (response: GetPostResponse[]) => {
        this.post_result = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  getPopularPost(uid: number, sort_type: string) {
    this.getPostService.getPopularPosts("/get-popular-posts", uid, sort_type).subscribe({
      next: (response: GetPostResponse[]) => {
        this.post_result = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  getCommunityPost(sort_type: string) {
    this.getPostService.getPostInCommunity("/get-community-posts", this.community_id, sort_type).subscribe({
      next: (response: GetPostResponse[]) => {
        this.post_result = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  getCommunityPostNotAllow(uid: number) {
    this.getPostService.getPostInCommunityNotAllow("/get-control-posts", this.community_id).subscribe({
      next: (response: GetPostResponse[]) => {
        this.post_result = response;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  joinCommunityEvent(event: Event) {
    this.joinCommunityEventCount += 1;
    console.log("post-link-list: "+this.joinCommunityEventCount)
  }

  allowPostEvent(post_id: number) {
    this.post_result = this.post_result.filter( post => {
      return post.post_id !== post_id
    } )
  }
}
