import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GetOpenGraphService } from '../../service/getOpenGraph/get-open-graph.service';
import { OpenGraphResponse } from '../../pojo/open-graph-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { parseFromDocument } from 'parse-open-graph';
@Component({
  selector: 'app-link-view',
  templateUrl: './link-view.component.html',
  styleUrl: './link-view.component.scss'
})
export class LinkViewComponent {

  public constructor(
  ) {}

  @Input() title: string = "";
  @Input() content: string = "";
  
  public data!: OpenGraphResponse;
  public link_domain: string = "";

  isViewPostPage = window.location.href.match("/post/");
  
  ngOnInit() {
    this.data = JSON.parse(this.content);
    let regex = /^(https?:\/\/[^\/]+)/;
    const found = this.data.link.match(regex);
    if(found != null && found != undefined) {
      this.link_domain = found[0];
    }
  }

  preventClick(event: Event) {
    event.stopPropagation();
  }

  openLink() {
    window.open(this.data.link, "_blank");
  }
}


