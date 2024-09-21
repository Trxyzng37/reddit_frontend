import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GetPostsService } from '../../service/get-posts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { UserProfile } from 'src/app/shared/pojo/pojo/user-profile';
import { SavePostService } from 'src/app/shared/services/save-post/save-post.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import { JoinCommunity } from 'src/app/shared/pojo/join-community';
import { DetailPost } from '../../pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';

@Component({
  selector: 'app-post-link-list',
  templateUrl: './post-link-list.component.html',
  styleUrl: './post-link-list.component.scss'
})
export class PostLinkListComponent {
  public constructor(
    private getPostService: GetPostService,
    private getPostsService: GetPostsService,
    private sanitizer: DomSanitizer,
    private DatetimeService: DateTimeService,
    private activeRoute: ActivatedRoute,
    private storageService: StorageService,
    private recentVisitService: RecentVisitService,
    private savePostService: SavePostService,
    private searchUserProfileService: SearchUserProfileService,
    private darkmodeSerive: DarkModeService,
    private checkRefreshToken: CheckRefreshTokenService,
    private shareDataService: ShareDataService,
    private communityService: CommunityService,
    private router: Router
  ) {}

  // @Input() searchOption: string = "posts";
  @Output() isLoadEvent = new EventEmitter<boolean>();

  public isSortOptionShow: boolean = false;
  public isCommunityPage: boolean = false;
  public isHomePage: boolean = false;
  public isPopularPage: boolean = false;
  public isControlPage: boolean = false;
  public isUserPage: boolean = false;
  public isUserPostPage: boolean = false;
  public isSavedPostPage: boolean = false;
  public isCommunityOwner: boolean = false;
  public isWaitApprovePostPage: boolean = false;
  public isModPage: boolean = false;
  public isReviewModPage: boolean = false;
  public isReportModPage: boolean = false;
  public isRemoveModPage: boolean = false;
  public isEditModPage: boolean = false;

  public sort_option: string = "hot";
  public sort_text: string = "Hot";
  public community_id: number = 0;
  public user_id: number = 0;
  public joinCommunityInfo: JoinCommunity = new JoinCommunity(0, false);

  public isDataLoad: boolean = false;
  public wait: boolean = false;
  intervals: any = [];

  public detail_post_arr: DetailPost[] = [];
  public post_id_arr: number[] = [];
  public cur_view_post_id = 0;

  public isHomeRefresh: boolean = false;
  public isPopularRefresh: boolean = false;

  private first_post_amount: number = 15;
  private big_detect_modifier: number = 12;
  private small_detect_modifier: number = 1;
  private get_post_amount: number = 5;

  private timeout: any;
  private refresh_timeout = 120000;

