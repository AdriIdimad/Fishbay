import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the AvisoerrorProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Funciones_utilesProvider {

  constructor(public http: Http,private toastCtrl: ToastController) {
  }
  aviso_error(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'});
      toast.present();
  }

}
