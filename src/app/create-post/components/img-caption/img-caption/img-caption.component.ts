import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Img } from 'src/app/create-post/img';

@Component({
  selector: 'app-img-caption',
  templateUrl: './img-caption.component.html',
  styleUrl: './img-caption.component.scss'
})
export class ImgCaptionComponent {

  @Input() img: Img = new Img("");
  @Output() imgOutput = new EventEmitter<Img>;

  public form: any = new FormGroup({
    caption: new FormControl(''),
    link: new FormControl(''),
  })



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
    this.changeCaption();
  }

  changeCaption() {
    this.img.caption = this.form.value.caption;
    console.log("on input change child value: ");
    console.log(this.img);
    this.imgOutput.emit(this.img);
  }

  changeLink() {
    this.img.link = this.form.value.link;
    this.imgOutput.emit(this.img);
  }

}
