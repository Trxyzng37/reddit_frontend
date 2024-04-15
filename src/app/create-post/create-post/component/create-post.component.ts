import { Component, HostListener, Input } from '@angular/core';
import { Img } from '../../pojo/img';
import { SearchCommunitiesService } from '../../../shared/services/search-communites/search-communities.service';
import { Communities } from '../../../shared/pojo/pojo/communities';
import { HttpErrorResponse } from '@angular/common/http';
import { PostRequest } from '../../pojo/create-post-request';
import { SendPostService } from '../service/send-post/send-post.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { CreatePostResponse } from '../../pojo/create-post-response';
import tinymce from 'tinymce';

@Component({
  selector: 'app-test',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class TestComponent {
  constructor (
    private searchCommunitiesService: SearchCommunitiesService,
    private sendPostService: SendPostService,
    private storageService: StorageService,
    private dateTimeService: DateTimeService
  ) {
  }

  @Input() img: Img = new Img("");
  @Input() selected_id: number = 0;

  communities: Communities[] = [new Communities(1, "a", "aaa", "aaa", 1, "../../assets/icon/technology.png"), new Communities(2, "b", "bbb", "bbb", 2, "../../assets/icon/technology.png")];
  public selected_community_icon: string = "../../assets/icon/dashed_circle.png";
  public isPostOpen: boolean = true;
  public isPostImageOpen: boolean = false;
  public isPostLinkOpen: boolean = false;
  public isImgUpload: boolean = false;
  public isCommunitySearchDropdownOpen: boolean = false;
  public characterCount: number = 0;

  public title: string = "";
  public community: string = "";
  public editorContent: string = "";
  public imgArr: Img[] = [];
  public linkContent: string = "";

  public editorAllowed: boolean = true;
  public imgAllowed: boolean = true;
  public linkAllowed: boolean = true;

  AllowSubmit() {
    // console.log(this.community !== "" && this.title !== "" ? false : true)
    this.editorAllowed = this.community !== "" && this.title !== "" ? false : true;
    this.imgAllowed = this.community !== "" && this.title !== "" && this.imgArr.length > 0 ? false : true;
    this.linkAllowed = this.community !== "" && this.title !== "" && this.linkContent !=="" ? false : true;
  }

  onDrop(event: any) {
    event.preventDefault();   
    event.stopPropagation();
    const dt = event.dataTransfer;
    const files:File[] = dt.files;
    for(let i=0; i< files.length; i++) {
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
    // const files: FileList = event.target.files;
    // const file = files[0];
    // console.log(URL.createObjectURL(file))
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
      this.img = this.imgArr[id-1];
      this.selected_id = id-1;
    }
    this.AllowSubmit();
  }

  selectImg(id: number) {
    this.img = this.imgArr[id];
    this.selected_id = id;
  }

  onInputChange(img: Img) {
    this.imgArr[this.selected_id] = img;
    // console.log(img.caption)
  }

  onInputSearchComunityFocus(event: Event) {
    this.isCommunitySearchDropdownOpen = true;
    event.stopPropagation();
  }

  onDropDownSearchClick(event: Event) {
    this.isCommunitySearchDropdownOpen = !this.isCommunitySearchDropdownOpen;
    event.stopPropagation();
  }

  searchCommunities(value: string) {
    this.AllowSubmit();
    if (value !== " " && value !== "") {
      this.community = value;
      console.log("community: " + value);
      this.searchCommunitiesService.searchCommunities(value).subscribe({
        next: (response: Communities[]) => {
          console.log(response)
          this.communities = response;
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
    else {
      this.communities = [];
    }
  }

  selectCommunity(community: Communities) {
    this.isCommunitySearchDropdownOpen = false;
    this.community = community.name;
    this.selected_community_icon = community.icon_base64;
    this.community = community.name;
    this.AllowSubmit();
    console.log("select community: " + this.community);
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event) {
    if (event.target !== document.getElementById("input_search_community"))
      this.isCommunitySearchDropdownOpen = false;
  }

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
    console.log(this.linkContent);
    this.AllowSubmit();
    this.isValidHttpUrl(textareaEle.value);
  }

  isValidHttpUrl(url: string) {
    try {
      const obj = new URL(url);
      this.linkAllowed = obj.protocol === "http:" || obj.protocol === "https:" ? false: true;
      console.log(obj.protocol)
    } 
    catch (_) {
      this.linkAllowed = true;  
    }
  }

  //editor settings
  public setting = {
    base_url: '/tinymce',
    suffix: '.min',
    automatic_uploads: true,
    file_picker_types: 'image',
    toolbar: "bold italic strike | code image",
    images_file_types: 'jpg,svg,webp,png,jpeg',
    images_reuse_filename: true,
    plugins: 'code image', 
    statusbar: true,
    elementpath: false,
    branding: false,
    resize: true,
    height: '40vh', 
    menubar: false, 
    draggable_modal: false,
    object_resizing: false,
    inline_boundaries: false,
    // skin: 'oxide-dark', 
    content_css: 'tinymce-5',
    content_style: 'body img { display: block;margin: 0 auto; }',
    file_picker_callback: (cb: any, value:any, meta:any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.addEventListener('change', (e:any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const id = 'blobid' + (new Date()).getTime();
          const blobCache =  tinymce.activeEditor!.editorUpload.blobCache;
          const base64 = (<string>reader.result).split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          cb(blobInfo.blobUri(), { title: file.name });
        });
        reader.readAsDataURL(file);
      })
      input.click();
    },

  }

  onContentChanged = (event: any) =>{
    this.editorContent = event.editor.getContent({ format: 'html' });
    console.log(this.editorContent)
    // this.editorContent = event.editor.setContent({ format: 'text' });
  }

  public quillConfig = {
    toolbar: {
      container: [
        [
          'bold', 
          'italic', 
          'underline', 
          'strike',
          { 'header': 1 },              
          { 'color': [] },          
          { 'script': 'sub'}, 
          { 'script': 'super' },   
          'clean',
          { 'list': 'ordered'}, 
          { 'list': 'bullet' },                                           
          'blockquote', 
          'code-block',
          'link', 
          // 'image', 
          'video'
        ]                         
      ],
    },
  }

  createPost(type: string, content: string) {
    const username: string = this.storageService.getItem("username");
    const community: string = this.community;
    const title: string = this.title;
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.sendPostService.createPost(type, username, community, title, content, created_at).subscribe({
      next: (response: CreatePostResponse) => {
        if(response.CREATED === true)
          alert("Create new post successfully")
        else 
          alert("Error create new post")
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }

  createImgPost(type: string, content: Img[]) {
    const username: string = this.storageService.getItem("username");
    const community: string = this.community;
    const title: string = this.title;
    const contentStr = JSON.stringify(content);
    const created_at: Date = this.dateTimeService.getCurrentDateTime();
    console.log("Post type: " + type);
    this.sendPostService.createPost(type, username, community, title, contentStr, created_at).subscribe({
      next: (response: CreatePostResponse) => {
        if(response.CREATED === true)
          alert("Create new post successfully")
        else 
          alert("Error create new post")
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }
}
