import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  public recent_status: string = 'down';
  public favorite_status: string = 'down';

  change_recent_status() {
    this.recent_status = this.recent_status === 'up' ? 'down':'up';
    console.log(this.recent_status)
  }

  change_favorite_status() {
    this.favorite_status = this.favorite_status === 'up' ? 'down':'up';
    console.log(this.favorite_status)
  }
}
