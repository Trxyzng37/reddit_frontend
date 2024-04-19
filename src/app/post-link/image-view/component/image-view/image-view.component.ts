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
  public images: GalleryItem[] = [];
  @Input() content: string = "";
  public isReviewed: boolean = true;
  public arr!: Img[];

  ngOnInit() {
    this.arr = JSON.parse(this.content);
      for(let img of this.arr) {
        let imageItem: ImageItem = new ImageItem({src: img.data, thumb: img.data});
        this.images.push(imageItem);
      }
    console.log(this.images)
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
      console.log("Index: "+this.index);
    }
    else if(this.index > 1) {
      this.index -= 1;
      this.leftAllowed = true;
      this.rightAllowed = true;
      console.log("Index: "+this.index)
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
      console.log("Index: "+this.index)
    }
    else if(this.index < this.arr.length - 2) {
      this.index += 1;
      this.rightAllowed = true;
      this.leftAllowed = true;
      console.log("Index: "+this.index)
    }
    else {
      this.rightAllowed = false;
      this.leftAllowed = true;
    }
  }

  // btnDotClick(event: Event, index: number) {
  //   event.stopPropagation();
  //   this.index = index;
  //   if (this.index === 0) {
  //     this.leftAllowed = false;
  //     this.rightAllowed = true;
  //   }
  //   else if (this.index === this.arr.length-1) {
  //     this.leftAllowed = true;
  //     this.rightAllowed = false;
  //   }
  //   else {
  //     this.leftAllowed = true;
  //     this.rightAllowed = true;
  //   }
  // }
}
