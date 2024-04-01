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

  // ngAfterViewChecked() {
  //   let a = document.querySelector('button.ql-bold')!.setAttribute('title', 'Bold') as any;
    
  // }

  public CreatePostForm: any = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')
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
      console.log("pcommunity search meneu close")
  }

  SignInFormSubmit() {
    console.log("title: " + this.CreatePostForm.value.title)
    console.log("content: " + this.CreatePostForm.value.content)
  }

  public characterCount: number = 0;

  onTextAreaInput() {
    const textareaEle: any = document.getElementById('input_post_title');
      textareaEle.value = textareaEle.value.replace(/(\r\n|\n|\r)/gm, "");
      textareaEle.style.height = 'auto';
      textareaEle.style.height = `${textareaEle.scrollHeight}px`;
      this.characterCount = textareaEle.value.length;
      // console.log(textareaEle.value.length)
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
