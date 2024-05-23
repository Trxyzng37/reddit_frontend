import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetService } from 'src/app/shared/services/get/get.service';
import { Communities } from '../../pojo/pojo/communities';
import { PostService } from '../post/post.service';
import { JoinCommunityRequest } from './pojo/join-community-request';
import { JoinCommunityResponse } from './pojo/join-community-response';
import { DefaultResponse } from '../../pojo/default-response';
import { DeleteCommunityRequest } from './pojo/delete-community-request';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  constructor(
    private getService: GetService,
    private postService: PostService
  ) { }

  private endpoint: string = "/find-community"

  public searchCommunities(name: string): Observable<Communities[]> {
    const parameter: string ="name=" + name; 
    const endpointWithParameter: string = this.endpoint + "?" + parameter;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, false);
  }

  public getCommunityInfoById(id: string): Observable<Communities> {
    const parameter: string ="id=" + id; 
    const endpointWithParameter: string = "/get-community-info" + "?" + parameter;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, false);
  }

  public getCommunityInfoByUid(uid: number): Observable<Communities[]> {
    const parameter: string ="uid=" + uid; 
    const endpointWithParameter: string = "/get-community-info-by-uid" + "?" + parameter;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, false);
  }

  public getSubscribedCommunitiesByUid(uid: number): Observable<Communities[]> {
    const parameter: string ="uid=" + uid; 
    const endpointWithParameter: string = "/get-subscribed-communities" + "?" + parameter;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, false);
  }

  public joinCommunity(uid: number, community_id: number, subscribed: number): Observable<JoinCommunityResponse> {
    const endpoint: string = "/join-community";
    const body = JSON.stringify(new JoinCommunityRequest(uid, community_id, subscribed));
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(endpoint, header, body, false);
  }

  public checkJoinCommunityStatus(uid: number, community_id: number): Observable<JoinCommunityResponse> {
    const endpointWithParameter: string = "/check-join-community" + "?" + "uid=" + uid + "&" + "cid=" + community_id;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, false);
  }

  public deleteCommunity(community_id: number, uid: number, deleted: number): Observable<DefaultResponse> {
    const endpoint: string = "/delete-community";
    const body = JSON.stringify(new DeleteCommunityRequest(community_id, uid, deleted));
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(endpoint, header, body, false);
  }
}
