import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { configuracionPage } from './configuracion';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [configuracionPage],
  imports: [IonicPageModule.forChild(configuracionPage),TranslateModule],
})
export class ConfiguracionPageModule { }