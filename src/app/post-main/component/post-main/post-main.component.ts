import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { JoinCommunityResponse } from 'src/app/shared/services/search-communites/pojo/join-community-response';
import { CommunityService } from 'src/app/shared/services/search-communites/search-communities.service';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Component({
  selector: 'app-post-main',
  templateUrl: './post-main.component.html',
  styleUrl: './post-main.component.scss'
})
export class PostMainComponent {

  public constructor (
    private communityService: CommunityService,
    private storageService: StorageService
  ) {}

  public isCommunityPage: boolean = false;
  public isJoinCommunity: boolean = false;
  public isOwner: boolean = false;

  public community_id: number = 0;
  public community!: Communities;
  public banner_url: string = "../../../assets/banner/lol.png";
  public avatar_url: string = "../../../assets/icon/tft.jpg";
  public joinText: string = this.isJoinCommunity ? 'Joined' : 'Join';

  ngOnInit() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isCommunityPage = window.location.href.includes("/r/");
    if(this.isCommunityPage) {
      let regex = '/r/([0-9]+)';
      const a = window.location.href.match(regex);
      if(a != null) {
        this.community_id = Number.parseInt(a[1]);
        this.communityService.getCommunityInfoById(a[1]).subscribe({
          next: (response: Communities) => {
            this.community = response;
            alert(uid)
            console.log("id"+this.community.uid)
            this.isOwner = uid == this.community.uid;
          }
        })
        this.communityService.checkJoinCommunityStatus(uid, this.community_id).subscribe({
          next: (response: JoinCommunityResponse) => {
            this.isJoinCommunity = response.join_community == 0 ? false : true;
            this.joinText = this.isJoinCommunity ? 'Joined' : 'Join';
          }
        })
      }
    }

  }

  joinCommunity() {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
    this.communityService.joinCommunity(uid, this.community_id, this.isJoinCommunity == false ? 1 : 0).subscribe({
      next: (response: JoinCommunityResponse) => {
        this.isJoinCommunity = response.join_community == 0 ? false : true;
        this.joinText = this.isJoinCommunity ? 'Joined' : 'Join';
      },
      error: (e: HttpErrorResponse) => {
        console.log("error join community");
      }
    })
  }

  editCommunity() {
    window.location.href = "/edit-community/"+this.community_id;
  }
}
