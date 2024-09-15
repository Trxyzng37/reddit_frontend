import { Component } from '@angular/core';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { UserProfile } from 'src/app/shared/pojo/pojo/user-profile';
import { ActivatedRoute } from '@angular/router';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { CommentInfo } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-comment-view-list',
  templateUrl: './comment-view-list.component.html',
  styleUrl: './comment-view-list.component.scss'
})
export class CommentViewListComponent {
  constructor(
    private searchUserProfileService: SearchUserProfileService,
    private storageService: StorageService,
    private getCommentService: GetCommentsService,
    private activeRoute: ActivatedRoute,
    private darkmodeSerive: DarkModeService,
    private shareDataService: ShareDataService
  ) {}

  public userInfo: UserProfile = new UserProfile(0,'','','',0,0,'');
  public comments: CommentInfo[] = [];
  public comment_id_arr: number[] = [];

  public isDataLoad: boolean = false;
  public wait: boolean = false;

  public isSortOptionShow: boolean = false;
  public sort_option: string = "new";
  public sort_text: string = "New";
  public intervals: any = [];

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    const username = this.activeRoute.parent?.snapshot.params['username'];
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.shareDataService.comments_infos$.subscribe(res => this.comments = res);
    if(this.comments.length == 0) {
      this.searchUserProfileService.getUserProfileByName("/get-user-info-by-username", username).subscribe({
        next: (response: UserProfile) => {
          this.userInfo = response;
          this.getCommentsByUid("new");
        }
      })
    }
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

  showSortOption(event: any) {
    event.stopPropagation();
    this.isSortOptionShow = !this.isSortOptionShow;
  }

  selectSort(sort_type: string) {
    this.sort_option = sort_type;
    this.setSortText(sort_type);
    this.isSortOptionShow = !this.isSortOptionShow;
    this.comments = [];
    this.comment_id_arr = [];
    this.shareDataService.setCommentsInfos(this.comments);
    this.shareDataService.setCommentIds(this.comment_id_arr);
    for(let i of this.intervals) {
      clearInterval(i);
    }
    this.shareDataService.setCommentSearchOption(sort_type);
    this.getCommentsByUid(sort_type);
  }

  getCommentsByUid(sort_type: string) {
    this.isDataLoad = true;
    if(this.comments.length == 0) {
      this.getCommentService.getCommentsByUser(this.userInfo.uid, sort_type).subscribe({
        next: (response: CommentInfo[]) => {
          this.isDataLoad = false;
          this.wait = true;
          this.comments = response;
          this.shareDataService.setCommentsInfos(response);
        }
      })
    }
    else {
      this.isDataLoad = false;
    }
  }

  //get posts
  isElementInViewport(id: string): boolean {
    const element = document.getElementById(id);
    if (!element) {
        return false;
    }
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  getCommentsByCheckViewPort(detail_post_arr: CommentInfo[], post_id_arr: number[], uid: number, start: number, detect_modifier: number, get_post_amount: number) {
    if(detail_post_arr.length == post_id_arr.length) {
      console.log("full");
      this.isDataLoad = false;
    }
    else {
      for(let i=start; i<post_id_arr.length; i+=get_post_amount) {
        const t = setInterval( () => {
          this.intervals.push(t);
          let elem = this.isElementInViewport(post_id_arr[i-detect_modifier].toString());
          if(elem) {
            clearInterval(t);
            const id = post_id_arr.slice(i, i+get_post_amount);
            this.isDataLoad = true;
            // this.getCommentService.get(uid, id).subscribe({
            //   next: (response: DetailPost[]) => {
            //     this.isDataLoad = false;
            //     for(let p of response) {
            //       detail_post_arr.push(p);
            //     }
            //     // if(!this.isUserPage && !this.isHomePage && !this.isPopularPage && !this.isCommunityPage)
            //     //   this.shareDataService.setDetailPosts(detail_post_arr);
            //   },
            //   error: (e: HttpErrorResponse) => {
            //     this.isDataLoad = false;
            //     console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
            //   }
            // })
          }
        }, 200);
      }
    }
  }
}
