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
  public search_value: string = 'search_value';
  public search_result: string[] = [];
  private arr: string[] = ["aaa", "Abc", "bcd", "def", "art", "avail", "aeo", "jil", "ghi abc", "valve", "ass", "anomoly", "dawn", "browser", "ack", "saw", "Ask", "Aww", "Ass"];

  ngOnInit() {
    this.storageService.setItem("isSignIn", "true");
    this.isSignIn = this.storageService.getItem("isSignIn") === "true" ? true:false;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onClick() {
    this.isSignIn = !this.isSignIn;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onChange(value: string) {
    this.search_value = value;
    if (value === '')
      this.search_result = [];
    else
      this.search_result = this.arr.filter(a => a.startsWith(value));
    this.search_result = this.search_result.slice(0, 5);
  }
}
