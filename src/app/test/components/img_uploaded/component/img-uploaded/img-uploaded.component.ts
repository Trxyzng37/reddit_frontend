import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-img-uploaded',
  templateUrl: './img-uploaded.component.html',
  styleUrl: './img-uploaded.component.scss'
})
export class ImgUploadedComponent {
  public constructor(

  ) {}

  @Input() img: string = "";
  @Input() id: number = 0;
  @Input() selected_id: number = 0;

  @Output() selectImgOutput = new EventEmitter<number>;
  @Output() deleteImgOutput = new EventEmitter<number>;

  ngOnInit() {

  }


  selectImg() {
    this.selectImgOutput.emit(this.id);
    this.selected_id = this.id;
    console.log("selected id in parent: " + this.selected_id);
  }

  deleteImage() {
    console.log("Delete index: " + this.id);
    this.deleteImgOutput.emit(this.id);
  }
}
