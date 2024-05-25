import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
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
    private recentVisitService: RecentVisitService
  ) {}

  public isOpen: boolean = true;
  public recent_status: string = 'down';
  public favorite_status: string = 'down';
  public moderation_status:boolean = false;

  @Output() showCommunityFormEvent = new EventEmitter<boolean>();

  public favoriteCommunities: Communities[] = [];
  public recentVisitCommunities: Communities[] = [];
  public moderationCommunities: Communities[] = [];

  ngOnInit() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.communityService.getSubscribedCommunitiesByUid(uid).subscribe({
      next: (response: Communities[]) => {
        this.favoriteCommunities = response;
      }
    })
    this.recentVisitService.getRecentVisitCommunity(uid).subscribe({
      next: (response: Communities[]) => {
        this.recentVisitCommunities = response;
      }
    })
    this.communityService.getCommunityInfoByUid(uid).subscribe({
      next: (response: Communities[]) => {
        this.moderationCommunities = response;
      }
    })
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
}
