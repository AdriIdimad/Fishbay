import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventoPage } from './evento';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [EventoPage],
  imports: [IonicPageModule.forChild(EventoPage),Ionic2RatingModule,TranslateModule],
})
export class EventoPageModule { }