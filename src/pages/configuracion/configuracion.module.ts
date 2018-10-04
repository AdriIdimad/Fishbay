import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { configuracionPage } from './configuracion';
@NgModule({
  declarations: [configuracionPage],
  imports: [IonicPageModule.forChild(configuracionPage)],
})
export class ConfiguracionPageModule { }