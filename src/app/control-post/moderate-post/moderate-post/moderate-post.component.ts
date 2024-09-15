import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-moderate-post',
  templateUrl: './moderate-post.component.html',
  styleUrl: './moderate-post.component.scss'
})
export class ModeratePostComponent {

  public constructor(
    private searchUserProfileService: SearchUserProfileService,
    private storageService: StorageService,
    private getCommentService: GetCommentsService,
    private activeRoute: ActivatedRoute,
    private darkmodeSerive: DarkModeService,
    private checkRefreshTokenService: CheckRefreshTokenService,
    private route: Router,
    private shareDataService: ShareDataService,
    private communityService: CommunityService
  ) {}

  public searchOption: string = "review";
  public communityInfo: Communities = new Communities(0,"",0,"","",0,"","",0,0);
  public moderated_communities: Communities[] = [];
  public selected_detail_post: DetailPost = new DetailPost();

  public isDropDown: boolean = false;

  ngOnInit() {
    this.checkRoute();
    this.shareDataService.mod_detail_post$.subscribe(res => {
      this.selected_detail_post = res;
      // alert(this.selected_detail_post.post_id)
    })
    const regex = /mod\/(\d+)\/[^\/]+/;
    const match = window.location.href.match(regex);
    if(match) {
      this.communityService.getCommunityInfoById(match[1]).subscribe({
        next: (response: Communities) => {
          this.communityInfo = response;
        }
      })
    }
    // })
    this.checkRefreshTokenService.checkRefreshToken().subscribe({
      next: (res: number) => {
        //get all moderated communities by user's uid
        this.communityService.getCommunityModerateByUid(res).subscribe({
          next: (response: Communities[]) => {
            this.moderated_communities = response;
          }
        })
      },
      error: (e: HttpErrorResponse) => {
        window.location.href = "/error";
      }
    })
  }

  selectSearchOption(option: string) {
    const regex = /mod\/(\d+)\/[^\/]+/;
    const match = window.location.href.match(regex);
    let community_id: number = 0;
    if(match) {
      community_id = Number.parseInt(match[1]);
    }
    this.shareDataService.setModDetailPost(new DetailPost());
    this.searchOption = option;
    if(this.searchOption == "review") {
      this.route.navigate([`/mod/${community_id}/review`]);
      // window.location.href = `/mod/${community_id}/review`;
    }
    if(this.searchOption == "approved") {
      this.route.navigate([`/mod/${community_id}/approved`]);
      // window.location.href = `/mod/${community_id}/approved`;
    }
    if(this.searchOption == "removed") {
      this.route.navigate([`/mod/${community_id}/removed`]);
      // window.location.href = `/mod/${community_id}/removed`;
    }
    if(this.searchOption == "editted") {
      // this.shareDataService.setModOption("edit");
      this.route.navigate(['mod/'+community_id+'/editted']);
      // window.location.href = `/mod/${community_id}/edit`;
    }
  }

  checkRoute() {
    const regex = /mod\/\d+\/([a-zA-Z]+)/;
    const match = window.location.href.match(regex);
    if(match) {
      const option = match[1];
      this.searchOption = option;
    }
    // if(window.location.href.includes(community_id+"/review")) {
    //   this.searchOption = "review";
    //   this.shareDataService.setModOption('review');
    // }
    // if(window.location.href.includes(community_id+"/approved")) {
    //   this.searchOption = "approved";
    //   this.shareDataService.setModOption('approved');
    // }
    // if(window.location.href.includes(community_id+"/removed")) {
    //   this.searchOption = "removed";
    //   this.shareDataService.setModOption('removed');
    // }
    // if(window.location.href.includes(community_id+"/edit")) {
    //   this.searchOption = "edit";
    //   this.shareDataService.setModOption('edit');
    // }
  }

  openDropDown() {
    this.isDropDown = !this.isDropDown;
  }

  selectCommunity(id: number) {
    const regex = /mod\/(\d+)\/([^\/]+)/;
    const match = window.location.href.match(regex);
    if(match) {
      // this.shareDataService.setModCommunityId(id);
      for(let c of this.moderated_communities) {
        if(c.id == id)
          this.communityInfo = c;
      }
      this.isDropDown = false;
      // this.route.navigate(['/mod/'+id+"/"+match[2]]);
      window.location.href = '/mod/'+id+"/"+match[2];
    }
  }
}
