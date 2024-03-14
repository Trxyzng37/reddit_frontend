import { Component } from '@angular/core';
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

  on_click() {
    this.router.navigate(["/home"]);
  }
}
