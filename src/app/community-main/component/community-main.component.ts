import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community-main',
  templateUrl: './community-main.component.html',
  styleUrl: './community-main.component.scss'
})
export class CommunityMainComponent {

  public banner_url: string = "../../../assets/banner/lol.png";
  public avatar_url: string = "../../../assets/icon/tft.jpg";
  public sort_option: string = "hot";
  public isSortOptionShow: boolean = false;

  selectSort(type: string) {
    this.sort_option = type;
    this.isSortOptionShow = !this.isSortOptionShow;
  }

  showSortOption() {
    this.isSortOptionShow = !this.isSortOptionShow;
  }
}
