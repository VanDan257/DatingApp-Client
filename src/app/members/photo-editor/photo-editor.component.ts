import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../../_model/member';
import { Photo } from '../../_model/photo';
import { User } from '../../_model/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;
  public uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
      },
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      // method: 'post',
      // itemAlias: 'attachment',
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log('>>> item: ', item);
      console.log('>>> response: ', response);
      console.log('>>> status: ', status);
      console.log('>>> headers: ', headers);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        console.log('>>> response: ', response);
        console.log('>>> status: ', status);
        console.log('>>> headers: ', headers);
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
    };
  }
}
