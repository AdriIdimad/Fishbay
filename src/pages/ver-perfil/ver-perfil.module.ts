import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerPerfilPage } from './ver-perfil';
import {SwingModule} from 'angular2-swing';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [VerPerfilPage],
  imports: [IonicPageModule.forChild(VerPerfilPage),SwingModule,Ionic2RatingModule]
})
export class VerPerfilPageModule { 

}  