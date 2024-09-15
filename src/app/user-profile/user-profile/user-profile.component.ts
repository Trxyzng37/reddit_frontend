import { Component } from '@angular/core';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { UserProfile } from 'src/app/shared/pojo/pojo/user-profile';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { CommentInfo } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { SavePostService } from 'src/app/shared/services/save-post/save-post.service';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  public constructor(
    private searchUserProfileService: SearchUserProfileService,
    private storageService: StorageService,
    private getCommentService: GetCommentsService,
    private activeRoute: ActivatedRoute,
    private darkmodeSerive: DarkModeService,
    private checkRefreshTokenService: CheckRefreshTokenService,
    private route: Router,
    private shareDataService: ShareDataService
  ) {}

  public userInfo: UserProfile = new UserProfile(0,'','','',0,0,'');
  public comments: CommentInfo[] = [];
  public searchOption: string = "posts";
  public sort_option: string = "New";
  public isSortOptionShow: boolean = false;
  public isOwner: boolean = false;
  public isLoad: boolean = false;

  public profile_option: string = "";

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    this.checkRefreshTokenService.runCheckRefreshTokenWithoutNotification();
    const username = this.activeRoute.snapshot.params['username'];
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.searchUserProfileService.getUserProfileByName("/get-user-info-by-username", username).subscribe({
      next: (response: UserProfile) => {
        this.userInfo = response;
        this.isOwner = uid == this.userInfo.uid;
      }
    })
    this.shareDataService.profile_option$.subscribe(res => {
      this.searchOption = res;
    });
    this.checkRoute();
  }

  checkRoute() {
    const username = this.activeRoute.snapshot.params['username'];
    if(window.location.href.includes(username+"/posts")) {
      this.searchOption = "posts";
      this.shareDataService.setProfileOption("posts");
    }
    if(window.location.href.includes(username+"/comments")) {
      this.searchOption = "comments";
      this.shareDataService.setProfileOption("comments");
    }
    if(window.location.href.includes(username+"/saved")) {
      this.searchOption = "saved";
      this.shareDataService.setProfileOption("saved");
    }
    if(window.location.href.includes(username+"/wait_for_approve")) {
      this.searchOption = "wait_for_approve";
      this.shareDataService.setProfileOption("wait_for_approve");
    }
  }

  selectSearchOption(option: string) {
    this.searchOption = option;
    const username = this.activeRoute.snapshot.params['username'];
    if(this.searchOption == "posts") {
      this.shareDataService.setProfileOption("posts");
      this.route.navigate(['user/'+username+'/posts']);
    }
    if(this.searchOption == "saved") {
      this.shareDataService.setProfileOption("saved");
      this.route.navigate(['user/'+username+'/saved']);
    }
    if(this.searchOption == "wait_for_approve") {
      this.shareDataService.setProfileOption("wait_for_approve");
      this.route.navigate(['user/'+username+'/wait_for_approve']);
    }
    if(this.searchOption == "comments") {
      this.shareDataService.setProfileOption("comments");
      this.route.navigate(['user/'+username+'/comments']);
      
    }
  }
}
