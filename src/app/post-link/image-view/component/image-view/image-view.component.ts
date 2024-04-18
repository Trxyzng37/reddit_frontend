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
  @Input({ required: true }) content!: string;
  public arr!: Img[];

  ngOnInit() {
    this.arr = JSON.parse(this.content);
    console.log(this.arr)
      for(let img of this.arr) {
        // console.log("img: " + img.data)
        let imageItem: ImageItem = new ImageItem({src: img.data, thumb: img.data});
        // console.log("imageItem: "+imageItem.data.src);
          console.log(typeof imageItem)
        // this.images.push(imageItem);
      }
    console.log(this.images)
  }
}
