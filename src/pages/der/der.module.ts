import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DerPage } from './der';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from 'ion-datepicker';
@NgModule({
  declarations: [DerPage],
  imports: [IonicPageModule.forChild(DerPage),TranslateModule,DatePickerModule],
})
export class DerPageModule { }