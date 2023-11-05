import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from '../_model/member';
import { PaginatedResult } from '../_model/pagination';
import {UserParams} from "../_model/userParams";
import {User} from "../_model/user";

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params= params.append('minAge', userParams.minAge)
    params= params.append('maxAge', userParams.maxAge)
    params= params.append('gender', userParams.gender)
    params= params.append('orderBy', userParams.orderBy)

    return this.getPaginationedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams() {
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, ele) => arr.concat(ele.result), [])
      .find((member: Member) => member.userName === username);

    if(member) return of(member)

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo' + photoId);
  }

  private getPaginationedResult<T>(url: string, params: HttpParams){
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http
      .get<T>(url, { observe: 'response', params })
      .pipe(
        map((response) => {
          if (response.body) {
            paginatedResult.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }

  private  getPaginationHeaders(pageNumer: number, pageSize: number){
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumer)
    params = params.append('pageSize', pageSize)

    return params;
  }

}
