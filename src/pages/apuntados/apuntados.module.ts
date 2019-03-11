import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApuntadosPage } from './apuntados';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ApuntadosPage],
  imports: [IonicPageModule.forChild(ApuntadosPage),TranslateModule],
})
export class BloqueadosPageModule { }