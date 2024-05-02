import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Img } from 'src/app/create-post/pojo/img';

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

  ngOnChanges () {
    let caption = (<HTMLInputElement>document.getElementById("txt_caption"));
    console.log(this.img.caption)
    caption.value = this.img.caption;
    caption.value = caption.value.replace(/\r?\n|\r/g, "");
    caption.style.height = 'auto';
    caption.style.height = `${caption.scrollHeight}px`;
    this.characterCount = caption.value.length;
  }

  public characterCount: number = 0;

  onTextAreaInput(event: any) {
    const textareaEle: any = event.target;
    textareaEle.value = textareaEle.value.replace(/\r?\n|\r/g, "");
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
    console.log(this.img);
    this.imgOutput.emit(this.img);
  }

  changeLink() {
    this.img.link = this.form.value.link;
    this.imgOutput.emit(this.img);
  }

}
