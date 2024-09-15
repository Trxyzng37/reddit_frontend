import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VotePostService } from '../service/vote-post/vote-post.service';
import { CheckVotePostService } from '../service/check-vote-post/check-vote-post.service';
import { CheckVotePostResponse } from '../service/check-vote-post/pojo/check-vote-post-response';
import { VotePostResponse } from '../service/vote-post/pojo/vote-post-response';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { CommentInfo } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { JoinCommunityResponse } from 'src/app/shared/services/search-communites/pojo/join-community-response';
import { CheckShowPostService } from 'src/app/shared/services/check-show-post/check-show-post.service';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { AllowPostService } from '../service/allow-post/allow-post.service';
import { DeletePostService } from 'src/app/edit-post/service/delete-post/delete-post.service';
import { DeletePostResponse } from 'src/app/edit-post/pojo/delete-post-response';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import { SavePostService } from 'src/app/shared/services/save-post/save-post.service';
import { SavedPostResponse } from 'src/app/shared/services/save-post/pojo/saved-post-response';
import Swal from 'sweetalert2';
import { VoteImgService } from 'src/app/shared/services/vote-img/vote-img.service';
import { JoinCommunity } from 'src/app/shared/pojo/join-community';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html',
  styleUrl: './post-link.component.scss'
})
export class PostLinkComponent {
  constructor (
    private router: Router,
    private votePostServie: VotePostService,
    private storageService: StorageService,
    private dateTimeService: DateTimeService,
    private checkVotePostService: CheckVotePostService,
    private getCommentService: GetCommentsService,
    private communityService: CommunityService,
    private showPostService: CheckShowPostService,
    private allowPostService: AllowPostService,
    private deletePostService: DeletePostService,
    public presentationService: PresentationService,
    private savePostService: SavePostService,
    public voteImgService: VoteImgService,
    private shareDataService: ShareDataService,
    private activeRoute: ActivatedRoute,
  ) {}

  @Input() post!: DetailPost;
  @Input() post_id: number = 0;
  @Input() type: string = "";
  @Input() communityName: string = "";
  @Input() userName: string = "";
  @Input() title: string = "";
  @Input() content: string = "";
  @Input() created_at: string = "";
  @Input() vote: number = 1;
  @Input() communityIcon: string = "";
  @Input() index: number = 0;
  @Input() arr_length: number = 0;
  @Input() joinCommunityInfo: JoinCommunity = new JoinCommunity(0, false);
  // @Input() joinCommunityEventCount: number = 0;

  @Output() event = new EventEmitter<GetPostResponse>();
  @Output() joinCommunityEvent = new EventEmitter<JoinCommunity>();
  @Output() allowPostEvent = new EventEmitter<number>(); //emit post_id
    
  public voteType: string = 'none'; //none upvote downvote
  public previousVote: number = this.vote;
  public previousVoteType: string = "";
  public shownDate: string = "";
  public comment_count: number = 0;
  public isHomePage: boolean = false;
  public isPopularPage: boolean = false;
  public isCommunityPage: boolean = false;
  public isControlPage: boolean = false;
  public isUserPage: boolean = false;
  public isUserPostPage: boolean = false;
  public isSavedPostPage: boolean = false;
  public isWaitApprovePostPage: boolean = false;
  public isModPage: boolean = false;
  public isReviewModPage: boolean = false;
  public isReportModPage: boolean = false;
  public isRemoveModPage: boolean = false;
  public isEditModPage: boolean = false;

  public communityInfo: Communities = new Communities(0,"",0,"","",0,"","",0,0);
  public saved: boolean = false;
  public savedText: string = this.saved ? 'Unsave' : "Save";
  public subscribed_communities: Communities[] = [];

  public  upvote = "../../../../../assets/icon/upvote.png";
  public  upvote_fill = "../../../../../assets/icon/upvote-fill.png";
  public  downvote = "../../../../../assets/icon/downvote.png";
  public  downvote_fill = "../../../../../assets/icon/downvote-fill.png";

