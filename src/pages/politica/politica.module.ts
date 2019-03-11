import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoliticaPage } from './politica';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [PoliticaPage],
  imports: [IonicPageModule.forChild(PoliticaPage),TranslateModule],
})
export class PoliticaPageModule { }