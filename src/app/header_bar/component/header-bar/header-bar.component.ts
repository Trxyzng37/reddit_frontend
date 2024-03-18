import { Component } from '@angular/core';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent {
  public constructor(
    private storageService: StorageService
  ) {}

  public isSignIn: boolean = false;

  ngOnInit() {
    this.storageService.setItem("isSignIn", "true");
    this.isSignIn = this.storageService.getItem("isSignIn") === "true" ? true:false;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onClick() {
    this.isSignIn = !this.isSignIn;
    console.log(this.storageService.getItem("isSignIn"))
  }
}
