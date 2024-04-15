import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SignupComponent } from './signup/components/signup/signup.component';
import { ErrorComponent } from './error/error.component';
import { HttpClientModule } from '@angular/common/http'
import { SigninComponent } from './signin/components/signin/signin.component';
import { HomeComponent } from './home/components/home/home.component';
import { ForgotPasswordComponent } from './forgot-password/components/forgot-password/forgot-password.component';
import { PassCodeComponent } from './pass-code/components/pass-code/pass-code.component';
import { ChangePasswordComponent } from './change-password/components/change-password/change-password.component';
import { ConfirmEmailComponent } from './signup/components/confirm-email/confirm-email.component';
import { TestComponent } from './create-post/create-post/component/create-post.component';
import { PostLinkComponent } from './post-link/component/post-link/post-link.component';
import { PostLinkListComponent } from './post-link-list/component/post-link-list/post-link-list.component';
import { PostMainComponent } from './post-main/component/post-main/post-main.component';
import { RecentVisitedPostComponent } from './recent-visited-post/component/recent-visited-post/recent-visited-post.component';
import { NavigationBarComponent } from './navigation_bar/component/navigation-bar/navigation-bar.component';
import { HeaderBarComponent } from './header_bar/component/header-bar/header-bar.component';
import { QuillModule } from 'ngx-quill';
import { InViewportModule } from 'ng-in-viewport';
import { SafeHtmlPipe } from './shared/pipe/safe-html';
import { ImgUploadedComponent } from './create-post/img_uploaded/component/img-uploaded/img-uploaded.component';
import { ImgCaptionComponent } from './create-post/img-caption/img-caption/img-caption.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ErrorComponent,
    ForgotPasswordComponent,
    HomeComponent,
    PassCodeComponent,
    ChangePasswordComponent,
    ConfirmEmailComponent,
    TestComponent,
    PostLinkComponent,
    PostMainComponent,
    RecentVisitedPostComponent,
    NavigationBarComponent,
    HeaderBarComponent,
    PostLinkListComponent,
    ImgUploadedComponent,
    ImgCaptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    QuillModule,
    BrowserAnimationsModule,
    InViewportModule,
    SafeHtmlPipe,
    EditorModule,
    FormsModule
  ],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
