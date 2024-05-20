import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from 'src/app/shared/pojo/pojo/user-profile';
import { UserInfoService } from 'src/app/shared/services/user-info/user-info.service';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-people-view',
  templateUrl: './search-people-view.component.html',
  styleUrl: './search-people-view.component.scss'
})
export class SearchPeopleViewComponent {

  public constructor(
    private searchUserProfileService: SearchUserProfileService,
    private activeRoute: ActivatedRoute
  ) {}

  public users: UserProfile[] = [];
  public search_text: string = "";

  ngOnInit() {
    this.search_text = this.activeRoute.snapshot.params['text'];
    this.searchUserProfileService.searchUserProfile(this.search_text).subscribe({
      next: (response: UserProfile[]) => {
        this.users = response;
      }
    })
  }

  navigateToUserProfile(event: Event, uid: number) {
    event.stopPropagation();
    window.location.href = "/r/" + uid;
  }
}