import { Component, HostListener, Input } from '@angular/core';
import { Img } from '../../pojo/img';
import { CommunityService } from '../../../shared/services/search-communites/community.service';
import { Communities } from '../../../shared/pojo/pojo/communities';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePostRequest } from '../../pojo/create-post-request';
import { SendPostService } from '../service/send-post/send-post.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { CreatePostResponse } from '../../pojo/create-post-response';
import tinymce from 'tinymce';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';
import { EditorSettingService } from 'src/app/shared/services/editor-setting/editor-setting.service';
import { ClearFormatService } from 'src/app/shared/services/clear-format/clear-format.service';

@Component({
  selector: 'app-test',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  constructor(
    private searchCommunitiesService: CommunityService,
    private sendPostService: SendPostService,
    private storageService: StorageService,
    private dateTimeService: DateTimeService,
    private communityService: CommunityService,
    private route: Router,
    private darkmodeService: DarkModeService,
    public editorSettingService: EditorSettingService,
    private formatService: ClearFormatService
  ) {
  }

  @Input() img: Img = new Img("");
  @Input() selected_id: number = 0;

  public communities: Communities[] = [];
  public selected_community: Communities = new Communities(0, "Select a community", 0, "", "", 0, "../../assets/icon/dashed_circle.png", "", 0, 0);
  public avatar: string = "../../assets/icon/dashed_circle.png";
  public isPostOpen: boolean = true;
  public isPostImageOpen: boolean = false;
  public isPostVideoOpen: boolean = false;
  public isPostLinkOpen: boolean = false;
  public isImgUpload: boolean = false;
  public isCommunitySearchDropdownOpen: boolean = false;
  public characterCount: number = 0;
  public isLoad: boolean = false;
  public isShowSearchCommunity: boolean = false;

  public title: string = "";
  public community: string = "";
  public editorContent: string = "";
  public imgArr: Img[] = [];
  public videoContent: string = "";
  public linkContent: string = "";
  public community_id: number = 0;
  public allow: number = 0;

  public editorAllowed: boolean = true;
  public imgAllowed: boolean = true;
  public videoAllowed: boolean = true;
  public linkAllowed: boolean = true;

  public prev_content = "";
  public editor_id: string = "";

  ngOnInit() {
    this.darkmodeService.useDarkMode();
    const found = window.location.href.match('cid=([0-9]+)');
    if (found != null) {
      this.communityService.getCommunityInfoById(found[1]).subscribe({
        next: (response: Communities) => {
          this.community_id = response.id;
          this.community = response.name;
          this.avatar = response.avatar;
          this.allow = response.scope == 0 ? 1 : 0;
          this.selected_community = response;
          this.AllowSubmit();
        }
      })
    }
  }

  AllowSubmit() {
    console.log(this.community.length === 0 && this.title.length === 0)
    this.editorAllowed = this.community.length != 0 && this.title.length != 0 ? false : true;
    this.imgAllowed = this.community !== "" && this.title !== "" && this.imgArr.length > 0 ? false : true;
    this.linkAllowed = this.community !== "" && this.title !== "" && this.linkContent !== "" ? false : true;
    this.videoAllowed = this.community !== "" && this.title !== "" && this.videoContent !== "" ? false : true;
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const dt = event.dataTransfer;
    const files: File[] = dt.files;
    for (let i = 0; i < files.length; i++) {
      this.onImageUpload(files[i]);
    }
    const post_img_block: any = document.getElementById("post_img_block");
    post_img_block.style.border = "none";
    this.AllowSubmit();
  }

  onDragEnter(event: Event) {
    console.log("drag")
    event.preventDefault();
    event.stopPropagation();
    const post_img_block: any = document.getElementById("post_img_block");
    post_img_block.style.border = "2px dashed black";
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation()
    const parent: any = document.getElementById("post_img_block");
    parent.style.border = "none";
  }

  upLoadImg(event: any) {
    const files: FileList = event.target.files;
    const file = files[0];
    this.selected_id = 0;
    this.onImageUpload(file);
    this.AllowSubmit();
  }

  onImageUpload(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("loadend", () => {
      const data = reader.result as string;
      const path = (window.URL || window.webkitURL).createObjectURL(file);
      const img = new Img(data);
      console.log(img)
      this.imgArr.push(img);
      this.isImgUpload = this.imgArr.length <= 1 ? false : true;
      this.img = img;
      const arr_length = this.imgArr.length;
      this.selected_id = this.imgArr.length === 1 ? -1 : arr_length - 1;
      this.AllowSubmit();
    })
    this.AllowSubmit();
  }

  deleteImg(id: number) {
    this.imgArr.splice(id, 1);
    const t = <HTMLInputElement>document.getElementById("input_upload_img");
    t.value = "";
    if (id === 0 && this.imgArr.length === 0) {
      this.img = new Img("");
      this.selected_id = -1;
      this.imgArr = [];
      this.isImgUpload = false;
    }
    else if (id <= 1 && this.imgArr.length === 1) {
      this.img = new Img("");
      this.selected_id = -1;
      this.isImgUpload = false;
    }
    else if (id === 0 && this.imgArr.length > 1) {
      this.img = this.imgArr[id];
      this.selected_id = id;
    }
    else {
      this.img = this.imgArr[id - 1];
      this.selected_id = id - 1;
    }
    this.AllowSubmit();
  }

  selectImg(id: number) {
    this.img = this.imgArr[id];
    this.selected_id = id;
  }

  onVideoUpload(event: any) {
    const file = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.addEventListener("loadend", () => {
      const data = reader.result as string;
      if (data.length > 6700000) {
        Swal.fire("Maximum video size is 5MB", '', 'warning');
        this.AllowSubmit();
      }
      else {
        this.videoContent = data;
        this.AllowSubmit();
      }
    })
  }

  deleteVideo() {
    this.videoContent = "";
    const t = <HTMLInputElement>document.getElementById("input_upload_video");
    t.value = "";
    this.AllowSubmit();
  }

  onInputChange(img: Img) {
    this.imgArr[this.selected_id] = img;
  }

  onInputSearchComunityFocus(event: Event) {
    this.isCommunitySearchDropdownOpen = true;
    event.stopPropagation();
  }

  onDropDownSearchClick(event: Event) {
    this.isCommunitySearchDropdownOpen = !this.isCommunitySearchDropdownOpen;
    this.isShowSearchCommunity = !this.isShowSearchCommunity;
    event.stopPropagation();
  }

  // @HostListener('document:click', ['$event'])
  // closeCommunitySearch(event: Event) {
  //     this.isCommunitySearchDropdownOpen = false;
  //     const cellText = document.getSelection();
  //     // if (cellText?.type === 'Range') 
  //       // event.stopPropagation();
  // }

  public searchTimeout: any;
  public isSearch: boolean = false;
  searchCommunities(value: string) {
    if (value.replace(" ", "") != "") {
      this.community = value;
      console.log("community: " + value);
      if (this.searchTimeout != undefined)
        clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchCommunitiesService.searchCommunities(value).subscribe({
          next: (response: Communities[]) => {
            this.communities = response;
          },
          error: (e: HttpErrorResponse) => {
            console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          }
        })
      }, 250);
    }
    else {
      this.communities = [];
      this.community = "";
      this.avatar = "../../assets/icon/dashed_circle.png";
    }
    this.AllowSubmit();
  }

  openSearchCommunity() {
    this.isShowSearchCommunity = !this.isShowSearchCommunity;
    if (this.isShowSearchCommunity) {
      document.getElementById("input_search_community")?.focus();
    }
  }

  selectCommunity(community: Communities) {
    this.selected_community = community;
    this.isShowSearchCommunity = !this.isShowSearchCommunity;
    this.isCommunitySearchDropdownOpen = false;
    this.community = community.name;
    this.avatar = community.avatar;
    this.community_id = community.id;
    this.allow = community.scope == 0 ? 1 : 0;
    this.AllowSubmit();
    console.log("scope of community: " + this.allow);
  }

  // @HostListener('document:click', ['$event'])
  // closeProfileMenu(event: Event) {
  //   if (event.target !== document.getElementById("input_search_community"))
  //     this.isCommunitySearchDropdownOpen = false;
  // }

  inputTitle(event: any) {
    const textareaEle: any = event.target;
    textareaEle.value = textareaEle.value.replace(/(\r\n|\n|\r)/gm, "");
    textareaEle.style.height = 'auto';
    textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    this.characterCount = textareaEle.value.length;
    if (textareaEle.value === "") {
      textareaEle.style.height = '30px';
      this.characterCount = 0;
    }
    this.title = textareaEle.value;
    this.AllowSubmit();
  }

  inputLink(event: any) {
    const textareaEle: any = event.target;
    textareaEle.value = textareaEle.value.replace(/(\r\n|\n|\r)/gm, "");
    textareaEle.value = textareaEle.value.replace(" ", "");
    textareaEle.style.height = 'auto';
    textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    if (textareaEle.value === "") {
      textareaEle.style.height = '40px';
    }
    this.linkContent = textareaEle.value;
    console.log("link content: " + this.linkContent);
    this.AllowSubmit();
    this.isValidHttpUrl(textareaEle.value);
  }

  isValidHttpUrl(url: string) {
    try {
      const obj = new URL(url);
      this.linkAllowed = obj.protocol === "http:" || obj.protocol === "https:" ? false : true;
      console.log(obj.protocol)
    }
    catch (_) {
      this.linkAllowed = true;
    }
  }

  onContentChanged = (event: any) => {
    this.editorContent = event.editor.getContent({ format: 'html' });
    if(this.formatService.hasInlineStyle(this.editorContent)) {
      this.editorContent = this.formatService.removeInlineStyle(this.editorContent);
      tinymce.activeEditor!.setContent(this.editorContent);
    }
  }

  createPost(type: string, content: string) {
    const title: string = this.title;
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.isLoad = true;
    content = this.formatService.formatForCreatePost(content);
    content = this.formatService.removeInlineStyle(content);
    this.sendPostService.createPost(type, this.community_id, title, content, created_at, this.allow).subscribe({
      next: (response: CreatePostResponse) => {
        if (response.CREATED === true) {
          this.isLoad = false;
          Swal.fire('Create post successfully', '', 'success').then((result) => {
            this.route.navigate(["/post/" + response.POST_ID]);
          })
        }
        else {
          this.isLoad = false;
          Swal.fire('Error create post. Please try again', '', 'error')
        }
      },
      error: (e: HttpErrorResponse) => {
        this.isLoad = false;
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  createImgPost(type: string, content: Img[]) {
    const community: string = this.community;
    const title: string = this.title;
    const contentStr = JSON.stringify(content);
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.isLoad = true;
    this.sendPostService.createPost(type, this.community_id, title, contentStr, created_at, this.allow).subscribe({
      next: (response: CreatePostResponse) => {
        if (response.CREATED === true) {
          this.isLoad = false;
          Swal.fire('Create post successfully', '', 'success').then((result) => {
            this.route.navigate(["/post/" + response.POST_ID]);
          })
        }
        else {
          this.isLoad = false;
          Swal.fire('Error create post. Please try again', '', 'error')
        }
      },
      error: (e: HttpErrorResponse) => {
        this.isLoad = false;
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  createLinkPost(type: string, content: string) {
    const community: string = this.community;
    const title: string = this.title;
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.isLoad = true;
    this.sendPostService.createPost(type, this.community_id, title, content, created_at, this.allow).subscribe({
      next: (response: CreatePostResponse) => {
        if (response.CREATED === true) {
          this.isLoad = false;
          Swal.fire('Create post successfully', '', 'success').then((result) => {
            this.route.navigate(["/post/" + response.POST_ID]);
          })
        }
        else {
          this.isLoad = false;
          Swal.fire('Error create post. Please try again', '', 'error')
        }
      },
      error: (e: HttpErrorResponse) => {
        this.isLoad = false;
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  createVideoPost(type: string, content: string) {
    const community: string = this.community;
    const title: string = this.title;
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.isLoad = true;
    this.sendPostService.createPost(type, this.community_id, title, content, created_at, this.allow).subscribe({
      next: (response: CreatePostResponse) => {
        if (response.CREATED === true) {
          this.isLoad = false;
          Swal.fire('Create post successfully', '', 'success').then((result) => {
            this.route.navigate(["/post/" + response.POST_ID]);
          })
        }
        else {
          this.isLoad = false;
          Swal.fire('Error create post. Please try again', '', 'error')
        }
      },
      error: (e: HttpErrorResponse) => {
        this.isLoad = false;
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }
}
