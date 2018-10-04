import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CntPage } from './cnt';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [CntPage],
  imports: [IonicPageModule.forChild(CntPage),NgCalendarModule],
})
export class CntPageModule { }