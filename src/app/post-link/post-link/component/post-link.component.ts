import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem } from 'ng-gallery';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VotePostService } from '../service/vote-post/vote-post.service';
import { CheckVotePostService } from '../service/check-vote-post/check-vote-post.service';
import { CheckVotePostResponse } from '../service/check-vote-post/pojo/check-vote-post-response';
import { VotePostResponse } from '../service/vote-post/pojo/vote-post-response';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { Comment } from 'src/app/view-detail-post/view-detail-post/pojo/comment';

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
  ) {}

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

  @Output() event = new EventEmitter<GetPostResponse>();
    
  public images!: GalleryItem[];
  public voteType: string = 'none'; //none upvote downvote
  public previousVote: number = this.vote;
  public shownDate: string = "";
  public comment_count: number = 0;

  public  upvote = "../../../../../assets/icon/upvote.png"
  public  upvote_fill = "../../../../../assets/icon/upvote-fill.png"
  public  downvote = "../../../../../assets/icon/downvote.png"
  public  downvote_fill = "../../../../../assets/icon/downvote-fill.png"

  ngOnInit() {
    this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(this.created_at);
    const username: string = this.storageService.getItem("username");
    this.checkVotePostService.checkVotePost(this.post_id, username).subscribe({
      next: (response: CheckVotePostResponse) => {
        this.voteType  = response.vote_type;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
    this.getCommentService.getComments(this.post_id).subscribe({
      next: (response: Comment[]) => {
        this.comment_count = response.length;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "Error: " + e.error);
      }
    })
  }  

  on_click() {
    this.router.navigate(["/post/" + this.post_id]);
  }

  // preventClick(event: Event) {
  //   event.stopPropagation();
  // }

  public isOptionMenuOpen: boolean = false;

  openOptionMenu(event: Event) {
    this.isOptionMenuOpen = !this.isOptionMenuOpen;
    // console.log("Option menu open")
    event.stopPropagation();
  }

  // @HostListener('document:click', ['$event'])
  // closeProfileMenu(event: Event) {
  //     this.isOptionMenuOpen = false;
  //     console.log("profile meneu close")
  // }

  onIntersection({ target, visible }: { target: Element; visible: boolean }) {
    // if (visible) {
    //   console.log("Post index: "+this.index);
    //   console.log("LENGTH: "+this.arr_length);
    //   console.log(this.index===this.arr_length-1)
    //   if(this.index == (this.arr_length-1)) {
    //     if(confirm("END OF PAGE. Want to add new post")) {
    //       // const o: GetPostResponse = new GetPostResponse(this.post_id+1, "new page"+1, "test"+1, this.created_at, this.vote+1, this.communityIcon);
    //       console.log("Add new post: ");
    //       // this.addNewPost(o);
    //     }
    //     else {
    //       console.log("No add post")
    //     }
    //   }
    // }
  }

  addNewPost(o: GetPostResponse) {
    this.event.emit(o);
  }

  votePost(event: Event, type: string) {
    event.stopPropagation();
    if (this.voteType === 'none' && type === 'upvote') {
      this.previousVote = this.vote;
      this.vote += 1;
      this.voteType = 'upvote';
    }
    else if (this.voteType === 'none' && type === 'downvote') {
      this.previousVote = this.vote;
      this.vote -= 1;
      this.voteType = 'downvote';
    }
    else if (this.voteType === 'upvote' && type === 'upvote') {
      this.previousVote = this.vote;
      this.vote -= 1;
      this.voteType = 'none';
    }
    else if (this.voteType === 'upvote' && type === 'downvote') {
      this.previousVote = this.vote;
      this.vote -= 2;
      this.voteType = 'downvote';
    }
    else if (this.voteType === 'downvote' && type === 'upvote') {
      this.previousVote = this.vote;
      this.vote += 2;
      this.voteType = 'upvote';
    }
    else if (this.voteType === 'downvote' && type === 'downvote') {
      this.previousVote = this.vote;
      this.vote += 1;
      this.voteType = 'none';
    }
    console.log(this.post_id + ": " + this.vote);
    this.sendVotePostToServer();
  }

  sendVotePostToServer() {
    const username: string = this.storageService.getItem("username");
    this.votePostServie.votePost(this.post_id, this.vote, username, this.voteType).subscribe({
      next: (response: VotePostResponse) => {
        console.log("Vote post_id: "+response.post_id);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        this.vote = this.previousVote;
        this.voteType = 'none';
        console.log("Error vote post");
        console.log("vote when error: "+this.vote);
      }
    })
  }

}
