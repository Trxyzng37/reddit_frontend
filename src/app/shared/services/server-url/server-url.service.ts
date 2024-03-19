import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServerUrlService {
  private url: string;
  
  constructor() { 
    this.url = `${environment.PROTOCOL}://${environment.IP_ADDRESS}:${environment.PORT}`;
  }

  getUrl(): string {
    return this.url;
  }

  createFullUrl(endpoint: string): string {
    return this.url + endpoint;
  }
}
