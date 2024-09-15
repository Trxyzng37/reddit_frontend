import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { GetPostService } from 'src/app/view-detail-post/view-detail-post/service/get-post/get-post.service';
import { GetPostsService } from 'src/app/post-link-list/service/get-posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { AllowPostService } from 'src/app/post-link/post-link/service/allow-post/allow-post.service';
import { DeletePostService } from 'src/app/edit-post/service/delete-post/delete-post.service';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DeletePostResponse } from 'src/app/edit-post/pojo/delete-post-response';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { FirstLast } from 'src/app/shared/services/share_data/first-last';
import { ChangedPost } from 'src/app/shared/services/share_data/changed-post';

@Component({
  selector: 'mod-post',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss'
})
export class ModPostViewComponent {

  public constructor(
    private recentVisitPostService: RecentVisitService,
    private storageService: StorageService,
    public presentationService: PresentationService,
    private getPostService: GetPostService,
    private getPostsService: GetPostsService,
    private activeRoute: ActivatedRoute,
    private shareDataService: ShareDataService,
    public dateTimeService: DateTimeService,
    private route: Router,
    private allowPostService: AllowPostService,
    private deletePostService: DeletePostService,
    private refreshTokenService: CheckRefreshTokenService,
    private communityService: CommunityService,
  ) { }

  public detail_post_arr: DetailPost[] = [];
  public post_id_arr: number[] = [];
  public cur_view_post_id = 0;

  public community_id: number = 0;
  public img: string[] = [];

  public isDetailPostShow: boolean = false;
  public selected_post_id: number = 0;
  public selected_detail_post: DetailPost = new DetailPost();

  public isDataLoad: boolean = false;
  public wait: boolean = false;

  public isReviewModPage: boolean = false;
  public isApprovedModPage: boolean = false;
  public isRemoveModPage: boolean = false;
  public isEditModPage: boolean = false;

  ngOnInit() {
    this.shareDataService.changed_post$.subscribe(res => {
      if (res.post_id != 0) {
        for (let post of this.detail_post_arr) {
          if (post.post_id == res.post_id) {
            post.allow = res.allow;
            post.deleted = res.deleted;
            if (res.allow == 1)
              post.allowed_at = res.allowed_at;
            if (res.deleted == 1)
              post.deleted_at = res.deleted_at;
          }
        }
      }
    })
    this.shareDataService.mod_selected_post_id$.subscribe(res => {
      if (this.selected_detail_post != undefined) {
        //previous post
        if (res == -1) {
          const cur_post_index = this.detail_post_arr.findIndex(post => post.post_id === this.selected_detail_post.post_id);
          if (cur_post_index != -1) {
            this.selectDetailPost(this.detail_post_arr[cur_post_index - 1]);
          }
        }
        //next post
        if (res == 1) {
          const cur_post_index = this.detail_post_arr.findIndex(post => post.post_id === this.selected_detail_post.post_id);
          if (cur_post_index != -1) {
            this.selectDetailPost(this.detail_post_arr[cur_post_index + 1]);
          }
        }
      }
    })
    const regex = /mod\/(\d+)\/[^\/]+/;
    const match = window.location.href.match(regex);
    if (match) {
      this.community_id = Number.parseInt(match[1]);
      this.getInfo(this.community_id);
    }
  }

