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
  private arr: string[] = ["aaa", "Abc", "bcd", "def", "jil", "ghi abc"];

  ngOnInit() {
    this.storageService.setItem("isSignIn", "true");
    this.isSignIn = this.storageService.getItem("isSignIn") === "true" ? true:false;
    console.log(this.storageService.getItem("isSignIn"))
  }

  onClick() {
    this.isSignIn = !this.isSignIn;
    console.log(this.storageService.getItem("isSignIn"))
  }



  // Filter(value: string): string[] {
  //   const result: string[] = [];
  //   for (let i=0; i<value.length; i++) {
  //     const search_char = value[i];
  //     if (this.arr[i].toLowerCase() == search_char) {
  //       result.push(this.arr[i]);
  //     }
  //   }
  //   return result;
  // }

  onChange(value: string) {
    this.search_value = value;
    console.log(this.search_value);
    alert(this.arr.filter(a => a.toLowerCase().includes(value)));
    // console.log(this.arr.filter(this.Filter))
  }
}
