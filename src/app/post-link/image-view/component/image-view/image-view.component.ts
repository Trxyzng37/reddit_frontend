import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Img } from 'src/app/create-post/pojo/img';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.scss'
})
export class ImageViewComponent {
  @Input() content: string = "";
  public arr!: Img[];
  public isZoom: boolean = false;
  public isCaptionOn: boolean = true;

  ngOnInit() {
    this.arr = JSON.parse(this.content);
  }

  index: number = 0;
  leftAllowed: boolean = false;
  rightAllowed: boolean = true;
  left(event: Event) {
    event.stopPropagation();
    if(this.index === 1) {
      this.index -= 1;
      this.leftAllowed = false;
      this.rightAllowed = true;
    }
    else if(this.index > 1) {
      this.index -= 1;
      this.leftAllowed = true;
      this.rightAllowed = true;
    }
    else {
      this.leftAllowed = false;
      this.rightAllowed = true;
    }
  }

  right(event:Event) {
    event.stopPropagation();
    if(this.index === this.arr.length - 2) {
      this.index += 1;
      this.rightAllowed = false;
      this.leftAllowed = true;
    }
    else if(this.index < this.arr.length - 2) {
      this.index += 1;
      this.rightAllowed = true;
      this.leftAllowed = true;
    }
    else {
      this.rightAllowed = false;
      this.leftAllowed = true;
    }
  }

  preventClick(event: Event) {
    event.stopPropagation();
  }

  zoomImage(event: Event) {
    event.stopPropagation();
    this.isZoom = true;
  }

  closeImg(event: Event) {
    event.stopPropagation();
    this.isZoom = false;
    this.isCaptionOn = true;
  }

  showCaption(event: Event) {
    event.stopPropagation();
    this.isCaptionOn = !this.isCaptionOn;
  }
}