  getInfo(community_id: number) {
    this.isReviewModPage = window.location.href.includes("/review");
    this.isApprovedModPage = window.location.href.includes("/approved");
    this.isRemoveModPage = window.location.href.includes("/removed");
    this.isEditModPage = window.location.href.includes("/editted");
    this.isDataLoad = true;
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.communityService.getCommunityInfoById(community_id.toString()).subscribe({
      next: (communityInfo: Communities) => {
        this.refreshTokenService.checkRefreshToken().subscribe({
          next: (uid: number) => {
            if (communityInfo.uid !== uid) {
              Swal.fire({
                title: "Authentication fail",
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "Go to home page"
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/home";
                }
              })
            }
            //code here excute if is community owner
            else {
              if (this.isReviewModPage) {
                this.getPostsService.getPostInCommunityNotAllow("/get-control-posts", this.community_id).subscribe({
                  next: (response: number[]) => {
                    this.post_id_arr = response;
                    this.getPostService.getDetailPostByUidAndPostIds(uid, this.post_id_arr).subscribe({
                      next: (response: DetailPost[]) => {
                        this.detail_post_arr = response;
                        this.isDataLoad = false;
                        this.wait = true;
                      }
                    })
                  }
                })
              }
              if (this.isApprovedModPage) {
                this.getPostsService.getAllowedPostIdsInCommunity(this.community_id).subscribe({
                  next: (response: number[]) => {
                    this.post_id_arr = response;
                    this.getPostService.getDetailPostByUidAndPostIds(uid, this.post_id_arr).subscribe({
                      next: (response: DetailPost[]) => {
                        this.detail_post_arr = response;
                        this.isDataLoad = false;
                        this.wait = true;
                      }
                    })
                  }
                })
              }
              if (this.isRemoveModPage) {
                this.getPostsService.getDeletedPostIdsInCommunity(this.community_id).subscribe({
                  next: (response: number[]) => {
                    this.post_id_arr = response;
                    this.getPostService.getDetailPostByUidAndPostIds(uid, this.post_id_arr).subscribe({
                      next: (response: DetailPost[]) => {
                        this.detail_post_arr = response;
                        this.isDataLoad = false;
                        this.wait = true;
                      }
                    })
                  }
                })
              }
              if (this.isEditModPage) {
                this.getPostsService.getEdittedPostIdsInCommunity(this.community_id).subscribe({
                  next: (response: number[]) => {
                    this.post_id_arr = response;
                    this.getPostService.getDetailPostByUidAndPostIds(uid, this.post_id_arr).subscribe({
                      next: (response: DetailPost[]) => {
                        this.detail_post_arr = response;
                        this.isDataLoad = false;
                        this.wait = true;
                      }
                    })
                  }
                })
              }
            }
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire({
              title: "Authentication fail",
              icon: "error",
              showConfirmButton: true,
              confirmButtonText: "Go to home page"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/home";
              }
            })
          }
        })
      }
    })
  }

  selectDetailPost(post: DetailPost) {
    if(post != undefined) {
      this.selected_detail_post = post;
      this.shareDataService.setModDetailPost(this.selected_detail_post);
      this.isDetailPostShow = true;
      const cur_post_index = this.detail_post_arr.findIndex(post => post.post_id === this.selected_detail_post.post_id);
      if (cur_post_index == 0)
        this.shareDataService.setFirstLast(new FirstLast(1, 0));
      if (cur_post_index == this.detail_post_arr.length - 1)
        this.shareDataService.setFirstLast(new FirstLast(0, 1));
      if (cur_post_index > 0 && cur_post_index < this.detail_post_arr.length - 1)
        this.shareDataService.setFirstLast(new FirstLast(0, 0));
      if (cur_post_index == 0 && this.detail_post_arr.length == 1)
        this.shareDataService.setFirstLast(new FirstLast(1, 1));
      // this.shareDataService.setChangedPost(new ChangedPost(post.post_id, post.allow, post.deleted, post.allowed_at!, post.deleted_at!));
    }
  }

  allowPost(post_id: number, event: Event) {
    event.stopPropagation();
    this.refreshTokenService.checkRefreshToken().subscribe({
      next: (uid: number) => {
        this.allowPostService.setAllowPost(post_id, 1).subscribe({
          next: (response: DefaultResponse) => {
            for (let post of this.detail_post_arr) {
              if (post.post_id === post_id) {
                post.allow = 1;
                post.deleted = 0;
                post.allowed_at = this.dateTimeService.getCurrentDateTime().toISOString();
                // this.shareDataService.setModDetailPost(post);
                if(this.selected_detail_post.post_id == post.post_id) {
                  // alert("same post")
                  this.shareDataService.setChangedPost(new ChangedPost(post_id, 1, 0, this.dateTimeService.getCurrentDateTime().toISOString(), ""));
                }
              }
            }
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire({
              text: "Error perfrom action. Please try again",
              icon: "error"
            })
          }
        })
      },
      error: (e: HttpErrorResponse) => {
        Swal.fire({
          text: "Error perfrom action. Please try again",
          icon: "error"
        })
      }
    })
  }

  removePost(post_id: number, event: Event) {
    event.stopPropagation();
    this.refreshTokenService.checkRefreshToken().subscribe({
      next: (uid: number) => {
        this.deletePostService.deletePost(post_id, uid, 2).subscribe({
          next: (response: DeletePostResponse) => {
            for (let post of this.detail_post_arr) {
              if (post.post_id === post_id) {
                post.deleted = 1;
                post.deleted_at = this.dateTimeService.getCurrentDateTime().toISOString();
                // this.shareDataService.setModDetailPost(post);
                if(this.selected_detail_post.post_id == post.post_id) {
                  // alert("same post d")
                  this.shareDataService.setChangedPost(new ChangedPost(post_id, post.allow, 1, "", this.dateTimeService.getCurrentDateTime().toISOString()));
                }
              }
            }
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire({
              text: "Error perfrom action. Please try again",
              icon: "error"
            })
          }
        })
      },
      error: (e: HttpErrorResponse) => {
        Swal.fire({
          text: "Error perfrom action. Please try again",
          icon: "error"
        })
      }
    })
  }
}
