import { Component } from '@angular/core';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { CommentCount } from 'src/app/view-detail-post/view-detail-post/service/get-comments/pojo/comment-count';

@Component({
  selector: 'app-recent-visited-post',
  templateUrl: './recent-visited-post.component.html',
  styleUrl: './recent-visited-post.component.scss'
})
export class RecentVisitedPostComponent {

  public constructor(
    private recentVisitPostService: RecentVisitService,
    private storageService: StorageService,
    public presentationService: PresentationService,
    private getPostService: GetPostService,
    private commentService: GetCommentsService,
  ) {}

  public posts: DetailPost[] = [];
  public img: string[] = [];
  public comment_count: CommentCount[] = [];

  ngOnInit() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    if(uid == 0) {
      const recent_posts: number[] = this.storageService.getItem("recent_posts") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_posts") + "]");
      for(let post_id of recent_posts) {
        this.getPostService.getDetailPostByUidAndPostId(0, post_id).subscribe({
          next: (response: DetailPost) => {
            this.posts.push(response);
            const post = response;
            if(post.type == "link") {
              this.img.push(JSON.parse(post.content).image);
            }
            if(post.type == "img") {
              this.img.push(JSON.parse(post.content)[0].data);
            }
            if(post.type == "video") {
              this.img.push("../../../../assets/banner/video_icon.png");
            }
            if(post.type == "editor") {
              const found = post.content.match('src="([^"]*)"')
              if(found)
                this.img.push(found[1]);
              else 
                this.img.push("");
            }
            //count comment
            this.commentService.countComments(post_id).subscribe({
              next: (response: number) => {
                this.comment_count.push(new CommentCount(post_id, response));
              },
              error: (err: any) => {
                this.comment_count.push(new CommentCount(post_id, 0));
              }
            })
          }
        })
      }
    }
    else {
      this.recentVisitPostService.getRecentVisitPost(uid).subscribe({
        next: (response: DetailPost[]) => {
          this.posts = response;
          for(let i in this.posts) {
            const post = this.posts[i];
            if(post.type == "link") {
              this.img.push(JSON.parse(post.content).image);
            }
            if(post.type == "img") {
              this.img.push(JSON.parse(post.content)[0].data);
            }
            if(post.type == "video") {
              this.img.push("../../../../assets/banner/video_icon.png");
            }
            if(post.type == "editor") {
              const found = post.content.match('src="([^"]*)"')
              if(found)
                this.img.push(found[1]);
              else 
                this.img.push("");
            }
            this.commentService.countComments(this.posts[i].post_id).subscribe({
              next: (response: number) => {
                this.comment_count.push(new CommentCount(this.posts[i].post_id, response));
              },
              error: (err: any) => {
                this.comment_count.push(new CommentCount(this.posts[i].post_id, 0));
              }
            })
          }
        }
      })
    }
  }

  getCommentCountByPostId(postId: number): CommentCount {
    return this.comment_count.find(comment => comment.post_id === postId) != undefined ? this.comment_count.find(comment => comment.post_id === postId)! : new CommentCount(postId, 0);
  }
}
