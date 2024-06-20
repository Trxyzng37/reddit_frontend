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
import { signinGuard } from './signin/guards/signin.guard';
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

const routes: Routes = [
  { path: 'signin', component: SigninComponent, canActivate: mapToCanActivate([signinGuard])},
  // { path: 'signin', title: 'sign-in', component: SigninComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'signup', title: 'sign-up', component: SignupComponent},
  { path: 'forgot-password', title: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'pass-code', title: 'enter-passcode', component: PassCodeComponent},
  { path: 'change-password', title: 'change-password', component: ChangePasswordComponent},
  { path: 'check-confirm-email-passcode', title: 'check-confirm-email-passcode', component: ConfirmEmailComponent },
  { path: '', title: 'home', component: HomeComponent, 
    children: [
      { path: '', component: PostMainComponent,
      children: [
        {path: 'home', title: 'home', component: PostLinkListComponent},
        {path: 'popular', title: 'popular', component: PostLinkListComponent},
        {path: 'r/:community_id', title: 'trxyzng', component: PostLinkListComponent},
        {path: 'edit-post/:post_id', component: EditPostComponent},
        {path: 'post/:post_id', title: 'view-post', component: ViewDetailPostComponent},
        {path: 'control-posts/:community_id', component: PostLinkListComponent},
        {path: 'search/:text', component: SearchResultsComponent},
        {path: 'user/:username', component: UserProfileComponent},
        {path: 'setting/:username', component: EditUserInfoComponent},
        {path: 'edit-community/:community_id', component: EditCommunityComponent},
      ]
      }
    ]
  },
  {path: 'create-post', component: CreatePostComponent},
  {path: 'choose-username', component: ChooseUsernameComponent},
  {path: 'create-post?cid=:community_id', component: CreatePostComponent},
  { path: 'error', title:'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


