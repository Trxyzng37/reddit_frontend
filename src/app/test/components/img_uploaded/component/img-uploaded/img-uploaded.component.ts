import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-uploaded',
  templateUrl: './img-uploaded.component.html',
  styleUrl: './img-uploaded.component.scss'
})
export class ImgUploadedComponent {
  public constructor(

  ) {}

  @Input() img: string = "";

  ngOnInit() {

  }

  public isImageClicked: boolean = false;

  clickImage() {
    this.isImageClicked = !this.isImageClicked;
  }
}
