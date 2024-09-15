import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  getCurrentDateTime(): Date {
    const dateTime: Date = new Date();
    dateTime.setMilliseconds(0);
    return dateTime;
  }

  private findDateComponentFromDateString(date: string): number[] {
    const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    const found = date.match(regex);
    let createdAtYear: number;
    let createdAtMonth: number;
    let createdAtDay: number;
    let createdAtHour: number;
    let createdAtMinute: number;
    let createdAtSecond: number;
    if(found) {
      createdAtYear = parseInt(found[1]);
      createdAtMonth = parseInt(found[2]);
      createdAtDay = parseInt(found[3]);
      createdAtHour = parseInt(found[4]);
      createdAtMinute = parseInt(found[5]);
      createdAtSecond = parseInt(found[6]);
      return [createdAtYear, createdAtMonth, createdAtDay, createdAtHour, createdAtMinute, createdAtSecond];
    }
    return [];
  }

  getTimeByCompareCreatedAtAndCurrentDate(created_at: string): string {
    const currentDate = new Date();
    const createdAtDate = new Date(created_at);
    const timeDifferenceMs = currentDate.getTime() - createdAtDate.getTime();
    // Convert the time difference into different time units
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day; // Approximation
    const year = 12 * month; // Approximation
    let shownDate: string = "";
    if (timeDifferenceMs >= year) {
      const years = Math.floor(timeDifferenceMs / year);
      shownDate = `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceMs >= month) {
      const months = Math.floor(timeDifferenceMs / month);
      shownDate = `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceMs >= day) {
      const days = Math.floor(timeDifferenceMs / day);
      shownDate = `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceMs >= hour) {
      const hours = Math.floor(timeDifferenceMs / hour);
      shownDate = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceMs >= minute) {
      const minutes = Math.floor(timeDifferenceMs / minute);
      shownDate = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      shownDate = "1 minute ago";
    }
    return shownDate;
  }

  getStringRepresentDateTime(created_at: string): string {
    const date = new Date(created_at);
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];

    return `${month}, ${day}, ${year}`;
  }

  CompareDateTime(date1: string, date2: string): boolean {
    const datetime1 = new Date(date1);
    const datetime2 = new Date(date2);
    const differenceInMilliseconds = Math.abs(datetime1.getTime() - datetime2.getTime());
    const differenceInMinutes = differenceInMilliseconds / (1000 * 30);
    return differenceInMinutes > 1;
  }
}
