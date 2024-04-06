import { Component, HostListener } from '@angular/core';
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

  public imgArr: Img[] = [];

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

  public isPostOpen: boolean = false;
  public isPostImageOpen: boolean = true;
  public isImgExit: boolean = false;

  upLoadImg(event: any) {
    const files: FileList = event.target.files;
    const file = files[0];
    this.onImageUpload(file);
  }

  onImageUpload(file: File) {
    this.isImgExit = true;
    // const files: FileList = event.target.files;
    // const file = files[0];
    // console.log(URL.createObjectURL(file))
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("loadend", () => {
      const data = reader.result as string;
      const path = (window.URL || window.webkitURL).createObjectURL(file);
      // console.log(data)
      const img = new Img(path);
      console.log(img)
      this.imgArr.push(img);
    })
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
      // this.isCommunitySearchDropdownOpen = false;
      console.log("community search meneu close")
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
