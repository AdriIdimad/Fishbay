import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotarPage } from './votar';
import {SwingModule} from 'angular2-swing';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [VotarPage],
  imports: [IonicPageModule.forChild(VotarPage),SwingModule,Ionic2RatingModule]
})
export class VotarPageModule { 

} 