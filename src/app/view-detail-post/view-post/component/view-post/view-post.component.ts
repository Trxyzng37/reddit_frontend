
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
  import { DomSanitizer } from '@angular/platform-browser';
  import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
  import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
  import { Comment } from '../../../view-detail-post/pojo/comment';

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
      private getCommentService: GetCommentsService
    ) {}

    @Input() commentCount: number = 0;
  
     post: GetPostResponse = new GetPostResponse(0,"",0,"","",0,"","","","","",0,0,0);
     post_id: number = 0;
      
    public voteType: string = 'none'; //none upvote downvote
    public previousVoteType: string = "";
    public previousVote: number = this.post.vote;
    public shownDate: string = "";
    public isOptionMenuOpen: boolean = false;
    public isAuthor: boolean = false;
    public isCommunityOwner: boolean = false;
    public isAllow: boolean = false;
    public isHomePage: boolean = false;
    public isJoinCommunity: boolean = false;
    public isDeleted: boolean = false;
    public joinText: string = this.isJoinCommunity ? 'Leave' : 'Join';
    public communityInfo: Communities = new Communities(0,'',0,'','',0,'','',0,0);

    public  upvote = "../../../../../assets/icon/upvote.png"
    public  upvote_fill = "../../../../../assets/icon/upvote-fill.png"
    public  downvote = "../../../../../assets/icon/downvote.png"
    public  downvote_fill = "../../../../../assets/icon/downvote-fill.png"

    public saved: boolean = false;
    public savedText: string = this.saved ? 'Unsave' : "Save";

    ngOnInit() {
      this.darkmodeSerive.useDarkMode();
      this.voteImgService.selectDownVoteImg();
      this.voteImgService.selectUpVoteImg();
      this.post_id = this.activeRoute.snapshot.params['post_id'];
      const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      const post_arr: GetPostResponse[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
      let is_post_exist: boolean = false;
      for(let post of post_arr) {
        if(post.post_id == Number.parseInt(this.activeRoute.snapshot.params['post_id'])) {
          is_post_exist = true;
          this.post = post;
          this.getInfo(post);
          this.timer();
        }
      }
      if(!is_post_exist) {
        this.getPostService.getPostByPostId(this.post_id).subscribe({
          next: (response: GetPostResponse) => {
            this.post = response;
            this.getInfo(response);
            post_arr.push(response);
            this.storageService.setItem("posts", JSON.stringify(post_arr));
            this.timer();
          }
        })
      }
    }  

    getInfo(post: GetPostResponse) {
      const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(post.created_at);
      this.isAllow = post.allow == 1 ? true : false;
      this.isDeleted = post.deleted == 0 ? false : true;
      this.isAuthor = post.uid === uid;
      if(uid != 0) {
        this.communityService.getCommunityInfoById(post.community_id.toString()).subscribe({
          next: (response: Communities) => {
            this.communityInfo = response;
            this.isCommunityOwner = uid == this.communityInfo.uid;
          }
        })
        this.savePostService.getSavedPostStatusByUid(uid, post.post_id).subscribe({
          next: (response: SavedPostResponse) => {
            this.saved = response.saved == 1 ? true : false;
            this.savedText = response.saved == 1 ? 'Unsave' : "Save";
          }
        })
        this.checkVotePostService.checkVotePost(post.post_id, uid).subscribe({
          next: (response: CheckVotePostResponse) => {
            this.voteType  = response.vote_type;
          },
          error: (e: HttpErrorResponse) => {
            console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          }
        })
      }
      post.content = post.content.replace(/<img/g, '<img class="img" ');
      post.content = post.content.replace(/<figure/g, '<figure class="figure" ');
      post.content = post.content.replace(/<figcaption/g, '<figcaption class="figcaption" ');
      post.content = post.content.replace(/<pre/g, '<pre class="pre_code" ');
      post.content = post.content.replace(/<code/g, '<code class="code" ');
      post.content = post.content.replace(/<ol/g, '<ol class="ol" ');
      post.content = post.content.replace(/<ul/g, '<ul class="ul" ');
      post.content = post.content.replace(/<a/g, '<a class="a" ');
      post.content = post.content.replace(/<p/g, '<p class="p" ');
      post.content = post.content.replace(/<blockquote/g, '<blockquote class="blockquote" ');
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
      this.previousVoteType = this.voteType;
      if (this.voteType === 'none' && type === 'upvote') {
        this.previousVote = this.post.vote;
        this.post.vote += 1;
        this.voteType = 'upvote';
      }
      else if (this.voteType === 'none' && type === 'downvote') {
        this.previousVote = this.post.vote;
        this.post.vote -= 1;
        this.voteType = 'downvote';
      }
      else if (this.voteType === 'upvote' && type === 'upvote') {
        this.previousVote = this.post.vote;
        this.post.vote -= 1;
        this.voteType = 'none';
      }
      else if (this.voteType === 'upvote' && type === 'downvote') {
        this.previousVote = this.post.vote;
        this.post.vote -= 2;
        this.voteType = 'downvote';
      }
      else if (this.voteType === 'downvote' && type === 'upvote') {
        this.previousVote = this.post.vote;
        this.post.vote += 2;
        this.voteType = 'upvote';
      }
      else if (this.voteType === 'downvote' && type === 'downvote') {
        this.previousVote = this.post.vote;
        this.post.vote += 1;
        this.voteType = 'none';
      }
      console.log(this.post_id + ": " + this.post.vote);
      this.sendVotePostToServer();
    }
  
    sendVotePostToServer() {
      const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      this.votePostServie.votePost(this.post_id, this.post.vote, uid, this.voteType).subscribe({
        next: (response: VotePostResponse) => {
          const post_arr: GetPostResponse[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
          for(let post of post_arr) {
            if(post.post_id == Number.parseInt(this.activeRoute.snapshot.params['post_id'])) {
              post.vote = this.post.vote;
              this.storageService.setItem("posts", JSON.stringify(post_arr));
            }
          }
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          this.post.vote = this.previousVote;
          this.voteType = this.previousVoteType;
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
          this.deletePostService.deletePost("/delete-post", this.post_id, uid, 'user').subscribe({
            next: (response: DeletePostResponse) => {
              let post_arr: GetPostResponse[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
              post_arr = post_arr.filter(
                (id) => {return id.post_id != this.post_id;}
              )
              this.storageService.setItem("posts", JSON.stringify(post_arr));
              Swal.fire('Delete post successfully', '', 'success').then((result) => {
                if (result.isConfirmed) {
                  window.history.back();
                }
              })
            },
            error: (e: HttpErrorResponse) => {
              Swal.fire('Error delete post. Please try again', '', 'error')
            }
          })
        }
      })
    }

    joinCommunity(event: Event) {
      event.stopPropagation();
      const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
      this.communityService.joinCommunity(uid, this.post.community_id, this.isJoinCommunity == false ? 1 : 0).subscribe({
        next: (response: JoinCommunityResponse) => {
          this.isJoinCommunity = response.join_community == 0 ? false : true;
          this.joinText = this.isJoinCommunity ? 'Leave' : 'Join';
        },
        error: (e: HttpErrorResponse) => {
          console.log("error join community");
        }
      })
    }

    allowPost(event: Event) {
      this.allowPostService.setAllowPost(this.post_id, 1).subscribe({
        next: (response: DefaultResponse) => {
          this.isAllow = true;
          const post_arr: GetPostResponse[] = this.storageService.getItem("posts") == "" ? [] : JSON.parse(this.storageService.getItem("posts"));
          for(let post of post_arr) {
            if(post.post_id == Number.parseInt(this.activeRoute.snapshot.params['post_id'])) {
              post.allow = 1;
              this.storageService.setItem("posts", JSON.stringify(post_arr));
              break;
            }
          }
        }
      })
    }

    notAllowPost() {
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
          this.deletePostService.deletePost("/delete-post", this.post_id, this.post.uid, 'moderator').subscribe({
            next: (response: DeletePostResponse) => {
              this.isDeleted = true;
              this.post.title = "[Deleted by moderator]"
              this.post.content = "[Deleted by moderator]";
              this.post.type = "editor";
            },
            error: (e: HttpErrorResponse) => {
            }
          })
        }
      })
    }

    savePost(event: Event) {
      event.stopPropagation();
      const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
      const saveStatus = !this.saved ? 1 : 0;
      this.savePostService.savePostByUid(uid, this.post_id, saveStatus).subscribe({
        next: (response: DefaultResponse) => {
          this.saved = !this.saved;
          this.savedText = this.saved ? "Unsave" : "Save";
        },
        error: (e: HttpErrorResponse) => {}
      })
    }
  }
  
