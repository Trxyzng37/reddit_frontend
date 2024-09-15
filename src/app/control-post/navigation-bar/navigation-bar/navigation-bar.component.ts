import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';

@Component({
  selector: 'mod-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class ModNavigationBarComponent {

  public constructor(
    private communityService: CommunityService,
    private storageService: StorageService,
    private checkRefreshTokenService: CheckRefreshTokenService,
    private darkmodeSerive: DarkModeService,
    private shareDataService: ShareDataService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  public moderationCommunities: Communities[] = [];
  public selected_community_id: number = 0;

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    const regex = /mod\/(\d+)\/([^\/]+)/;
    const match = window.location.href.match(regex);
    if(match) {
      this.selected_community_id = Number.parseInt(match[1]);
      // this.shareDataService.setModCommunityId(this.selected_community_id);
    }
    this.checkRefreshTokenService.checkRefreshToken().subscribe({
      next: (res: number) => {
        this.communityService.getCommunityModerateByUid(res).subscribe({
          next: (response: Communities[]) => {
            this.moderationCommunities = response;
          }
        })
      }
    })
    // this.shareDataService.mod_community_id$.subscribe(res => {
    //   this.selected_community_id = res;
    // })
  }

  //same with moderate page
  goToCommunityModPage(community_id: number) {
    this.selected_community_id = community_id;
    const regex = /mod\/(\d+)\/([^\/]+)/;
    const match = window.location.href.match(regex);
    if(match) {
      // this.shareDataService.setModCommunityId(community_id);
      // this.route.navigate(['/mod/'+this.selected_community_id+"/"+match[2]]);
      window.location.href = '/mod/'+this.selected_community_id+"/"+match[2];
    }
  }

  goBackToCommunity() {
    window.location.href = "/r/" + this.selected_community_id;
  }
}
