import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Store jwt token
export class JwtService {
  
  private token: string|null;
  
  constructor() { 
    this.token = '';
  };

  public set_token(token: string|null) {
    this.token = token;
  }

  public get_token(): string{
    if (this.token != null && this.token != ''){
      return this.token;
    }
    else 
      return "";
  }
}
