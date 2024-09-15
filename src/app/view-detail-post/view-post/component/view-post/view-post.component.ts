
  import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
  import { StorageService } from 'src/app/shared/storage/storage.service';
  import { HttpErrorResponse } from '@angular/common/http';
  import { VotePostService } from '../../../../post-link/post-link/service/vote-post/vote-post.service';
  import { CheckVotePostService } from '../../../../post-link/post-link/service/check-vote-post/check-vote-post.service';
  import { CheckVotePostResponse } from '../../../../post-link/post-link/service/check-vote-post/pojo/check-vote-post-response';
  import { VotePostResponse } from '../../../../post-link/post-link/service/vote-post/pojo/vote-post-response';
  import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
  import Swal from 'sweetalert2';
  import { DeletePostService } from 'src/app/edit-post/service/delete-post/delete-post.service';
  import { DeletePostResponse } from 'src/app/edit-post/pojo/delete-post-response';
  import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
  import { JoinCommunityResponse } from 'src/app/shared/services/search-communites/pojo/join-community-response';
  import { Communities } from 'src/app/shared/pojo/pojo/communities';
  import { AllowPostService } from 'src/app/post-link/post-link/service/allow-post/allow-post.service';
  import { DefaultResponse } from 'src/app/shared/pojo/default-response';
  import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
  import { SavePostService } from 'src/app/shared/services/save-post/save-post.service';
  import { SavedPostResponse } from 'src/app/shared/services/save-post/pojo/saved-post-response';
  import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
  import { VoteImgService } from 'src/app/shared/services/vote-img/vote-img.service';
  import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
  import { DomSanitizer, Title } from '@angular/platform-browser';
  import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
  import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
  import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { ChangedPost } from 'src/app/shared/services/share_data/changed-post';
