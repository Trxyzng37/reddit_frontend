import { Component, HostListener, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Img } from './img';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  constructor (
  ) {}

  @Input() img: Img = new Img("");
  @Input() selected_id: number = 0;

  imgArr: Img[] = [];
  public isPostOpen: boolean = false;
  public isPostImageOpen: boolean = true;
  public isImgUpload: boolean = false;

  onDrop(event: any) {
    event.preventDefault();      
    console.log("image drop");
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
      event.stopPropagation()
      const post_img_block: any = document.getElementById("post_img_block");
      post_img_block.style.border = "2px solid red";
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
    else if (id === 0 && this.imgArr.length === 1) {
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

  public CreatePostForm: any = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    imgContent: new FormControl('')
  })

  public isCommunitySearchDropdownOpen: boolean = false;

  onInputSearchComunityFocus(event: Event) {
    this.isCommunitySearchDropdownOpen = true;
    event.stopPropagation();
  }

  onDropDownSearchClick(event: Event) {
    this.isCommunitySearchDropdownOpen = !this.isCommunitySearchDropdownOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event) {
    if (event.target !== document.getElementById("input_search_community"))
      this.isCommunitySearchDropdownOpen = false;
      // console.log("community search meneu close")
  }

  SignInFormSubmit() {
    console.log("title: " + this.CreatePostForm.value.title)
    console.log("content: " + this.CreatePostForm.value.content)
  }

  public characterCount: number = 0;

  onTextAreaInput(event: any) {
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

  public editorContent ="";

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
