import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { Communities } from '../../service/pojo/communities';
import { SearchCommunitiesService } from '../../service/search-communites/search-communities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../../service/pojo/user-profile';
import { SearchUserProfileService } from '../../service/search-user-profile/search-user-profile.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent {
  public constructor(
    private storageService: StorageService,
    private searchCommunitiesService: SearchCommunitiesService,
    private searchUserProfileService: SearchUserProfileService
  ) {}

  public isSignIn: boolean = false;
  public communities_result: Communities[] = [];
  public user_profile_result: UserProfile[] = [];

  ngOnInit() {
    this.storageService.setItem("isSignIn", "true");
    this.isSignIn = this.storageService.getItem("isSignIn") === "true" ? true:false;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onClick() {
    this.isSignIn = !this.isSignIn;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onChange(value: string) {
    if (value !== " " && value !== "") {
      this.searchCommunitiesService.searchCommunities(value).subscribe({
        next: (response: Communities[]) => {
          console.log(response)
          this.communities_result = response;
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
      this.searchUserProfileService.searchUserProfile(value).subscribe({
        next: (response: UserProfile[]) => {
          console.log(response)
          this.user_profile_result = response;
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
    else {
      this.communities_result = [];
      this.user_profile_result = [];
    }
  }


}
