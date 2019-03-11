import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilPage } from './perfil';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [PerfilPage],
  imports: [IonicPageModule.forChild(PerfilPage),TranslateModule,Ionic2RatingModule],
})
export class PerfilPageModule { }