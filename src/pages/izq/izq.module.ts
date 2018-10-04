import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IzqPage } from './izq';
import {SwingModule} from 'angular2-swing';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [IzqPage],
  imports: [IonicPageModule.forChild(IzqPage),SwingModule,Ionic2RatingModule,TranslateModule]
})
export class IzqPageModule { 

}  