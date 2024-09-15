import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VoteImgService {

  constructor(
    private storageService: StorageService
  ) { }

  public upvote: string = "";
  public downvote: string = "";

  public upvote_light = "../../../../assets/icon/upvote-light.svg";
  public upvote_dark = "../../../../assets/icon/upvote-dark.svg";
  public upvote_fill = "../../../../../assets/icon/upvote-fill.png";
  public downvote_fill = "../../../../../assets/icon/downvote-fill.png";
  public downvote_light = "../../../../assets/icon/downvote-light.svg";
  public downvote_dark = "../../../../assets/icon/downvote-dark.svg";

  selectUpVoteImg(): void {
    const mode = this.storageService.getItem("mode") == "0" ? 0 : 1;
    if(mode == 0) {
      this.upvote = "../../../../assets/icon/upvote-dark.svg";
    }
    else {
      this.upvote = "../../../../assets/icon/upvote-light.svg";
    }
  }

  selectDownVoteImg(): void {
    const mode = this.storageService.getItem("mode") == "0" ? 0 : 1;
    if(mode == 0) {
      this.downvote = "../../../../assets/icon/downvote-dark.svg";
    }
    else {
      this.downvote = "../../../../assets/icon/downvote-light.svg";
    }
  }
}
