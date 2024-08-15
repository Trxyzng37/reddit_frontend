import { Injectable } from '@angular/core';
import { JoinCommunity } from '../pojo/join-community';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';

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


  setVoteOfPostInStorage(post_id: number, vote: number) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.vote == vote) {
        post.vote = vote;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  setJoinCommunityOfPostInStorage(community_id: number, join: number|null) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.community_id == community_id) {
        post.join = join;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  setSaveStatusOfPostInStorage(post_id: number, save: number|null) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.post_id == post_id) {
        post.save = save;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  setVoteTypeOfPostInStorage(post_id: number, voteType: string|null) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.post_id == post_id) {
        post.voteType = voteType;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  setAllowOfPostInStorage(post_id: number, allow: number) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.post_id == post_id) {
        post.allow = allow;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  setDeleteOfPostInStorage(post_id: number, deleted: number) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    for(let post of post_arr) {
      if(post.post_id == post_id) {
        post.deleted = deleted;
      }
    }
    this.setItem("posts", JSON.stringify(post_arr));
  }

  removePostInStorage(post_id: number) {
    let post_arr: DetailPost[] = this.getItem("posts") == "" ? [] : JSON.parse(this.getItem("posts"));
    post_arr = post_arr.filter( post => {
      return post.post_id !== post_id;
    })
    this.setItem("posts", JSON.stringify(post_arr));
  }
}
