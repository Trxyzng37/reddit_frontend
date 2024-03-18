import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html',
  styleUrl: './post-link.component.scss'
})
export class PostLinkComponent {
  constructor (
    private router: Router
  ) {}

  @Input() test_string: number = 0;


  on_click() {
    this.router.navigate(["id/" + this.test_string]);
  }
}
