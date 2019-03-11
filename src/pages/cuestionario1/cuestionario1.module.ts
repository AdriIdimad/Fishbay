import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cuestionario1Page } from './cuestionario1';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [Cuestionario1Page],
  imports: [IonicPageModule.forChild(Cuestionario1Page),TranslateModule],
})
export class Cuestionario1PageModule { }