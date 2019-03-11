import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AjustesPage } from './ajustes';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AjustesPage],
  imports: [IonicPageModule.forChild(AjustesPage),TranslateModule],
})
export class AjustesPageModule { }