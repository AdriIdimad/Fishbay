import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CntPage } from './cnt';
import { NgCalendarModule  } from 'ionic2-calendar';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [CntPage],
  imports: [IonicPageModule.forChild(CntPage),NgCalendarModule,TranslateModule],
})
export class CntPageModule { }