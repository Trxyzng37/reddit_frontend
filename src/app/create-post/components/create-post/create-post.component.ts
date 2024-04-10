import { Component, HostListener, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Img } from '../../img';
import { SearchCommunitiesService } from '../../../shared/services/search-communites/search-communities.service';
import { Communities } from '../../../shared/pojo/pojo/communities';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class TestComponent {
  constructor (
    private searchCommunitiesService: SearchCommunitiesService
  ) {}

  @Input() img: Img = new Img("");
  @Input() selected_id: number = 0;

  imgArr: Img[] = [];
  communities: Communities[] = [new Communities(1, "a", "aaa", "aaa", 1, "../../assets/icon/technology.png"), new Communities(2, "b", "bbb", "bbb", 2, "../../assets/icon/technology.png")];
  public selected_community_icon: string = "../../assets/icon/dashed_circle.png";
  public isPostOpen: boolean = true;
  public isPostImageOpen: boolean = false;
  public isPostLinkOpen: boolean = false;
  public isImgUpload: boolean = false;
  public isCommunitySearchDropdownOpen: boolean = false;
  public characterCount: number = 0;
  public editorContent ="";

  public CreatePostForm: any = new FormGroup({
    community: new FormControl(''),
    type: new FormControl(''),
    title: new FormControl(''),
    content: new FormControl(''),
  })

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
      const img = new Img(path);
      console.log(img)
      this.imgArr.push(img);
      this.isImgUpload = this.imgArr.length <= 1 ? false : true;
      this.img = img;
      const arr_length = this.imgArr.length;
      this.selected_id = this.imgArr.length === 1 ? -1 : arr_length - 1;
    })
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
    if (value !== " " && value !== "") {
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
    console.log("select community: " + community);
    this.CreatePostForm.value.community = community.name;
    this.selected_community_icon = community.icon_base64;
    console.log("select img: " + community.icon_base64);
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event) {
    if (event.target !== document.getElementById("input_search_community"))
      this.isCommunitySearchDropdownOpen = false;
      // console.log("community search meneu close")
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
  }

  inputLink(event: any) {
    const textareaEle: any = event.target;
      textareaEle.value = textareaEle.value.replace(/(\r\n|\n|\r)/gm, "");
      textareaEle.style.height = 'auto';
      textareaEle.style.height = `${textareaEle.scrollHeight}px`;
      if (textareaEle.value === "") {
        textareaEle.style.height = '30px';
      }
  }

  onContentChanged = (event: any) =>{
    this.editorContent = event.html;
    console.log(this.editorContent)
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
}
