import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostpassPage } from './lostpass';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [LostpassPage],
  imports: [IonicPageModule.forChild(LostpassPage),TranslateModule],
})
export class LostpassPageModule { }