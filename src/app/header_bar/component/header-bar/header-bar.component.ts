import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { Communities } from '../../service/pojo/communities';
import { SearchCommunitiesService } from '../../service/search-communites/search-communities.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent {
  public constructor(
    private storageService: StorageService,
    private searchCommunitiesService: SearchCommunitiesService
  ) {}

  public isSignIn: boolean = false;
  public search_result: Communities[] = [];
  private arr: string[] = ["aaa", "Abc", "bcd", "def", "art", "avail", "aeo", "jil", "ghi abc", "valve", "ass", "anomoly", "dawn", "browser", "ack", "saw", "Ask", "Aww", "Ass"];

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
      const observable: Observable<Communities[]> = this.searchCommunitiesService.searchCommunities(value);
      observable.subscribe({
        next: (response: Communities[]) => {
          console.log(value.toUpperCase())
          console.log(response)
          this.search_result = response;
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
    else {
      this.search_result = [];
    }
  }


}
