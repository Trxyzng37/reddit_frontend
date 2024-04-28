import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VotePostService } from 'src/app/post-link/post-link/service/vote-post/vote-post.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { Comment } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { CreateCommentResponse } from 'src/app/view-detail-post/view-detail-post/pojo/create-comment-response';
import { CreateCommentService } from 'src/app/view-detail-post/view-detail-post/service/create-comment/create-comment.service';
import tinymce from 'tinymce';
import { VoteCommentService } from '../../service/vote-comment/vote-comment.service';
import { VoteCommentResponse } from '../../pojo/vote-comment-response';
import { GetCommentStatusService } from '../../service/get-comment-status/get-comment-status.service';
import { CommentStatusResponse } from '../../pojo/comment-status-response';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

  public constructor(
    public sanitizer: DomSanitizer,
    private voteCommentService: VoteCommentService,
    private storageService: StorageService,
    private dateTimeService: DateTimeService,
    private createCommentService: CreateCommentService,
    private getCommentStatusService: GetCommentStatusService
  ) {}


  @Input() commentData!: Comment;
  @Input() postId: number = 0;
  @Output() createNewComment = new EventEmitter<boolean>();
  public isShown: boolean = true;

  public voteType: string = 'none'; //none upvote downvote
  public previousVote: number = 0;
  public shownDate: string = "";
  public isReply: boolean = false;
  public margin: string = "0px";
  public previousContent = "";

  public  upvote = "../../../../../assets/icon/upvote.png"
  public  upvote_fill = "../../../../../assets/icon/upvote-comment-fill.png"
  public  downvote = "../../../../../assets/icon/downvote.png"
  public  downvote_fill = "../../../../../assets/icon/downvote-comment-fill.png"
  
  ngOnInit() {
    console.log("commentData: "+this.commentData)
    console.log("Level: "+this.commentData.level)
    this.shownDate = this.dateTimeService.getTimeByCompareCreatedAtAndCurrentDate(this.commentData.created_at);
    this.margin = this.commentData.level*30 + "px";
    this.commentData.content = this.commentData.content.replace(/<img/g, '<img style="display:block;" ');
    this.commentData.content = this.commentData.content.replace(/<ol/g, '<ol style="margin-left:20px;" ');
    this.commentData.content = this.commentData.content.replace(/<ul/g, '<ul style="margin-left:30px;" ');
    this.commentData.content = this.commentData.content.replace(/<pre/g, '<pre class="pre_code" style="width:fit-content" ');
    this.commentData.content = this.commentData.content.replace(/<code/g, '<code class="code" ');
    this.commentData.content = this.commentData.content.replace(/<a/g, '<a class="a" ');
    this.previousContent = this.commentData.content;
    this.getCommentStatusService.getCommentStatus(this.commentData._id, this.commentData.uid).subscribe({
      next: (response: CommentStatusResponse) => {
        this.voteType = response.vote_type;
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        console.log("Error check comment status");
      }
    })
  }

  showComment(event: Event) {
    // event.stopPropagation();
    this.isShown = !this.isShown;
  }

  voteComment(event: Event, type: string) {
    event.stopPropagation();
    if (this.voteType === 'none' && type === 'upvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote += 1;
      this.voteType = 'upvote';
    }
    else if (this.voteType === 'none' && type === 'downvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote -= 1;
      this.voteType = 'downvote';
    }
    else if (this.voteType === 'upvote' && type === 'upvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote -= 1;
      this.voteType = 'none';
    }
    else if (this.voteType === 'upvote' && type === 'downvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote -= 2;
      this.voteType = 'downvote';
    }
    else if (this.voteType === 'downvote' && type === 'upvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote += 2;
      this.voteType = 'upvote';
    }
    else if (this.voteType === 'downvote' && type === 'downvote') {
      this.previousVote = this.commentData.vote;
      this.commentData.vote += 1;
      this.voteType = 'none';
    }
    // console.log(this.post_id + ": " + this.vote);
    this.sendVoteCommentToServer();
  }

  sendVoteCommentToServer() {
    const username: string = this.storageService.getItem("username");
    this.voteCommentService.updateVoteComment(this.postId, this.commentData._id, this.commentData.vote, this.voteType).subscribe({
      next: (response: VoteCommentResponse) => {
        console.log("Vote comment: "+response.vote_updated);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        this.commentData.vote = this.previousVote;
        this.voteType = 'none';
        console.log("Error vote post");
        console.log("vote when error: "+this.commentData.vote);
      }
    })
  }

  reply(event: Event) {
    // event.stopPropagation();
    this.isReply = !this.isReply;
    if (this.isReply === true) {
      this.previousContent = this.commentData.content;
      // tinymce.activeEditor?.setContent(this.previousContent);
    }
    else {
      this.commentData.content = this.previousContent;
    }
  }

  public editorSettings = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link lists codesample image autoresize', 
    toolbar: "bold italic underline strikethrough forecolor subscript superscript removeformat numlist bullist link blockquote codesample image",
    toolbar_mode: 'wrap',
    placeholder: 'Enter your comment',
    automatic_uploads: true,
    file_picker_types: 'image',
    images_file_types: 'jpg,svg,webp,png,jpeg',
    images_reuse_filename: true,
    image_dimensions: false,
    // image_caption: true,
    image_description: false,
    statusbar: true,
    elementpath: false,
    branding: false,
    resize: true,
    width: '100%',
    min_height: 100,
    // max_height:1000,
    autoresize_min_height: 200,
    // autoresize_max_height: 300,
    // height: '100px', 
    menubar: false, 
    draggable_modal: false,
    object_resizing: false,
    inline_boundaries: false,
    contenteditable: false,
    paste_data_images: false,
    paste_block_drop: false,
    cleanup : false,
    color_default_foreground: '#E03E2D',
    color_default_background: '#000000',
    color_map_background: [
      '000000', 'Black'
    ],
    textcolor_map: ['#E03E2D', 'Red'],
    custom_colors: false,
    content_css: 'tinymce-5',
    content_style: 
      'p { margin: 0; } ' + 
      'img { display: block; out-line: 0; max-width: 100%; max-height: 100%}' +
      'body {line-height: normal}' +
      'pre[class*=language-] {font-family: Consolas}',
    file_picker_callback: (cb: any, value:any, meta:any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.addEventListener('change', (e:any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const id = file.name;
          const blobCache =  tinymce.activeEditor!.editorUpload.blobCache;
          const base64 = (<string>reader.result).split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          cb(blobInfo.blobUri(), { title: file.name });
        });
        reader.readAsDataURL(file);
      })
      input.click();
    },
  }

  onContentChanged = (event: any) =>{
    this.commentData.content = event.editor.getContent({ format: 'html' });
    console.log(this.commentData.content)
  }

  cancelComment() {
    this.commentData.content = "";
    tinymce.activeEditor?.setContent(this.commentData.content);
  }

  createComment() {
    this.createCommentService.createComment(this.postId, this.commentData._id, this.commentData.content, this.commentData.level+1).subscribe({
      next: (response: CreateCommentResponse) => {
        console.log("save comment: "+response.comment_created);
        alert("Create comment successfully");
        this.createNewComment.emit(true);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        alert("Error create comment");
      }
    })
  }
}
