import { Component, OnInit } from '@angular/core';
import {Observable, take} from 'rxjs';
import { Member } from '../../_model/member';
import { MembersService } from '../../_services/members.service';
import { Pagination } from 'src/app/_model/pagination';
import {UserParams} from "../../_model/userParams";
import {User} from "../../_model/user";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  public pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Female'}];

  constructor(private memberService: MembersService) {

    this.userParams = this.memberService.getUserParams();

    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //     next: user =>{
    //       if(user){
    //         this.userParams = new UserParams(user);
    //         this.user = user;
    //       }
    //     }
    // })
  }

  async ngOnInit(): Promise<void> {
    this.loadMembers();
  }

  loadMembers() {
    if(this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }

  }

  resetFilters(){
      this.userParams = this.memberService.resetUserParams();
      this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
