import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommentStatusResponse } from 'src/app/comment/pojo/comment-status-response';
import { VoteCommentResponse } from 'src/app/comment/pojo/vote-comment-response';
import { GetCommentStatusService } from 'src/app/comment/service/get-comment-status/get-comment-status.service';
import { VoteCommentService } from 'src/app/comment/service/vote-comment/vote-comment.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { GetPostsService } from 'src/app/post-link-list/service/get-posts.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import { VoteImgService } from 'src/app/shared/services/vote-img/vote-img.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { CommentInfo } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrl: './comment-view.component.scss'
})
export class CommentViewComponent {
  public constructor(
    public sanitizer: DomSanitizer,
    private getPostService: GetPostService,
    public dateTimeService: DateTimeService,
    private storageService: StorageService,
    private route: Router,
    private voteCommentService: VoteCommentService,
    public voteImgService: VoteImgService,
    public presentationService: PresentationService,
    private getCommentStatusService: GetCommentStatusService
  ) {}

  @Input() commentData: CommentInfo = new CommentInfo(0,0,0,'','',0,'',0,'',0,false);
  public postInfo: GetPostResponse = new GetPostResponse(0,'',0,'','',0,'','','','','',0,0,0);

  public voteType: string = 'none'; //none upvote downvote
  public previousVote: number = 0;
  public previousVoteType: string = "none";
  public shownDate: string = "";
  public margin: string = "0px";
  public previousContent = "";
  public uid: number = 0;
  public isReplyAllowed: boolean = false;
  public isEditAllowed: boolean = false;

  public  upvote = "../../../../../assets/icon/upvote.png"
  public  upvote_fill = "../../../../../assets/icon/upvote-comment-fill.png"
  public  downvote = "../../../../../assets/icon/downvote.png"
  public  downvote_fill = "../../../../../assets/icon/downvote-comment-fill.png"

  ngOnInit() {
    this.voteImgService.selectDownVoteImg();
    this.voteImgService.selectUpVoteImg();
    this.uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isReplyAllowed = (this.commentData.level <= 6) && (this.commentData.uid != this.uid) ? true : false;
    this.isEditAllowed = this.commentData.uid == this.uid ? true : false;
    this.commentData.content = this.commentData.content.replace("<img src=", "<img class='img_comment' src=");
    this.commentData.content = this.commentData.content.replace(/<img/g, '<img style="display:block;" ');
    this.commentData.content = this.commentData.content.replace(/<ol/g, '<ol style="margin-left:20px;" ');
    this.commentData.content = this.commentData.content.replace(/<ul/g, '<ul style="margin-left:30px;" ');
    this.commentData.content = this.commentData.content.replace(/<pre/g, '<pre class="pre_code" style="width:fit-content" ');
    this.commentData.content = this.commentData.content.replace(/<code/g, '<code class="code" ');
    this.commentData.content = this.commentData.content.replace(/<a/g, '<a class="a link" ');
    this.commentData.content = this.commentData.content.replace(/<p/g, '<p class="comment_content" ');
    this.getPostService.getDetailPostByUidAndPostId(this.uid, this.commentData.post_id).subscribe({
      next: (response: DetailPost) => {
        this.postInfo = response;
      }
    })
    this.getCommentStatusService.getCommentStatus(this.commentData._id, this.uid).subscribe({
      next: (response: CommentStatusResponse) => {
        this.voteType = response.vote_type;
        this.previousVoteType = response.vote_type;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        console.log("Error check comment status");
      }
    })
  }

  navigateToPost() {
    this.route.navigate(["/post/" + this.postInfo.post_id + "/comment/" + this.commentData._id]);
  }

  navigateTocommunity(event: Event) {
    event.stopPropagation();
    this.route.navigate(["/r/" + this.postInfo.community_id]);
  }

  reply(event: Event) {
    event.stopPropagation();
    this.route.navigate(["/post/" + this.postInfo.post_id + "/comment/" + this.commentData._id]);
  }

  voteComment(event: Event, type: string) {
    event.stopPropagation();
    this.uid = this.storageService.getItem("uid") === "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    if(this.uid === 0) {
      Swal.fire({
        title: "You need to sign-in to do this action",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        footer: '<a href="signin" style="color:red;font-size: 18px"><b>Click here to go to sign-in page<b/></a>'
      })
    }
    else {
      this.previousVote = this.commentData.vote;
      this.previousVoteType = this.voteType;
      if (this.voteType === 'none' && type === 'upvote') {
        this.commentData.vote += 1;
        this.voteType = 'upvote';
      }
      else if (this.voteType === 'none' && type === 'downvote') {
        this.commentData.vote -= 1;
        this.voteType = 'downvote';
      }
      else if (this.voteType === 'upvote' && type === 'upvote') {
        this.commentData.vote -= 1;
        this.voteType = 'none';
      }
      else if (this.voteType === 'upvote' && type === 'downvote') {
        this.commentData.vote -= 2;
        this.voteType = 'downvote';
      }
      else if (this.voteType === 'downvote' && type === 'upvote') {
        this.commentData.vote += 2;
        this.voteType = 'upvote';
      }
      else if (this.voteType === 'downvote' && type === 'downvote') {
        this.commentData.vote += 1;
        this.voteType = 'none';
      }
      this.sendVoteCommentToServer(this.commentData.post_id, this.commentData._id, this.commentData.vote, this.voteType);
    }
  }

  sendVoteCommentToServer(post_id: number, comment_id: number, cur_vote: number, cur_vote_type: string) {
    this.voteCommentService.updateVoteComment(post_id, comment_id, cur_vote, cur_vote_type).subscribe({
      next: (response: VoteCommentResponse) => {
        console.log("Vote comment: "+response.vote_updated);
        this.commentData.vote = cur_vote;
        this.voteType = cur_vote_type;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        console.log("Error vote post");
        console.log("vote when error: "+this.commentData.vote);
      }
    })
  }
}
