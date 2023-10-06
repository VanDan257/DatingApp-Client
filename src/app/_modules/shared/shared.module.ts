import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    NgxSpinnerModule.forRoot({
      type: 'square-jelly-box',
    }),
    FileUploadModule,
  ],
  exports: [BsDropdownModule, ToastrModule, TabsModule, NgxSpinnerModule],
})
export class SharedModule {}