  ngAfterViewInit() {
    if(this.isHomePage) {
      this.shareDataService.cur_home_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollToTopOrPost(this.cur_view_post_id);
      })
    }
    if(this.isPopularPage) {
      this.shareDataService.cur_popular_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollToTopOrPost(this.cur_view_post_id);
      })
    }
    if(this.isCommunityPage) {
      this.shareDataService.cur_community_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollToTopOrPost(this.cur_view_post_id);
      })
    }
    if(this.isUserPostPage) {
      this.shareDataService.cur_user_post_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollUsingInterval(this.cur_view_post_id);
      })
    }
    if(this.isSavedPostPage) {
      this.shareDataService.cur_saved_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollUsingInterval(this.cur_view_post_id);
      })
    }
    if(this.isWaitApprovePostPage) {
      this.shareDataService.cur_wait_approve_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        this.scrollUsingInterval(this.cur_view_post_id);
      })
    }
  }

  scrollToTopOrPost(cur_view_post_id: number) {
    if(cur_view_post_id == 0) {
      console.log("cur view is 0")
      let element = Array.from(document.getElementsByTagName("app-post-main")) as HTMLElement[];
      if(element != null) {
        for(let e of element) {
          e.scrollTo(0,0);
        }
      }
    }
    else {
      let element = document.getElementById(cur_view_post_id.toString());
      if(element != null) {
        console.log("post: "+cur_view_post_id);
        element.scrollIntoView();
      }
    }
  }

  scrollUsingInterval(cur_view_post_id: number) {
    const t = setInterval(() => {
      let element = document.getElementById(cur_view_post_id.toString());
      if(element != null) {
        console.log("scroll "+cur_view_post_id)
        element.scrollIntoView();
        clearInterval(t);
      }
    }, 10);
  }

  ngOnInit() {
    this.checkRefreshToken.runCheckRefreshTokenWithoutNotification();
    this.darkmodeSerive.useDarkMode();
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isCommunityPage = window.location.href.includes("/r/");
    this.isHomePage = window.location.href.includes("/home");
    this.isPopularPage = window.location.href.includes("/popular");
    this.isControlPage = window.location.href.includes("/control-posts/");
    this.isUserPage = window.location.href.includes("/user/");
    this.isModPage = window.location.href.includes("/mod/");
    if(this.isHomePage) {
      this.timeout = setTimeout(()=>{
        this.isHomeRefresh = true;
      }, this.refresh_timeout);
      this.shareDataService.home_post_id_arr$.subscribe(response => {
        this.post_id_arr = response;
      })
      this.shareDataService.home_detail_posts$.subscribe(response => {
        this.detail_post_arr = response;
      })
      this.shareDataService.cur_home_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        console.log("home: "+this.cur_view_post_id);
      })
      this.shareDataService.home_search_option$.subscribe(response => {
        this.sort_option = response;

      })
      this.setSortText(this.sort_option);
      this.getHomePost(uid, this.sort_option);
    }
    if(this.isCommunityPage) {
      let regex = '/r/([0-9]+)';
      const a = window.location.href.match(regex);
      if(a!=null) {
        this.community_id = Number.parseInt(a[1]);
        this.shareDataService.community_post_id_arr$.subscribe(res => this.post_id_arr = res);
        this.shareDataService.community_detail_posts$.subscribe(res => this.detail_post_arr = res);
        this.shareDataService.community_search_option$.subscribe(res => this.sort_option = res);
        this.shareDataService.cur_community_view_post_id$.subscribe(res => this.cur_view_post_id = res);
        this.getCommunityPost(uid, this.sort_option);
        if(uid != 0) {
          this.recentVisitService.setRecentVisit("/set-recent-visit-community", uid, this.community_id).subscribe({
            next: (response: DefaultResponse) => {}
          })
        }
        else {
          let recent_communities_array: number[] = this.storageService.getItem("recent_communities") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_communities") + "]");
          recent_communities_array = recent_communities_array.filter(
            (id) => {return id != this.community_id;}
          )
          let t = recent_communities_array.unshift(this.community_id);
          this.storageService.setItem("recent_communities", recent_communities_array.toString());
        }
      }
    }
    if(this.isPopularPage) {
      this.timeout = setTimeout(()=>{
        this.isHomeRefresh = true;
      }, this.refresh_timeout);
      this.shareDataService.popular_post_id_arr$.subscribe(response => {
        this.post_id_arr = response;
      })
      this.shareDataService.popular_detail_posts$.subscribe(response => {
        this.detail_post_arr = response;
      })
      this.shareDataService.cur_popular_view_post_id$.subscribe(response => {
        this.cur_view_post_id = response;
        console.log("popular: "+this.cur_view_post_id);
      })
      this.shareDataService.popular_search_option$.subscribe(response => {
        this.sort_option = response;

      })
      this.setSortText(this.sort_option);
      this.getPopularPost(uid, this.sort_option);
    }
    if(this.isControlPage) {
      this.community_id = this.activeRoute.snapshot.params["community_id"];
      this.communityService.getCommunityInfoById(this.community_id.toString()).subscribe({
        next: (response: Communities) => {
          const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
          this.isCommunityOwner = response.uid == uid;
          if(this.isCommunityOwner)
            this.getCommunityPostNotAllow(this.community_id);
          else
            window.location.href = "error";
        }
      })
    }
    if(this.isUserPage) {
      const username = this.activeRoute.parent?.snapshot.params['username'];
      this.isUserPostPage = window.location.href.includes("/user/"+username+"/posts");
      this.isSavedPostPage = window.location.href.includes("/user/"+username+"/saved");
      this.isWaitApprovePostPage = window.location.href.includes("/user/"+username+"/wait_for_approve");
      this.searchUserProfileService.getUserProfileByName("/get-user-info-by-username", username).subscribe({
        next: (response: UserProfile) => {
          this.user_id = response.uid;
          if(this.isUserPostPage) {
            this.shareDataService.setProfileOption("posts");
            this.shareDataService.user_detail_posts$.subscribe(res => this.detail_post_arr = res);
            this.shareDataService.user_post_id_arr$.subscribe(res => this.post_id_arr = res);
            this.shareDataService.user_post_search_option$.subscribe(res => this.sort_option = res);
            this.shareDataService.cur_user_post_view_post_id$.subscribe(res => this.cur_view_post_id = res);
            this.setSortText(this.sort_option);
            this.getUserPost(uid, this.sort_option);
          }
          if(this.isSavedPostPage) {
            this.shareDataService.setProfileOption("saved");
            this.shareDataService.saved_detail_posts$.subscribe(res => this.detail_post_arr = res);
            this.shareDataService.saved_post_id_arr$.subscribe(res => this.post_id_arr = res);
            this.shareDataService.cur_saved_view_post_id$.subscribe(res => this.cur_view_post_id = res);
            this.getSavedPostsByUid(uid);
          }
          if(this.isWaitApprovePostPage) {
            this.shareDataService.setProfileOption("wait_for_approve");
            this.shareDataService.wait_for_approve_detail_posts$.subscribe(res => this.detail_post_arr = res);
            this.shareDataService.wait_approve_post_id_arr$.subscribe(res => this.post_id_arr = res);
            this.shareDataService.cur_wait_approve_view_post_id$.subscribe(res => this.cur_view_post_id = res);
            this.getPostsByUidAndNotAllow(uid);
          }
        }
      })
    }
    // if(this.isModPage) {
    //   this.activeRoute.parent!.paramMap.subscribe(params => {
    //     this.community_id = Number.parseInt(params.get('community_id')!);
    //   });
      // this.isReviewModPage = window.location.href.includes("/review");
      // this.isReportModPage = window.location.href.includes("/report");
      // this.isRemoveModPage = window.location.href.includes("/remove");
      // this.isEditModPage = window.location.href.includes("/edit");
      // if(this.isReviewModPage) {
      //   this.shareDataService.review_post_id_arr$.subscribe(res => this.post_id_arr = res);
      //   this.shareDataService.review_detail_posts$.subscribe(res => this.detail_post_arr = res);
      //   this.shareDataService.review_search_option$.subscribe(res => this.sort_option = res);
      //   this.shareDataService.cur_review_view_post_id$.subscribe(res => this.cur_view_post_id = res);
      //   this.getCommunityPostNotAllow(this.community_id);
      // }
    // }
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event) {
      this.isSortOptionShow = false;
      const cellText = document.getSelection();
      if (cellText?.type === 'Range') 
        event.stopPropagation();
  }

  ngOnChanges() {
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
    clearTimeout(this.timeout);
    if(this.isHomePage) {
      this.isHomeRefresh = false;
      this.timeout = setTimeout(()=>{
        this.isHomeRefresh = true;
      }, this.refresh_timeout);
    }
    if(this.isPopularPage) {
      this.isPopularRefresh = false;
      this.timeout = setTimeout(()=>{
        this.isPopularRefresh = true;
      }, this.refresh_timeout);
    }
    this.sort_option = sort_type;
    this.setSortText(sort_type);
    this.isSortOptionShow = !this.isSortOptionShow;
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.post_id_arr = [];
    this.detail_post_arr = [];
    // this.shareDataService.setDetailPosts(this.detail_post_arr);
    // this.shareDataService.setPostIdArr(this.post_id_arr);
    for(let i of this.intervals) {
      clearInterval(i);
    }
    if(this.isCommunityPage) {
      this.shareDataService.setCommunitySearchOption(sort_type);
      this.getCommunityPost(uid, sort_type);
    }
    if(this.isPopularPage) {
      this.shareDataService.setPopularSearchOption(sort_type);
      this.getPopularPost(uid, sort_type);
    }
    if(this.isHomePage) {
      this.shareDataService.setHomeSearchOption(sort_type);
      this.getHomePost(uid, sort_type);
    }
    if(this.isUserPage) {
      this.shareDataService.setUserPostSearchOption(sort_type);
      this.getUserPost(uid, sort_type);
    }
  }

  showSortOption(event: any) {
    event.stopPropagation();
    this.isSortOptionShow = !this.isSortOptionShow;
  }

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

  getPostsByCheckViewPort(detail_post_arr: DetailPost[], post_id_arr: number[], uid: number, start: number, detect_modifier: number, get_post_amount: number) {
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
            this.getPostService.getDetailPostByUidAndPostIds(uid, id).subscribe({
              next: (response: DetailPost[]) => {
                this.isDataLoad = false;
                for(let p of response) {
                  detail_post_arr.push(p);
                }
                // if(!this.isUserPage && !this.isHomePage && !this.isPopularPage && !this.isCommunityPage)
                //   this.shareDataService.setDetailPosts(detail_post_arr);
                if(this.isHomePage) {
                  this.shareDataService.setHomeDetailPosts(detail_post_arr);
                }
                if(this.isPopularPage) {
                  this.shareDataService.setPopularDetailPosts(detail_post_arr);
                }
                if(this.isCommunityPage) {
                  this.shareDataService.setCommunityDetailPosts(detail_post_arr);
                }
                if(this.isUserPostPage)
                  this.shareDataService.setUserDetailPosts(detail_post_arr);
                if(this.isSavedPostPage)
                  this.shareDataService.setSavedDetailPosts(detail_post_arr);
                if(this.isWaitApprovePostPage)
                  this.shareDataService.setWaitForApproveDetailPosts(detail_post_arr);
                if(this.isReviewModPage) 
                  this.shareDataService.setReviewDetailPosts(detail_post_arr);
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
      console.log("full detail posts");
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
          if(this.isHomePage) {
            this.shareDataService.setHomeDetailPosts(detail_post_arr);
          }
          if(this.isPopularPage) {
            this.shareDataService.setPopularDetailPosts(detail_post_arr);
          }
          if(this.isCommunityPage) {
            this.shareDataService.setCommunityDetailPosts(detail_post_arr);
          }
          if(this.isUserPostPage)
            this.shareDataService.setUserDetailPosts(detail_post_arr);
          if(this.isSavedPostPage)
            this.shareDataService.setSavedDetailPosts(detail_post_arr);
          if(this.isWaitApprovePostPage)
            this.shareDataService.setWaitForApproveDetailPosts(detail_post_arr);
          if(this.isReviewModPage) 
            this.shareDataService.setReviewDetailPosts(detail_post_arr);
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
    // if(!this.isUserPage && !this.isHomePage && !this.isPopularPage && !this.isCommunityPage)
    //   this.shareDataService.setDetailPosts(detail_post_arr);
    if(this.isHomePage) {
      this.shareDataService.setHomeDetailPosts(detail_post_arr);
    }
    if(this.isPopularPage) {
      this.shareDataService.setPopularDetailPosts(detail_post_arr);
    }
    if(this.isCommunityPage) {
      this.shareDataService.setCommunityDetailPosts(detail_post_arr);
    }
    if(this.isUserPostPage)
      this.shareDataService.setUserDetailPosts(detail_post_arr);
    if(this.isSavedPostPage)
      this.shareDataService.setSavedDetailPosts(detail_post_arr);
    if(this.isWaitApprovePostPage)
      this.shareDataService.setWaitForApproveDetailPosts(detail_post_arr);
    if(this.isReviewModPage) 
      this.shareDataService.setReviewDetailPosts(detail_post_arr);
  }

  getHomePost(uid: number, sort_type: string) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getHomePosts("/get-home-posts", uid, sort_type).subscribe({
        next: (response: any) => {
          this.post_id_arr = response;
          if(response.length == 0) {
            this.getPopularPost(0, sort_type);
          }
          else {
            this.wait = this.post_id_arr.length == 0;
            this.shareDataService.setHomePostIdArr(this.post_id_arr);
            this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
          }
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  getPopularPost(uid: number, sort_type: string) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid,this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getPopularPostIdsByUid("/get-popular-posts", uid, sort_type).subscribe({
        next: (response: number[]) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setPopularPostIdArr(this.post_id_arr);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  getCommunityPost(uid: number, sort_type: string) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getPostInCommunity("/get-community-posts", this.community_id, sort_type).subscribe({
        next: (response: any) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setCommunityPostIdArr(this.post_id_arr);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  getUserPost(uid: number, sort_type: string) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getPostByUser("/get-posts-by-uid", this.user_id, sort_type).subscribe({
        next: (response: number[]) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setUserPostIds(response);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  getCommunityPostNotAllow(uid: number) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getPostInCommunityNotAllow("/get-control-posts", this.community_id).subscribe({
        next: (response: number[]) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setReviewPostIdArr(this.post_id_arr);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  joinCommunityEvent(info: JoinCommunity) {
    this.joinCommunityInfo = info;
  }

  allowPostEvent(post_id: number) {
    this.post_id_arr = this.post_id_arr.filter( id => {
      return id !== post_id;
    });
    this.detail_post_arr = this.detail_post_arr.filter( post => {
      return post.post_id !== post_id;
    });
    this.shareDataService.setWaitApprovePostIds(this.post_id_arr);
    this.shareDataService.setWaitForApproveDetailPosts(this.detail_post_arr);
  }

  getPostsByUidAndNotAllow(uid: number) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else {
      this.getPostsService.getPostsByUidAndNotAllowAndNotDeleted("/get-posts-by-uid-not-delete-not-allow", uid).subscribe({
        next: (response: number[]) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setWaitApprovePostIds(response);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  getSavedPostsByUid(uid: number) {
    this.isDataLoad = true;
    this.wait = false;
    if(this.detail_post_arr.length != 0) {
      this.resumeLoadPosts(this.detail_post_arr, this.post_id_arr, uid, this.small_detect_modifier, this.get_post_amount);
    }
    else if (this.detail_post_arr.length == this.post_id_arr.length && this.post_id_arr.length != 0)
      this.wait = false;
    else {
      this.savePostService.getSavedPostsByUid(uid).subscribe({
        next: (response: number[]) => {
          this.post_id_arr = response;
          this.wait = this.post_id_arr.length == 0;
          this.shareDataService.setSavedPostIds(response);
          this.getAllDetailPostsByUidAndPostIds(this.detail_post_arr, this.post_id_arr, uid, this.first_post_amount, this.big_detect_modifier, this.get_post_amount);
        },
        error: (e: HttpErrorResponse) => {
          this.isDataLoad = false;
          this.wait = true;
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }

  refreshPage() {
    window.location.reload();
  }
}
