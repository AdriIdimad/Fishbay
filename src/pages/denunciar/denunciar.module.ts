import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DenunciarPage } from './denunciar';
import { SwingModule } from 'angular2-swing';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DenunciarPage],
  imports: [IonicPageModule.forChild(DenunciarPage), SwingModule, Ionic2RatingModule, TranslateModule]
})
export class DenunciarPageModule {

} 