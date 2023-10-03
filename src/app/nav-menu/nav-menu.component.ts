import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../_model/user';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  model: any = {};
    

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl('/members'),
      error: error => this.toastr.error(error.error),
    })
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
