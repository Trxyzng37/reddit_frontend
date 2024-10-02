import { Component } from '@angular/core';
import { Communities } from '../shared/pojo/pojo/communities';
import { GetPostService } from '../view-detail-post/view-detail-post/service/get-post/get-post.service';
import { ActivatedRoute } from '@angular/router';
import { GetPostResponse } from '../post-link-list/pojo/get-post-response';
import { CommunityService } from '../shared/services/search-communites/community.service';
import { DetailPost } from '../post-link-list/pojo/detail-post';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss'
})
export class PostInfoComponent {
  constructor(
    private getPostService: GetPostService,
    private activeRoute: ActivatedRoute,
    private communityService: CommunityService
  ) {}

  public community: Communities = new Communities(0, "", 0, "", "", 0, "", "", 0, 0);

  public isPostExist: boolean = false;

  ngOnInit() {
    let regex = '/post/([0-9]+)';
    const a = window.location.href.match(regex);
    if(a != null) {
      this.getPostService.getDetailPostByUidAndPostId(0, Number.parseInt(a[1])).subscribe({
        next: (response: DetailPost) => {
          if(response.post_id == 0) {
            this.isPostExist = false;
          }
          else {
            this.isPostExist = true;
            this.communityService.getCommunityInfoById(response.community_id.toString()).subscribe({
              next: (response: any) => {
                this.community = response;
              }
            })
          }
        }
      });
    }
  }
}
