import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventoPage } from './evento';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [EventoPage],
  imports: [IonicPageModule.forChild(EventoPage),Ionic2RatingModule],
})
export class EventoPageModule { }