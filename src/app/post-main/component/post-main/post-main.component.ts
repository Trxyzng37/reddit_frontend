import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { CommunityService } from 'src/app/shared/services/search-communites/search-communities.service';

@Component({
  selector: 'app-post-main',
  templateUrl: './post-main.component.html',
  styleUrl: './post-main.component.scss'
})
export class PostMainComponent {

  public constructor (
    private communityService: CommunityService
  ) {}

  public isCommunityPage: boolean = false;
  public community_id: number = 0;
  public community!: Communities;
  public banner_url: string = "../../../assets/banner/lol.png";
  public avatar_url: string = "../../../assets/icon/tft.jpg";

  ngOnInit() {
    this.isCommunityPage = window.location.href.includes("/r/");
    if(this.isCommunityPage) {
      let regex = '/r/([0-9]+)';
      const a = window.location.href.match(regex);
      if(a != null) {
        this.community_id = Number.parseInt(a[1]);
        this.communityService.getCommunityInfoById(a[1]).subscribe({
          next: (response: Communities) => {
            this.community = response;
          }
        })
      }
    }
  }
}
