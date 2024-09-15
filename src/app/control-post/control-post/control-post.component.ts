import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { SearchUserProfileService } from 'src/app/shared/services/search-user-profile/search-user-profile.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { GetCommentsService } from 'src/app/view-detail-post/view-detail-post/service/get-comments/get-comments.service';
import { CommunityService } from 'src/app/shared/services/search-communites/community.service';
import { Communities } from 'src/app/shared/pojo/pojo/communities';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';

@Component({
  selector: 'app-control-post',
  templateUrl: './control-post.component.html',
  styleUrl: './control-post.component.scss'
})
export class ControlPostComponent {
  public constructor(
    private activeRoute: ActivatedRoute,
    private shareDataService: ShareDataService,
  ) {}

  ngOnInit() {
    // const community_id = this.activeRoute.snapshot.params['community_id'];
    // this.shareDataService.setModCommunityId(community_id);
  }
}
