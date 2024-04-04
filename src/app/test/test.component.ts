import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  constructor (
  ) {}

  uploadImg(files: File[]) {
    const post_img_block: any = document.getElementById("post_img_block");
    const upload_img_block: any = document.getElementById("upload_img_block");
    const img_lists: any = document.getElementById("img_uploaded_result");
    const btn: any = document.getElementById("btn_upload_img");
    btn.style.margin = "10px 0px";
    btn.style.marginRight = "20px";
    btn.style.marginLeft = "10px";
    for(let file of files) {
      console.log(file.name)
      const container = document.createElement("div");
      container.style.display = "inline-block"; 
      container.style.margin = "10px 0px";
      container.style.marginLeft = "10px";
      container.style.width = "100px";
      container.style.height = "100px";
      container.style.position = "relative";

      const delete_btn = document.createElement("button");
      delete_btn.setAttribute("type", "button");
      delete_btn.addEventListener("click", () => {
        console.log("close image click");
        const parent_div: any = delete_btn.parentElement;
        parent_div.remove();
        if (img_lists.children.length <= 2) {
          const txt: any = document.getElementById("txt_drag_and_drop");
          txt.style.display = "block";
          btn.style.margin = "0 0";
          post_img_block.style.justifyContent = "center";
          post_img_block.style.alignItems = "center";
          upload_img_block.style.justifyContent = "center";
        }
      })

      container.addEventListener("mouseenter", () => {
        const child_btn: HTMLCollectionOf<HTMLButtonElement> = container.getElementsByTagName("button");
        child_btn[0].style.display = "flex";
        child_btn[0].style.justifyContent = "center";
        child_btn[0].style.alignItems = "center";
      });

      container.addEventListener("mouseleave", () => {
        const child_btn: HTMLCollectionOf<HTMLButtonElement> = container.getElementsByTagName("button");
        child_btn[0].style.display = "none";
      })

      delete_btn.style.position = "absolute";
      delete_btn.style.top = "3px";
      delete_btn.style.right = "3px";
      delete_btn.style.width = "20px";
      delete_btn.style.height = "20px";
      delete_btn.style.borderRadius = "50%";
      delete_btn.style.display = "none";

      const icon = document.createElement("img");
      icon.src = "../../assets/icon/close.png";
      icon.style.width = "100%";
      icon.style.height = "100%";

      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      image.style.width = "100%";
      image.style.height = "100%";

      delete_btn.appendChild(icon);
      container.appendChild(delete_btn);
      // alert(parent.children.length)
      if (img_lists.children.length <= 2) {
        container.style.marginLeft = "10px";
      }
      container.appendChild(image);
      img_lists.insertBefore(container, btn);
    }
    if (img_lists.getElementsByTagName("*")) {
      const txt: any = document.getElementById("txt_drag_and_drop");
      txt.style.display = "none";
      upload_img_block.style.justifyContent = "flex-start";
    }
    post_img_block.style.justifyContent = "flex-start";
    post_img_block.style.alignItems = "flex-start";
  }

  // addImageCaption() {
  //   const img_uploaded_result = document.getElementById("img_uploaded_result");
  //   const div = img_uploaded_result?.getElementsByTagName("div");
  //   const divLength: number = div?.length !== undefined ? div.length : 0;
  //   for(let i=0; i<divLength; i++) {
  //     if (div !== undefined) {
  //       div[i].addEventListener("click", () =>{
  //         const post_img_block = document.getElementById("post_img_block");
  //         const post_img_description_block = document.createElement("div");
  //         const img_view = document.createElement("div");
  //         const img_caption_block = document.createElement("div");

  //       })
  //     }
  //   }
  // }


  onDrop(event: any) {
    event.preventDefault();      
    console.log("image drop");
    const dt = event.dataTransfer;
    const files:File[] = dt.files;
    this.uploadImg(files);
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

  onImageUpload(event: any) {
    const files:File[] = event.target.files;
    this.uploadImg(files);
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
