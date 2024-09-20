import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { UserInfoService } from 'src/app/shared/services/user-info/user-info.service';
import { UserProfile } from 'src/app/shared/pojo/pojo/user-profile';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { JoinCommunityResponse } from 'src/app/shared/services/search-communites/pojo/join-community-response';
import { HttpErrorResponse } from '@angular/common/http';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';

@Component({
  selector: 'community-info',
  templateUrl: './community-info.component.html',
  styleUrl: './community-info.component.scss'
})
export class CommunityInfoComponent {

  constructor (
    private userInfoService: UserInfoService,
    private communityService: CommunityService,
    private storageService: StorageService,
    public presentationService: PresentationService,
    private darkmodeSerive: DarkModeService,
    private shareDataService: ShareDataService
  ) {}

  @Input() community_info: Communities = new Communities(0, "", 0, "", "", 0, "", "", 0,0);

  public userInfo: UserProfile = new UserProfile(0, "", "", "", 0, 0, "");
  public isJoinCommunity: boolean = false;
  public isCommunityPage: boolean = false;
  public isControlPostPage: boolean = false;
  public isCreatePostPage: boolean = false;
  public isPostPage: boolean = false;
  public isOwner: boolean = false;
  public joinText: string = this.isJoinCommunity ? 'Joined' : 'Join';
  subscribed_communities: Communities[] = [];

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    this.isCommunityPage = window.location.href.includes("/r/");
    this.isControlPostPage = window.location.href.includes("/control-posts/");
    this.isCreatePostPage = window.location.href.includes("/create-post");
    this.isPostPage = window.location.href.includes("/post/");
    this.shareDataService.subscribed_communities$.subscribe(res => {
      this.subscribed_communities = res;
    })
  }

  ngOnChanges() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    if(this.community_info.uid !== 0) {
      this.isOwner = uid == this.community_info.uid;
      this.userInfoService.getUserInfo(this.community_info.uid).subscribe({
        next: (response: UserProfile) => {
          this.userInfo = response;
        }
      })
    }
    if(uid !== 0) {
      this.communityService.checkJoinCommunityStatus(uid, this.community_info.id).subscribe({
        next: (response: JoinCommunityResponse) => {
          this.isJoinCommunity = response.join_community == 0 ? false : true;
          this.joinText = this.isJoinCommunity ? 'Joined' : 'Join';
        }
      })
    }
  }

  joinCommunity(event: Event) {
    event.stopPropagation();
    const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
    this.communityService.joinCommunity(uid, this.community_info.id, this.isJoinCommunity == false ? 1 : 0).subscribe({
      next: (response: JoinCommunityResponse) => {
        this.isJoinCommunity = response.join_community == 0 ? false : true;
        this.joinText = this.isJoinCommunity ? 'Joined' : 'Join';
        if(response.join_community == 1)
          this.subscribed_communities.unshift(this.community_info);
        else
          this.subscribed_communities = this.subscribed_communities.filter((community) => {
            return community.id != this.community_info.id;
          })
        this.shareDataService.setSubscribedCommunities(this.subscribed_communities);
        this.shareDataService.setJoinCommunityOfDetailPosts(this.community_info.id, response.join_community);
      },
      error: (e: HttpErrorResponse) => {
        console.log("error join community");
      }
    })
  }

  editCommunity() {
    window.location.href = "/edit-community/"+this.community_info.id;
  }

  controlPosts() {
    window.location.href = "/mod/"+this.community_info.id+"/review";
  }
}
