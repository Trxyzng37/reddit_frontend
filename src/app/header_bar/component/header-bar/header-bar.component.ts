import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { Communities } from '../../../shared/pojo/pojo/communities';
import { CommunityService } from '../../../shared/services/search-communites/community.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../../../shared/pojo/pojo/user-profile';
import { SearchUserProfileService } from '../../../shared/services/search-user-profile/search-user-profile.service';
import { Router } from '@angular/router';
import { PresentationService } from 'src/app/shared/services/presentation/presentation.service';
import Swal from 'sweetalert2';
import { VoteImgService } from 'src/app/shared/services/vote-img/vote-img.service';
import { getCookie } from 'typescript-cookie';
import { RemoveRefreshTokenService } from 'src/app/shared/services/remove-refresh-token/remove-refresh-token.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'

})
export class HeaderBarComponent {
  public constructor(
    private storageService: StorageService,
    private searchCommunitiesService: CommunityService,
    private searchUserProfileService: SearchUserProfileService,
    private userProfileService: SearchUserProfileService,
    private router: Router,
    public presentationService: PresentationService,
    public voteImgService: VoteImgService,
    private removeRefreshTokenService: RemoveRefreshTokenService,
    private checkRefreshToken: CheckRefreshTokenService,
    private darkmodeService: DarkModeService
  ) {}

  @Output() openNavigationEvent = new EventEmitter<Object>;

  public isSignIn: boolean = false;
  public isModPage: boolean = window.location.href.includes('mod/');
  public isProfileMenuOpen: boolean = false;
  public communities_result: Communities[] = [];
  public user_profile_result: UserProfile[] = [];
  public userInfo: UserProfile = new UserProfile(0,'','','',0,0,'');
  public background_mode: string = "Dark mode"; 
  public isSearch: boolean = false;
  public wait: boolean = false;

  ngOnInit() {
    this.checkRefreshToken.checkRefreshToken().subscribe({
      next: (response: any) => {
        this.isSignIn = (this.storageService.getItem("uid") != "" && this.storageService.getItem("uid") != "0") ? true:false;
        const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
        //recheck token every 30s
        setInterval(() => {
          this.checkRefreshToken.checkRefreshToken().subscribe({
            next: (response: any) => {
              this.isSignIn = (this.storageService.getItem("uid") != "" && this.storageService.getItem("uid") != "0") ? true:false;
            },
            error: (e: HttpErrorResponse) => {
              this.isSignIn = false;
              this.storageService.removeItem("uid");
              Swal.fire({
                title: 'Error checking refresh token',
                icon: 'error'
              }).then(result => {
                if(result.isConfirmed) {
                  window.location.reload();
                }
              })
            }
          });
        }, 10000); 
        this.userProfileService.getUserProfileByUid(uid).subscribe({
          next: (response: UserProfile) => {
            this.wait = true;
            this.userInfo = response;
          }
        })
      },
      error: (e: HttpErrorResponse) => {
        this.isSignIn = false;
        this.wait = true;
      }
    })
    document.getElementById("txt_username")?.addEventListener('click', (event)=>{
      event.stopPropagation();
    })
    if (window.innerWidth < 900) {
      this.isOpen = false;
      this.openNavigationEvent.emit({
        data: this.isOpen
      });
    }
    let isSearchPage = window.location.href.includes("/search/");
    if(isSearchPage) {
      let regex = '/search/([^*]+)';
      const a = window.location.href.match(regex);
      if(a != null) {
        let search_value = a[1];
        const search_box = <HTMLInputElement>document.getElementById("search_box");
        search_box.value = search_value;
        this.onChange(search_value);
      }
    }
  }

  onClick() {
    this.isSignIn = !this.isSignIn;
    console.log(this.storageService.getItem("isSignIn"))
  }

  public searchTimeout: any;
  onChange(value: string) {
    console.log(value.replace(" ",""));
    this.isSearch = value.length > 0;
    if(value.replace(" ","") != "") {
      if(this.searchTimeout != undefined)
        clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchCommunitiesService.searchCommunities(value).subscribe({
          next: (response: Communities[]) => {
            this.communities_result = response.slice(0,4);
          },
          error: (e: HttpErrorResponse) => {
            console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          }
        })
        this.searchUserProfileService.searchUserProfile(value).subscribe({
          next: (response: UserProfile[]) => {
            console.log(response)
            this.user_profile_result = response.slice(0,4);
            // const search = <HTMLInputElement>document.getElementById("search_box");
            // this.isSearch = search.value.length > 0;
          },
          error: (e: HttpErrorResponse) => {
            console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          }
        })
      }, 250);
    }
    else {
      this.communities_result = [];
      this.user_profile_result = [];
      // const search = <HTMLInputElement>document.getElementById("search_box");
      // this.isSearch = search.value.length > 0;
    }
  }

  openProfileMenu(event: Event) {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    console.log("profile meneu open")
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event) {
      this.isProfileMenuOpen = false;
      const cellText = document.getSelection();
      if (cellText?.type === 'Range') 
        event.stopPropagation();
  }

  logOut(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Log out"
    }).then((result)=>{
      if(result.isConfirmed) {
        this.removeRefreshTokenService.removeRefreshToken().subscribe({
          next: (response: any) => {
            this.storageService.removeItem("uid");
            this.storageService.removeItem("mode");
            window.location.href = "/signin";
          },
          error: (e: HttpErrorResponse) => {
            this.storageService.removeItem("uid");
            this.storageService.removeItem("mode");
            window.location.href = "/signin";
          }
        })
      }
      else {
        this.isProfileMenuOpen = false;
      }
    })

  }

  navigateToUserProfile() {
    window.location.href = "/user/" + this.userInfo.username + "/posts";
  }

  createPost() {
    // window.location.href = "/create-post";
    this.router.navigate(['/create-post']);
  }

  isOpen = false;
  opeNavigation(event: any) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.openNavigationEvent.emit({
      data: this.isOpen
    });
  }

  useDarkMode() {
    const mode = this.storageService.getItem("mode") == "1" ? 1 : 0;
    this.storageService.setItem("mode", mode == 1 ? "0" : "1");
    this.darkmodeService.useDarkMode();
    this.isProfileMenuOpen = false;
    this.voteImgService.selectDownVoteImg();
    this.voteImgService.selectUpVoteImg();
  }

  goToMainPage() {
    if(this.isSignIn) 
      window.location.href = "/home";
    else 
    window.location.href = "/popular";
  }
}
