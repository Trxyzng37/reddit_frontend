import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  getCurrentDateTime(): string {
    const dateTime: Date = new Date();
    dateTime.setMilliseconds(0);
    return dateTime.toISOString();
  }
}
