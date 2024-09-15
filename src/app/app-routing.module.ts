import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { SigninComponent } from './signin/components/signin/signin.component';
import { SignupComponent } from './signup/components/signup/signup.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/components/home/home.component';
import { ForgotPasswordComponent } from './forgot-password/components/forgot-password/forgot-password.component';
import { PassCodeComponent } from './pass-code/components/pass-code/pass-code.component';
import { ChangePasswordComponent } from './change-password/components/change-password/change-password.component';
import { ConfirmEmailComponent } from './signup/components/confirm-email/confirm-email.component';
import { CreatePostComponent } from './create-post/create-post/component/create-post.component';
import { PostMainComponent } from './post-main/component/post-main/post-main.component';
import { PostLinkListComponent } from './post-link-list/component/post-link-list/post-link-list.component';
import { EditorViewComponent } from './post-link/editor/component/editor-view/editor-view.component';
import { ViewDetailPostComponent } from './view-detail-post/view-detail-post/component/view-detail-post.component';
import { EditPostComponent } from './edit-post/edit-post/component/edit-post.component';
import { CreateCommunityComponent } from './create-community/component/create-community.component';
import { EditCommunityComponent } from './edit-community/component/edit-community.component';
import { SearchResultsComponent } from './search-page/search-results/search-results.component';
import { UserProfileComponent } from './user-profile/user-profile/user-profile.component';
import { EditUserInfoComponent } from './edit-user-profile/edit-user-info/edit-user-info.component';
import { ChooseUsernameComponent } from './choose-username/choose-username/choose-username.component';
import { SignInGuard } from './shared/guard/Signin.guard';
import { RefreshTokenGuard } from './shared/guard/refresh-token.guard';
import { SignUpGuard } from './shared/guard/Signup.guard';
import { ConfirmEmailGuard } from './shared/guard/confirm-email.guard';
import { ChooseUsernameGuard } from './shared/guard/choose-username.guard';
import { ChangePasswordGuard } from './shared/guard/change-password.guard';
import { ChangePasswordEmailGuard } from './shared/guard/change-password-email.guard';
import { PostInfoComponent } from './post-view/post-view.component';
import { CommentViewListComponent } from './user-profile/comment-view-list/comment-view-list.component';
import { ControlPostComponent } from './control-post/control-post/control-post.component';
import { ModPostViewComponent } from './control-post/post-view/post-view/post-view.component';
import { ModeratePostComponent } from './control-post/moderate-post/moderate-post/moderate-post.component';

const routes: Routes = [
  {path: '', redirectTo: 'popular', pathMatch: 'full'},
  { path: 'goole-authentication-callback', title: 'Google-call-back', component: SigninComponent},
  { path: 'signin', component: SigninComponent, title: 'Sign in', canActivate: mapToCanActivate([SignInGuard])},
  { path: 'signup', title: 'Sign up', component: SignupComponent, canActivate: mapToCanActivate([SignUpGuard])},
  { path: 'check-sign-up-passcode', title: 'Verify passcode', component: ConfirmEmailComponent, canActivate: mapToCanActivate([ConfirmEmailGuard])},
  { path: 'choose-username', title: 'Choose username', component: ChooseUsernameComponent, canActivate: mapToCanActivate([ChooseUsernameGuard])},
  { path: 'forgot-password', title: 'Forgot password', component: ForgotPasswordComponent},
  { path: 'forgot-password-pass-code', title: 'Verify passcode', component: PassCodeComponent, canActivate: mapToCanActivate([ChangePasswordEmailGuard])},
  { path: 'change-password', title: 'Change password', component: ChangePasswordComponent, canActivate: mapToCanActivate([ChangePasswordGuard])},
  { path: '',  component: HomeComponent, 
    children: [
      { path: 'create-post', title: 'Create post', component: CreatePostComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
      { path: 'create-post?cid=:community_id', title: 'Create post', component: CreatePostComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
      { path: '', component: PostMainComponent,
        children: [
          {path: 'home', title: 'Reddit', component: PostLinkListComponent},
          {path: 'popular', title: 'Reddit', component: PostLinkListComponent},
          {path: 'r/:community_id', title: 'Community', component: PostLinkListComponent},
          {path: 'edit-post/:post_id', title: 'Edit post', component: EditPostComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
          {path: 'control-posts/:community_id', title: 'Control posts', component: PostLinkListComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
          {path: 'search/:text', title: 'Search', component: SearchResultsComponent},
          {path: 'setting/:username', title: 'User setting', component: EditUserInfoComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
          {path: 'edit-community/:community_id', title: 'Edit community', component: EditCommunityComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
        ]
      },
      { path: '', title: '', component: PostInfoComponent,
        children: [
          {path: 'post/:post_id', title: 'Post', component: ViewDetailPostComponent},
          {path: 'post/:post_id/comment/:comment_id', title: 'Post', component: ViewDetailPostComponent},
        ]
      },
      { path: 'user/:username', title: "User profile", component: UserProfileComponent,
        children: [
          {path: 'posts', component: PostLinkListComponent},
          {path: 'saved', component: PostLinkListComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
          {path: 'wait_for_approve', component: PostLinkListComponent, canActivate: mapToCanActivate([RefreshTokenGuard])},
          {path: 'comments', component: CommentViewListComponent}
        ]
      },
    ]
  },
  {path: 'mod', title: "Mod queue", component: ControlPostComponent,
    children: [
      { path: '', component: ModeratePostComponent,
        children: [
          {path: ':community_id/review', component: ModPostViewComponent, canActivate: mapToCanActivate([RefreshTokenGuard]), runGuardsAndResolvers: 'always'},
          {path: ':community_id/approved', component: ModPostViewComponent, canActivate: mapToCanActivate([RefreshTokenGuard]), runGuardsAndResolvers: 'always'},
          {path: ':community_id/removed', component: ModPostViewComponent, canActivate: mapToCanActivate([RefreshTokenGuard]), runGuardsAndResolvers: 'always'},
          {path: ':community_id/editted', component: ModPostViewComponent, canActivate: mapToCanActivate([RefreshTokenGuard]), runGuardsAndResolvers: 'always'},
        ]
      }
    ]
  },
  { path: 'error', title:'ERROR', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


