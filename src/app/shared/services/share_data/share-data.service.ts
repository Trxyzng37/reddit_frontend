import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { Communities } from '../../pojo/pojo/communities';
import { CommentInfo } from 'src/app/view-detail-post/view-detail-post/pojo/comment';
import { ChangedPost } from './changed-post';
import { FirstLast } from './first-last';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private detail_posts = new BehaviorSubject<DetailPost[]>([]);
  detail_posts$ = this.detail_posts.asObservable();
  setDetailPosts(detailPosts: DetailPost[]) {
    this.detail_posts.next(detailPosts);
  }

  private post_id_arr = new BehaviorSubject<number[]>([]);
  post_id_arr$ = this.post_id_arr.asObservable();
  setPostIdArr(post_id_arr: number[]) {
    this.post_id_arr.next(post_id_arr);
  }

  private cur_view_post_id = new BehaviorSubject<number>(0);
  cur_view_post_id$ = this.cur_view_post_id.asObservable();
  setCurViewPostId(cur_view_post_id: number) {
    this.cur_view_post_id.next(cur_view_post_id);
  }

  //home
  private home_post_id_arr = new BehaviorSubject<number[]>([]);
  home_post_id_arr$ = this.home_post_id_arr.asObservable();
  setHomePostIdArr(home_post_id_arr: number[]) {
    this.home_post_id_arr.next(home_post_id_arr);
  }

  private home_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  home_detail_posts$ = this.home_detail_posts.asObservable();
  setHomeDetailPosts(detailPosts: DetailPost[]) {
    this.home_detail_posts.next(detailPosts);
  }

  private cur_home_view_post_id = new BehaviorSubject<number>(0);
  cur_home_view_post_id$ = this.cur_home_view_post_id.asObservable();
  setHomeCurViewPostId(cur_home_view_post_id: number) {
    this.cur_home_view_post_id.next(cur_home_view_post_id);
  }

  private home_search_option = new BehaviorSubject<string>("hot");
  home_search_option$ = this.home_search_option.asObservable();
  setHomeSearchOption(home_search_option: string) {
    this.home_search_option.next(home_search_option);
  }

  //popular
  private popular_post_id_arr = new BehaviorSubject<number[]>([]);
  popular_post_id_arr$ = this.popular_post_id_arr.asObservable();
  setPopularPostIdArr(popular_post_id_arr: number[]) {
    this.popular_post_id_arr.next(popular_post_id_arr);
  }

  private popular_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  popular_detail_posts$ = this.popular_detail_posts.asObservable();
  setPopularDetailPosts(detailPosts: DetailPost[]) {
    this.popular_detail_posts.next(detailPosts);
  }

  private cur_popular_view_post_id = new BehaviorSubject<number>(0);
  cur_popular_view_post_id$ = this.cur_popular_view_post_id.asObservable();
  setPopularCurViewPostId(cur_popular_view_post_id: number) {
    this.cur_popular_view_post_id.next(cur_popular_view_post_id);
  }

  private popular_search_option = new BehaviorSubject<string>("hot");
  popular_search_option$ = this.popular_search_option.asObservable();
  setPopularSearchOption(popular_search_option: string) {
    this.popular_search_option.next(popular_search_option);
  }


  //community
  private community_post_id_arr = new BehaviorSubject<number[]>([]);
  community_post_id_arr$ = this.community_post_id_arr.asObservable();
  setCommunityPostIdArr(community_post_id_arr: number[]) {
    this.community_post_id_arr.next(community_post_id_arr);
  }

  private community_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  community_detail_posts$ = this.community_detail_posts.asObservable();
  setCommunityDetailPosts(detailPosts: DetailPost[]) {
    this.community_detail_posts.next(detailPosts);
  }

  private cur_community_view_post_id = new BehaviorSubject<number>(0);
  cur_community_view_post_id$ = this.cur_community_view_post_id.asObservable();
  setCommunityCurViewPostId(cur_community_view_post_id: number) {
    this.cur_community_view_post_id.next(cur_community_view_post_id);
  }

  private community_search_option = new BehaviorSubject<string>("hot");
  community_search_option$ = this.community_search_option.asObservable();
  setCommunitySearchOption(community_search_option: string) {
    this.community_search_option.next(community_search_option);
  }

  setJoinCommunityOfDetailPosts(community_id: number, join: number|null) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.community_id == community_id) {
        post.join = join;
      }
    }
    this.setDetailPosts(detail_posts)
  }

  setVoteOfDetailPosts(post_id: number, vote: number) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.post_id == post_id) {
        post.vote = vote;
      }
    }
    this.setDetailPosts(detail_posts)
  }
  
  setVoteTypeOfDetailPosts(post_id: number, voteType: string|null) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.post_id == post_id) {
        post.voteType = voteType;
      }
    }
    this.setDetailPosts(detail_posts)
  }

  setAllowOfDetailPosts(post_id: number, allow: number) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.post_id == post_id) {
        post.allow = allow;
      }
    }
    this.setDetailPosts(detail_posts)
  }

  setDeleteOfDetailPosts(post_id: number, deleted: number) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.post_id == post_id) {
        post.deleted = deleted;
      }
    }
    this.setDetailPosts(detail_posts)
  }

  setSaveStatusOfDetailPosts(post_id: number, save: number|null) {
    let detail_posts = this.detail_posts.getValue();
    for(let post of detail_posts) {
      if(post.post_id == post_id) {
        post.save = save;
      }
    }
    this.setDetailPosts(detail_posts)
  }

  private subscribed_communities = new BehaviorSubject<Communities[]>([]);
  subscribed_communities$ = this.subscribed_communities.asObservable();
  setSubscribedCommunities(subscribed_communities: Communities[]) {
    this.subscribed_communities.next(subscribed_communities);
  }

  //user_saved
  private saved_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  saved_detail_posts$ = this.saved_detail_posts.asObservable();
  setSavedDetailPosts(detail_posts: DetailPost[]) {
    this.saved_detail_posts.next(detail_posts);
  }

  private saved_post_id_arr = new BehaviorSubject<number[]>([]);
  saved_post_id_arr$ = this.saved_post_id_arr.asObservable();
  setSavedPostIds(post_id_arr: number[]) {
    this.saved_post_id_arr.next(post_id_arr);
  }

  private cur_saved_view_post_id = new BehaviorSubject<number>(0);
  cur_saved_view_post_id$ = this.cur_saved_view_post_id.asObservable();
  setSavedCurViewPostId(cur_saved_view_post_id: number) {
    this.cur_saved_view_post_id.next(cur_saved_view_post_id);
  }


  //posts_by_user
  private user_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  user_detail_posts$ = this.user_detail_posts.asObservable();
  setUserDetailPosts(detail_posts: DetailPost[]) {
    this.user_detail_posts.next(detail_posts);
  }

  private user_post_id_arr = new BehaviorSubject<number[]>([]);
  user_post_id_arr$ = this.user_post_id_arr.asObservable();
  setUserPostIds(post_id_arr: number[]) {
    this.user_post_id_arr.next(post_id_arr);
  }

  private user_post_search_option = new BehaviorSubject<string>("new");
  user_post_search_option$ = this.user_post_search_option.asObservable();
  setUserPostSearchOption(user_post_search_option: string) {
    this.user_post_search_option.next(user_post_search_option);
  }

  private cur_user_post_view_post_id = new BehaviorSubject<number>(0);
  cur_user_post_view_post_id$ = this.cur_user_post_view_post_id.asObservable();
  setUserPostCurViewPostId(cur_user_post_view_post_id: number) {
    this.cur_user_post_view_post_id.next(cur_user_post_view_post_id);
  }


  //wait_for_approve of user
  private wait_for_approve_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  wait_for_approve_detail_posts$ = this.wait_for_approve_detail_posts.asObservable();
  setWaitForApproveDetailPosts(detail_posts: DetailPost[]) {
    this.wait_for_approve_detail_posts.next(detail_posts);
  }

  private wait_approve_post_id_arr = new BehaviorSubject<number[]>([]);
  wait_approve_post_id_arr$ = this.wait_approve_post_id_arr.asObservable();
  setWaitApprovePostIds(post_id_arr: number[]) {
    this.wait_approve_post_id_arr.next(post_id_arr);
  }

  private cur_wait_approve_view_post_id = new BehaviorSubject<number>(0);
  cur_wait_approve_view_post_id$ = this.cur_wait_approve_view_post_id.asObservable();
  setWaitForApproveCurViewPostId(cur_wait_approve_view_post_id: number) {
    this.cur_wait_approve_view_post_id.next(cur_wait_approve_view_post_id);
  }

  //search posts
  private search_post_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  search_post_detail_posts$ = this.search_post_detail_posts.asObservable();
  setSearchPostsDetailPosts(detail_posts: DetailPost[]) {
    this.search_post_detail_posts.next(detail_posts);
  }

  private search_post_post_id_arr = new BehaviorSubject<number[]>([]);
  search_post_post_id_arr$ = this.search_post_post_id_arr.asObservable();
  setSearchPostsPostIds(post_id_arr: number[]) {
    this.search_post_post_id_arr.next(post_id_arr);
  }

  private search_post_post_search_option = new BehaviorSubject<string>("new");
  search_post_post_search_option$ = this.search_post_post_search_option.asObservable();
  setSearchPostsSearchOption(search_post_post_search_option: string) {
    this.search_post_post_search_option.next(search_post_post_search_option);
  }

  private cur_search_post_view_post_id = new BehaviorSubject<number>(0);
  cur_search_post_view_post_id$ = this.cur_search_post_view_post_id.asObservable();
  setSearchPostsCurViewPostId(cur_search_post_view_post_id: number) {
    this.cur_search_post_view_post_id.next(cur_search_post_view_post_id);
  }

  //comment
  private comments_infos = new BehaviorSubject<CommentInfo[]>([]);
  comments_infos$ = this.comments_infos.asObservable();
  setCommentsInfos(comments_infos: CommentInfo[]) {
    this.comments_infos.next(comments_infos);
  }

  private comment_id_arr = new BehaviorSubject<number[]>([]);
  comment_id_arr$ = this.comment_id_arr.asObservable();
  setCommentIds(comment_id_arr: number[]) {
    this.comment_id_arr.next(comment_id_arr);
  }

  private comment_search_option = new BehaviorSubject<string>("new");
  comment_search_option$ = this.comment_search_option.asObservable();
  setCommentSearchOption(comment_search_option: string) {
    this.comment_search_option.next(comment_search_option);
  }

  private cur_comment_view_id = new BehaviorSubject<number>(0);
  cur_comment_view_id$ = this.cur_comment_view_id.asObservable();
  setCommentCurViewId(cur_comment_view_id: number) {
    this.cur_comment_view_id.next(cur_comment_view_id);
  }


  //mod review
  private review_post_id_arr = new BehaviorSubject<number[]>([]);
  review_post_id_arr$ = this.review_post_id_arr.asObservable();
  setReviewPostIdArr(review_post_id_arr: number[]) {
    this.review_post_id_arr.next(review_post_id_arr);
  }

  private review_detail_posts = new BehaviorSubject<DetailPost[]>([]);
  review_detail_posts$ = this.review_detail_posts.asObservable();
  setReviewDetailPosts(detailPosts: DetailPost[]) {
    this.review_detail_posts.next(detailPosts);
  }

  private cur_review_view_post_id = new BehaviorSubject<number>(0);
  cur_review_view_post_id$ = this.cur_review_view_post_id.asObservable();
  setReviewCurViewPostId(cur_review_view_post_id: number) {
    this.cur_review_view_post_id.next(cur_review_view_post_id);
  }

  private review_search_option = new BehaviorSubject<string>("hot");
  review_search_option$ = this.review_search_option.asObservable();
  setReviewSearchOption(review_search_option: string) {
    this.review_search_option.next(review_search_option);
  }


  //user profile page option
  private profile_option = new BehaviorSubject<string>("posts");
  profile_option$ = this.profile_option.asObservable();
  setProfileOption(profile_option: string) {
    this.profile_option.next(profile_option);
  }


  //mod page option
  private mod_option = new BehaviorSubject<string>("review");
  mod_option$ = this.mod_option.asObservable();
  setModOption(mod_option: string) {
    this.mod_option.next(mod_option);
  }


  //mod page view detail post_id
  // private mod_post_id = new BehaviorSubject<number>(0);
  // mod_post_id$ = this.mod_post_id.asObservable();
  // setModPostId(mod_post_id: number) {
  //   this.mod_post_id.next(mod_post_id);
  // }  

  private mod_detail_post = new BehaviorSubject<DetailPost>(new DetailPost());
  mod_detail_post$ = this.mod_detail_post.asObservable();
  setModDetailPost(mod_detail_post: DetailPost) {
    this.mod_detail_post.next(mod_detail_post);
  }
  
  private changed_post = new BehaviorSubject<ChangedPost>(new ChangedPost(0,0,0,"",""));
  changed_post$ = this.changed_post.asObservable();
  setChangedPost(changed_post: ChangedPost) {
    console.log(changed_post);
    this.changed_post.next(changed_post);
  }

  private mod_selected_post_id = new BehaviorSubject<number>(0);
  mod_selected_post_id$ = this.mod_selected_post_id.asObservable();
  setModSelectedPostId(mod_selected_post_id: number) {
    this.mod_selected_post_id.next(mod_selected_post_id);
  }

  private first_last = new BehaviorSubject<FirstLast>(new FirstLast(0,0));
  first_last$ = this.first_last.asObservable();
  setFirstLast(first_last: FirstLast) {
    this.first_last.next(first_last);
  }
}