import { FirstLast } from 'src/app/shared/services/share_data/first-last';

  @Component({
    selector: 'app-post',
    templateUrl: './view-post.component.html',
    styleUrl: './view-post.component.scss'
  })
  export class PostComponent {
    constructor (
      private votePostServie: VotePostService,
      private storageService: StorageService,
      private dateTimeService: DateTimeService,
      private checkVotePostService: CheckVotePostService,
      private deletePostService: DeletePostService,
      private activeRoute: ActivatedRoute,
      private communityService: CommunityService,
      private allowPostService: AllowPostService,
      public presentationService: PresentationService,
      private savePostService: SavePostService,
      private darkmodeSerive: DarkModeService,
      public voteImgService: VoteImgService,
      private checkRefreshToken: CheckRefreshTokenService,
      public sanitizer: DomSanitizer,
      private getPostService: GetPostService,
      private getCommentService: GetCommentsService,
      private titleService: Title,
      private shareDataService: ShareDataService
    ) {}

    @Input() commentCount: number = 0;
  
    post: DetailPost = new DetailPost();
    post_id: number = 0;
      
    public previousVoteType: string|null = this.post.voteType;
    public previousVote: number = this.post.vote;
    public shownDate: string = "";
    public isOptionMenuOpen: boolean = false;
    public isAuthor: boolean = false;
    public isHomePage: boolean = false;

    public selected_mod_post: number = 0;
    public isModPage: boolean = false;

    public firstLast: FirstLast = new FirstLast(0,0);

    public  upvote = "../../../../../assets/icon/upvote.png"
    public  upvote_fill = "../../../../../assets/icon/upvote-fill.png"
    public  downvote = "../../../../../assets/icon/downvote.png"
    public  downvote_fill = "../../../../../assets/icon/downvote-fill.png"

    ngOnInit() {
      this.darkmodeSerive.useDarkMode();
      this.voteImgService.selectDownVoteImg();
      this.voteImgService.selectUpVoteImg();
      this.isModPage = window.location.href.includes("/mod/");
      if(this.isModPage) {
        this.shareDataService.mod_detail_post$.subscribe(res => {
          if(res != undefined) {
            if(res.post_id == 0) {
              this.post = new DetailPost();
            }
            else {
              const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
              this.getPostService.getDetailPostByUidAndPostId(uid, res.post_id).subscribe({
                next: (response: DetailPost) =>{
                  this.post = response;
                  this.setPostInfo(res);
                  this.timer();
                }
              })
            }
          }
        });
        this.shareDataService.first_last$.subscribe(res => {
          this.firstLast = res;
        })
        this.shareDataService.changed_post$.subscribe(res => {
          this.post.deleted = res.deleted == 1 ? 1 : 0;
          this.post.allow = res.allow == 1 ? 1 : 0;
        })
      }
      if(!this.isModPage) {
        this.post_id = this.activeRoute.snapshot.params['post_id'];
        const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
        this.getPostService.getDetailPostByUidAndPostId(uid, this.post_id).subscribe({
          next: (response: DetailPost) => {
            this.post = response;
            //set title using post title
            this.activeRoute.paramMap.subscribe(params => {
              this.titleService.setTitle(this.post.title);
            });
            this.setPostInfo(response);
            this.timer();
          }
        })
      }
    }  

    setPostInfo(post: DetailPost) {
      const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(post.created_at);
      this.isAuthor = post.uid === uid;
      if((post.join == null || post.voteType == null || post.save == null) && (uid != 0)) {
        this.communityService.checkJoinCommunityStatus(uid, post.community_id).subscribe({
          next: (response: JoinCommunityResponse) => {
            post.join = response.join_community;
            this.replacePost(post);
          }
        })
        this.savePostService.getSavedPostStatusByUid(uid, post.post_id).subscribe({
          next: (response: SavedPostResponse) => {
            post.save = response.saved;
            this.replacePost(post);
          }
        })
        this.checkVotePostService.checkVotePost(post.post_id, uid).subscribe({
          next: (response: CheckVotePostResponse) => {
            post.voteType = response.vote_type;
            this.replacePost(post);
          }
        })
      }
      if(uid == 0) {
        post.join = null;
        post.save = null;
        post.voteType = null;
        this.replacePost(post);
      }
      post.content = post.content.replace(/<img/g, '<img class="img" ');
      post.content = post.content.replace(/<figure/g, '<figure class="figure" ');
      post.content = post.content.replace(/<figcaption/g, '<figcaption class="figcaption" ');
      post.content = post.content.replace(/<pre/g, '<pre class="pre_code" ');
      post.content = post.content.replace(/<code/g, '<code class="code" ');
      post.content = post.content.replace(/<ol/g, '<ol class="ol" ');
      post.content = post.content.replace(/<ul/g, '<ul class="ul" ');
      post.content = post.content.replace(/<a/g, '<a class="a" ');
      post.content = post.content.replace(/<p/g, '<p class="post_view" ');
      post.content = post.content.replace(/<blockquote/g, '<blockquote class="blockquote" ');
    }

    replacePost(p: DetailPost) {
      const post_arr: DetailPost[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
      for(let post of post_arr) {
        if (p.post_id == post.post_id) {
          post.join = p.join;
          post.save = p.save;
          post.voteType = p.voteType;
        }
      }
      this.storageService.setItem("posts", JSON.stringify(post_arr));
    }

    timer() {
      setTimeout(() => {
        const e = document.getElementById("post_container") == null ? null : document.getElementById("post_container");
        if(e == null)
          this.timer();
        else {
          e.innerHTML = this.post.content;
        }
      }, 100);
    }
  
    preventClick(event: Event) {
      event.stopPropagation();
    }
  
    openOptionMenu(event: Event) {
      this.isOptionMenuOpen = !this.isOptionMenuOpen;
      event.stopPropagation();
    }

    editPost(event: Event) {
      window.location.href = "/edit-post/" + this.post_id;
    }
  
    navigateToCommunity() {
      window.location.href = "/r/" + this.post.community_id;
    }
  
    votePost(event: Event, type: string) {
      event.stopPropagation();
      const voteInfo = this.votePostServie.prepareVote(type, this.post);
      // this.votePostServie.sendVotePostToServer(this.post, voteInfo);
      const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
      this.votePostServie.votePost(this.post.post_id, voteInfo.curVote, uid, voteInfo.curVoteType!).subscribe({
        next: (response: VotePostResponse) => {
          this.post.vote = voteInfo.curVote;
          this.post.voteType = voteInfo.curVoteType;
        }

      })
    }

    deletePost() {
      this.deletePostService.sendDeleteToServer(this.post, 1, null);
      // let t = setInterval(()=>{
      //   if(this.post.deleted == 1) {
      //     window.location.reload();
      //   }
      // }, 100);
    }

    allowPost(event: Event) {
      this.allowPostService.setAllowPost(this.post.post_id, 1).subscribe({
        next: (response: DefaultResponse) => {
          this.post.allow = 1;
          this.shareDataService.setChangedPost(new ChangedPost(this.post.post_id, 1, 0, this.dateTimeService.getCurrentDateTime().toISOString(), ""));
          // this.shareDataService.setModDetailPost(this.post);
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }

    notAllowPost(event: Event) {
      const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
      this.deletePostService.deletePost(this.post.post_id, uid, 2).subscribe({
        next: (response: DeletePostResponse) => {
          this.post.deleted = 1;
          this.shareDataService.setChangedPost(new ChangedPost(this.post.post_id, this.post.allow, 1, "", this.dateTimeService.getCurrentDateTime().toISOString()));
          // this.shareDataService.setModDetailPost(this.post);
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }

    savePost(event: Event) {
      event.stopPropagation();
      this.savePostService.sendSavePostToServer(this.post, this.post.save == 1 ? 0 : 1);
    }

    CloseViewPost(event: Event) {
      event.stopPropagation();
      this.shareDataService.setModDetailPost(new DetailPost());
    }

    goToPreviousPost(event: Event) {
      this.shareDataService.setModSelectedPostId(-1);
    }

    goToNextPost(event: Event) {
      this.shareDataService.setModSelectedPostId(1);
    }
  }
  
