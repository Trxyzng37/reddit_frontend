import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setItem(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  public getItem(name: string): string {
    return localStorage.getItem(name) as string || "";
  }

  public removeItem(name: string): void {
    localStorage.removeItem(name);
  }
}
