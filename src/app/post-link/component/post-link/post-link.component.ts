import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GalleryItem } from 'ng-gallery';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html',
  styleUrl: './post-link.component.scss'
})
export class PostLinkComponent {
  constructor (
    private router: Router
  ) {}

  @Input() post_id: number = 0;
  @Input() type: string = "";
  @Input() communityName: string = "";
  @Input() userName: string = "";
  @Input() title: string = "";
  @Input() content: string = "";
  @Input() created_at: string = "";
  @Input() vote: number = 1;
  @Input() communityIcon: string = "";
  @Input() index: number = 0;
  @Input() arr_length: number = 0;

  @Output() event = new EventEmitter<GetPostResponse>();
    
  public images!: GalleryItem[];
  ngOnInit() {
    // if(this.images) {
    //   for(let img of this.content) {
    //     console.log("img: " + img.data)
    //     let imageItem: ImageItem = new ImageItem({src: img.data, thumb: img.data});
    //     this.images.push(imageItem);
    //   }
    }  

  on_click() {
    this.router.navigate(["/id/" + this.post_id]);
    // console.log(this.content)
  }

  onIntersection({ target, visible }: { target: Element; visible: boolean }) {
    // if (visible) {
    //   console.log("Post index: "+this.index);
    //   console.log("LENGTH: "+this.arr_length);
    //   console.log(this.index===this.arr_length-1)
    //   if(this.index == (this.arr_length-1)) {
    //     if(confirm("END OF PAGE. Want to add new post")) {
    //       // const o: GetPostResponse = new GetPostResponse(this.post_id+1, "new page"+1, "test"+1, this.created_at, this.vote+1, this.communityIcon);
    //       console.log("Add new post: ");
    //       // this.addNewPost(o);
    //     }
    //     else {
    //       console.log("No add post")
    //     }
    //   }
    // }
  }

  addNewPost(o: GetPostResponse) {
    this.event.emit(o);
  }
}
