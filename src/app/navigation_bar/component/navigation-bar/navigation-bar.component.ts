import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JoinCommunity } from 'src/app/shared/pojo/join-community';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {

  public constructor(
    private communityService: CommunityService,
    private storageService: StorageService,
    private recentVisitService: RecentVisitService,
    private darkmodeSerive: DarkModeService,
    private shareDataService: ShareDataService,
    private route: Router
  ) {}

  public isOpen: boolean = true;
  public isUser: boolean = false;
  public recent_status: string = 'down';
  public favorite_status: string = 'down';
  public moderation_status:boolean = false;


  @Output() showCommunityFormEvent = new EventEmitter<boolean>();

  public favoriteCommunities: Communities[] = [];
  public recentVisitCommunities: Communities[] = [];
  public moderationCommunities: Communities[] = [];

  public isHomePage: boolean = window.location.href.includes("/home");
  public isPopularPage: boolean = window.location.href.includes("/popular");

  ngOnInit() {
    this.darkmodeSerive.useDarkMode();
    this.shareDataService.subscribed_communities$.subscribe(res => {
      this.favoriteCommunities = res;
    })
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.isUser = uid != 0;
    if(uid != 0) {
      this.communityService.getCommunityModerateByUid(uid).subscribe({
        next: (response: Communities[]) => {
          this.moderationCommunities = response;
        }
      })
      this.recentVisitService.getRecentVisitCommunity(uid).subscribe({
        next: (response: Communities[]) => {
          this.recentVisitCommunities = response;
        }
      })
      if(this.favoriteCommunities.length == 0) {
        this.communityService.getSubscribedCommunitiesByUid(uid).subscribe({
          next: (response: Communities[]) => {
            this.favoriteCommunities = response;
            this.shareDataService.setSubscribedCommunities(this.favoriteCommunities);
          }
        })
      }
    }
    else {
      let recent_communities_array: number[] = this.storageService.getItem("recent_communities") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_communities") + "]");
      for(let community of recent_communities_array) {
        this.communityService.getCommunityInfoById(community.toString()).subscribe({
          next: (response: Communities) => {
            this.recentVisitCommunities.push(response);
          }
        })
      }
    }
    setInterval(()=>{
      if(window.location.href.includes("/home")) {
        this.isHomePage = true;
        this.isPopularPage = false;
      }
      else if(window.location.href.includes("/popular")) {
        this.isPopularPage = true;
        this.isHomePage = false;
      }
      else {
        this.isHomePage = false;
        this.isPopularPage = false;
      }
    }, 100);
  }

  ngAfterViewInit() {
    this.darkmodeSerive.useDarkMode();
  }

  change_recent_status() {
    this.recent_status = this.recent_status === 'up' ? 'down':'up';
    this.isOpen = !this.isOpen;
  }

  change_favorite_status() {
    this.favorite_status = this.favorite_status === 'up' ? 'down':'up';
  }

  change_moderation_status() {
    this.moderation_status = !this.moderation_status;
  }

  showCreateCommunityForm() {
    this.showCommunityFormEvent.emit(true);
  }

  goToHome() {
    this.shareDataService.setHomeCurViewPostId(0);
    this.shareDataService.setHomeSearchOption("hot");
    this.shareDataService.setPopularDetailPosts([]);
    this.shareDataService.setPopularPostIdArr([]);
  }

  goToPopular() {
    this.shareDataService.setPopularCurViewPostId(0);
    this.shareDataService.setPopularSearchOption("hot");
    this.shareDataService.setHomeDetailPosts([]);
    this.shareDataService.setHomePostIdArr([]);
  }
}
