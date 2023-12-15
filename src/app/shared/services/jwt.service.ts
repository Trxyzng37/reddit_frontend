import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Store jwt token
export class JwtService {
  
  private token: string;
  
  constructor() { 
    this.token = "";
  };

  public set_token(token: string) {
    this.token = token;
  }

  public get_token(): string{
      return this.token;
  }
}
