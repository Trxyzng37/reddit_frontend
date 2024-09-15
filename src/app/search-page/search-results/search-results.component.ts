import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPostsService } from 'src/app/post-link-list/service/get-posts.service';
import { ActivatedRoute } from '@angular/router';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  public constructor(
    private getPostsService: GetPostsService,
    private activeRoute: ActivatedRoute,
    private checkRefreshTokenService: CheckRefreshTokenService,
    private shareDataService: ShareDataService,
    private getPostService: GetPostService
  ) {}

  public search_text: string = "";
  public posts: GetPostResponse[] = [];
  public isSortOptionShow: boolean = false;
  public sort_option: string = "new";
  public sort_text: string = "New";
  public searchOption: string = "posts";

  public detail_post_arr: DetailPost[] = [];
  public post_id_arr: number[] = [];
  public cur_view_post_id: number = 0;
  public isDataLoad: boolean = false;
  public wait: boolean = false;
  intervals: any = [];

  ngOnInit() {
    this.checkRefreshTokenService.runCheckRefreshTokenWithoutNotification();
    this.search_text = this.activeRoute.snapshot.params['text'];
    this.shareDataService.search_post_post_id_arr$.subscribe(response => {
      this.post_id_arr = response;
    })
    this.shareDataService.search_post_detail_posts$.subscribe(response => {
      this.detail_post_arr = response;
    })
    this.shareDataService.cur_search_post_view_post_id$.subscribe(response => {
      this.cur_view_post_id = response;
    })
    this.shareDataService.search_post_post_search_option$.subscribe(response => {
      this.sort_option = response;
    })
    this.setSortText(this.sort_option);
    this.searchPosts(this.sort_option);
  }

  ngAfterViewInit() {
    let element = document.getElementById(this.cur_view_post_id.toString());
    if(element != null)
      element.scrollIntoView();
  }

  showSortOption() {
    this.isSortOptionShow = !this.isSortOptionShow;
  }

  selectSearchOption(search_type: string) {
    this.searchOption = search_type;
  }

  setSortText(sort_type: string) {
    switch(sort_type) {
      case "hot":
        this.sort_text = "Hot";
        break;
      case "new":
        this.sort_text = "New";
        break;
      case "top_day":
        this.sort_text = "Top today";
        break;
      case "top_week":
        this.sort_text = "Top this week";
        break;
      case "top_month":
        this.sort_text = "Top this month";
        break;
      case "top_year":
        this.sort_text = "Top this year";
        break;
      case "top_all_time":
        this.sort_text = "Top all time";
        break;
    }
  }

  selectSort(sort_type: string) {
    this.sort_option = sort_type;
    this.isSortOptionShow = !this.isSortOptionShow;
    this.post_id_arr = [];
    this.detail_post_arr = [];
    for(let i of this.intervals) {
      clearInterval(i);
    }
    this.shareDataService.setSearchPostsSearchOption(sort_type);
    this.setSortText(sort_type);
    this.searchPosts(sort_type);
  }

  searchPosts(sort: string) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, 0, 2, 5);
    }
    else {
      this.getPostsService.getPostForSearch("/get-search-posts", this.search_text, sort).subscribe({
        next: (response: any) => {
          this.post_id_arr = response;
          this.shareDataService.setSearchPostsPostIds(this.post_id_arr);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, 0, 15, 12, 5);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  isElementInViewport(id: string): boolean {
    const element = document.getElementById(id);
    if (!element) {
        return false; // Element with the given id does not exist
    }
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  getPostsByCheckViewPort(detail_post_arr: DetailPost[], post_id_arr: number[], uid: number, start: number, detect_modifier: number, get_post_amount: number) {
    if(detail_post_arr.length == post_id_arr.length) {
      this.isDataLoad = false;
    }
    else {
      for(let i=start; i<post_id_arr.length; i+=get_post_amount) {
        const t = setInterval( () => {
          this.intervals.push(t);
          let elem = this.isElementInViewport(post_id_arr[i-detect_modifier].toString());
          if(elem) {
            console.log(post_id_arr[i-detect_modifier]);
            clearInterval(t);
            const id = post_id_arr.slice(i, i+get_post_amount);
            this.isDataLoad = true;
            this.getPostService.getDetailPostByUidAndPostIds(uid, id).subscribe({
              next: (response: DetailPost[]) => {
                this.isDataLoad = false;
                for(let p of response) {
                  detail_post_arr.push(p);
                }
                this.shareDataService.setSearchPostsDetailPosts(detail_post_arr);
              },
              error: (e: HttpErrorResponse) => {
                this.isDataLoad = false;
                console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
              }
            })
          }
        }, 200);
      }
    }
  }

  getAllDetailPostsByUidAndPostIds(detail_post_arr: DetailPost[], post_id_arr: number[], uid: number, initital_post_count: number, detect_modifier: number, get_post_count: number) {
    if(detail_post_arr.length == post_id_arr.length) {
      this.isDataLoad = false;
    }
    else {
      this.isDataLoad = true;
      this.getPostService.getDetailPostByUidAndPostIds(uid, this.post_id_arr.slice(0, initital_post_count)).subscribe({
        next: (response: DetailPost[]) => {
          this.isDataLoad = false;
          this.wait = true;
          for(let post of response) {
            detail_post_arr.push(post);
          }
          this.shareDataService.setSearchPostsDetailPosts(detail_post_arr);
          this.getPostsByCheckViewPort(detail_post_arr, post_id_arr, uid, initital_post_count, detect_modifier, get_post_count);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  resumeLoadPosts(detail_post_arr: DetailPost[], post_id_arr: number[], uid: number, detect_modifier: number, get_post_amount: number) {
    const last_post_load = detail_post_arr[detail_post_arr.length-1].post_id;
    const index_of_last_post = post_id_arr.indexOf(last_post_load);
    this.getPostsByCheckViewPort(detail_post_arr, post_id_arr, uid, index_of_last_post+1, detect_modifier, get_post_amount);
    this.shareDataService.setSearchPostsDetailPosts(detail_post_arr);
  }
}
