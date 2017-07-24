import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the LostpassPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lostpass',
  templateUrl: 'lostpass.html',
})
export class LostpassPage {
  [x: string]: any;

  user = {} as User;

  constructor(public fallo: Funciones_utilesProvider,public alertCtrl: AlertController,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }
  
  doAlert() {
    let alert = this.alertCtrl.create({
      title: '🚀 Correo enviado 🚀',
      message: 'Siga las instrucciones enviadas para cambiar su contraseña',
      buttons: ['Vale']
    });
    alert.present()
    this.navCtrl.push('LoginPage');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LostpassPage');
  }

  async recuperar(user: User){
    try{
      const result = await this.ofAuth.auth.sendPasswordResetEmail(user.email);
      console.log(result);
      this.doAlert();
      
    }catch(e){
      let error: string= e.code;
      if(error == "auth/invalid-email"){
        this.fallo.aviso_error("El formato del email es incorrecto.");

      }else if(error= "auth/user-not-found"){
        this.fallo.aviso_error("El email introducido no corresponde a ningún usuario.");
        

      }
    

    }
    
  }

}
