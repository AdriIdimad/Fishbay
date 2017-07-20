import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CntPage } from './cnt';
@NgModule({
  declarations: [CntPage],
  imports: [IonicPageModule.forChild(CntPage)],
})
export class CntPageModule { }