  ngOnInit() {
    this.shareDataService.subscribed_communities$.subscribe(res => {
      this.subscribed_communities = res;
    })
    this.getCommentService.countComments(this.post_id).subscribe({
      next: (response: number) => {
        this.comment_count = response;
      }
    })
    this.voteImgService.selectDownVoteImg();
    this.voteImgService.selectUpVoteImg();
    this.isHomePage = window.location.href.includes('/home');
    this.isPopularPage = window.location.href.includes('/popular');
    this.isCommunityPage = window.location.href.includes('/r/');
    this.isControlPage = window.location.href.includes("/control-posts/");
    this.isUserPage = window.location.href.includes('/user/');
    this.isModPage = window.location.href.includes("/mod/");
    if(this.isUserPage) {
      const username = this.activeRoute.parent?.snapshot.params['username'];
      this.isUserPostPage = window.location.href.includes("/user/"+username+"/posts");
      this.isSavedPostPage = window.location.href.includes("/user/"+username+"/saved");
      this.isWaitApprovePostPage = window.location.href.includes("/user/"+username+"/wait_for_approve");
    }
    if(this.isModPage) {
      this.isReviewModPage = window.location.href.includes("/review");
      this.isReportModPage = window.location.href.includes("/report");
      this.isRemoveModPage = window.location.href.includes("/remove");
      this.isEditModPage = window.location.href.includes("/edit");
    }
    this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(this.post.created_at);
    const uid: number = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    if(uid == 0) {
      this.post.join = null;
      this.post.save = null;
      this.post.voteType = null;
    }
    if((this.post.join == null) && (uid != 0)) {
      this.communityService.checkJoinCommunityStatus(uid, this.post.community_id).subscribe({
        next: (response: JoinCommunityResponse) => {
          this.post.join = response.join_community;
          this.shareDataService.setJoinCommunityOfDetailPosts(this.post.community_id, response.join_community);
        }
      })
    }
    if((this.post.save == null) && (uid != 0)) {
      this.savePostService.getSavedPostStatusByUid(uid, this.post.post_id).subscribe({
        next: (response: SavedPostResponse) => {
          this.post.save = response.saved;
          this.shareDataService.setSaveStatusOfDetailPosts(this.post.post_id, response.saved);
        }
      })
    }
    if((this.post.voteType == null) && (uid != 0)) {
      this.checkVotePostService.checkVotePost(this.post.post_id, uid).subscribe({
        next: (response: CheckVotePostResponse) => {
          this.post.voteType = response.vote_type;
          this.shareDataService.setVoteTypeOfDetailPosts(this.post.post_id, this.voteType);
        }
      })
    }
    if(this.post.type == "editor") {
        let figure_pattern = /<figure class="image">([\s\S]*?)<\/figure>/g;
        this.content = this.content.replace(figure_pattern, (match, url) => {
          const s = match.match('src="([^"]+)"')
          return `<a>${s![1]}</a>`;
        });
        let img_pattern = /<img src="[^"]*" alt="">/g;
        this.content = this.content.replace(img_pattern, (match, url) => {
          const s = match.match('src="([^"]+)"')
          return `<a>${s![1]}</a>`;
        });   
    }
  }  

  ngOnChanges() {
    if(this.joinCommunityInfo.community_id == this.post.community_id) {
      this.post.join = this.joinCommunityInfo.join ? 1 : 0;
      this.shareDataService.setJoinCommunityOfDetailPosts(this.post.post_id, this.joinCommunityInfo.join ? 1 : 0);
    }
  }

  navigateToPost() {
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
      this.shareDataService.setCurViewPostId(this.post_id);
    if(this.isHomePage) {
      this.shareDataService.setHomeCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isPopularPage) {
      this.shareDataService.setPopularCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isCommunityPage) {
      this.shareDataService.setCommunityCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isUserPostPage) {
      this.shareDataService.setUserPostCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isSavedPostPage) {
      this.shareDataService.setSavedCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isWaitApprovePostPage) {
      this.shareDataService.setWaitForApproveCurViewPostId(this.post_id);
      this.router.navigate(['post/'+this.post_id]);
    }
    if(this.isReviewModPage) {
      this.router.navigate(['mod/'+this.post.community_id+"/review/"+this.post_id]);
    }
  }

  navigateToCommunity() {
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    // this.storageService.setItem("time", created_at.toISOString());
    // if(!this.isHomePage && !this.isPopularPage)
    //   this.shareDataService.setCurViewPostId(this.post_id);
    // if(this.isHomePage)
    //   this.shareDataService.setHomeCurViewPostId(this.post_id);
    // if(this.isPopularPage)
    //   this.shareDataService.setPopularCurViewPostId(this.post_id);
    // if(this.isCommunityPage)
    //   this.shareDataService.setCommunityCurViewPostId(this.post_id);
    this.router.navigate(['r/'+this.post.community_id]);
  }

  linkClick(event: Event) {
    event.preventDefault();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  public isOptionMenuOpen: boolean = false;
  openOptionMenu(event: Event) {
    this.isOptionMenuOpen = !this.isOptionMenuOpen;
    event.stopPropagation();
  }

  showCount: number = 0;
  onIntersection({ target, visible }: { target: Element; visible: boolean }) {
    if (visible) {
      console.log("Post index: "+this.index);
      this.showCount++;
      if(this.showCount == 1) {
        const uid: number = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
        // if(uid != 0)
          // this.showPostService.setShowPost(uid, this.post_id, 1).subscribe({})
      }

      // console.log("count: "+this.count)
      // this.count++;
      // console.log("LENGTH: "+this.arr_length);
      // console.log(this.index===this.arr_length-1)
      // if(this.index == (this.arr_length-1)) {
      //   if(confirm("END OF PAGE. Want to add new post")) {
      //     // const o: GetPostResponse = new GetPostResponse(this.post_id+1, "new page"+1, "test"+1, this.created_at, this.vote+1, this.communityIcon);
      //     console.log("Add new post: ");
      //     // this.addNewPost(o);
      //   }
      //   else {
      //     console.log("No add post")
      //   }
      // }
    }
  }

  // addNewPost(o: GetPostResponse) {
  //   this.event.emit(o);
  // }

  votePost(event: Event, type: string) {
    event.stopPropagation();
      const voteInfo = this.votePostServie.prepareVote(type, this.post);
      this.votePostServie.sendVotePostToServer(this.post, voteInfo);
      // if(voteInfo.curVoteType != "none" && voteInfo.curVoteType != null) {
      //   this.upvote = this.voteImgService.upvote_light;
      //   this.downvote = this.voteImgService.downvote_light;
      //   this.voteImgService.downvote = this.voteImgService.downvote_light;
      //   this.voteImgService.upvote = this.voteImgService.upvote_light;
      // }
      // else {
      //   this.upvote = this.voteImgService.upvote_dark;
      //   this.downvote = this.voteImgService.downvote_dark;
      //   this.voteImgService.downvote = this.voteImgService.downvote_dark;
      //   this.voteImgService.upvote = this.voteImgService.upvote_dark;
      // }
  }

  sendJoinCommunityFromPostToServer(post: DetailPost, join: number) {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.communityService.joinCommunity(uid, post.community_id, join).subscribe({
      next: (response: JoinCommunityResponse) => {
        post.join = join;
        this.communityService.getCommunityInfoById(post.community_id.toString()).subscribe({
          next: (cresponse) => {
            if(response.join_community == 1)
              this.subscribed_communities.unshift(cresponse);
            else
              this.subscribed_communities = this.subscribed_communities.filter((community) => {
                return community.id != cresponse.id;
              })
            this.shareDataService.setSubscribedCommunities(this.subscribed_communities);
            this.shareDataService.setJoinCommunityOfDetailPosts(post.community_id, post.join);
          }
        })
        this.joinCommunityEvent.emit(new JoinCommunity(this.post.community_id, this.post.join == 1 ? true : false));
      }
    })
  }

  joinCommunity(event: Event) {
    event.stopPropagation();
    this.sendJoinCommunityFromPostToServer(this.post, this.post.join == 1 ? 0 : 1);
  }

  allowPost(event: Event) {
    event.stopPropagation();
    this.allowPostService.sendAllowToServer(this.post, 1, this.allowPostEvent);
  }

  deletePost(event: Event) {
    event.stopPropagation();
    Swal.fire({
      titleText: "Delete this post ?",
      text: "Change can not be undo",
      icon: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      showConfirmButton: true
    }).then((result) => {
      if(result.isConfirmed) {
        this.deletePostService.sendDeleteToServer(this.post, 2, this.allowPostEvent);
      }
    })
  }

  savePost(event: Event) {
    event.stopPropagation();
    this.savePostService.sendSavePostToServer(this.post, this.post.save == 1 ? 0 : 1);
  }
}
