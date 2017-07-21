import { User } from './../../models/user';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController,ToastController } from 'ionic-angular';
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

  user = {} as User;

  constructor(public alertCtrl: AlertController,private toastCtrl: ToastController,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
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

  avisoerror(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'});
      toast.present();
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
        this.avisoerror("El formato del email es incorrecto.");

      }else if(error= "auth/user-not-found"){
        this.avisoerror("El email introducido no corresponde a ningún usuario.");

      }
    

    }
    
  }

}
