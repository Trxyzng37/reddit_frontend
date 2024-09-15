import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { ActivatedRoute } from '@angular/router';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';

@Component({
  selector: 'app-search-community-view',
  templateUrl: './search-community-view.component.html',
  styleUrl: './search-community-view.component.scss'
})
export class SearchCommunityViewComponent {

  public constructor(
    private communityService: CommunityService,
    private activeRoute: ActivatedRoute,
    public presentationService: PresentationService
  ) {}

  public communities: Communities[] = [];
  public search_text: string = "";

  public isDataLoad: boolean = false;
  public wait: boolean = false;

  ngOnInit() {
    this.search_text = this.activeRoute.snapshot.params['text'];
    this.isDataLoad = true;
    this.communityService.searchCommunities(this.search_text).subscribe({
      next: (response: Communities[]) => {
        this.communities = response;
        this.isDataLoad = false;
        this.wait = true;
      }
    })
  }

  ngOnChanges() {
  }

  navigateToCommunity(event: Event, community_id: number) {
    event.stopPropagation();
    window.location.href = "/r/" + community_id;
  }
}
