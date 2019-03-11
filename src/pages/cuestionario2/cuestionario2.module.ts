import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cuestionario2Page } from './cuestionario2';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [Cuestionario2Page],
  imports: [IonicPageModule.forChild(Cuestionario2Page), TranslateModule],
})
export class Cuestionario2PageModule { }