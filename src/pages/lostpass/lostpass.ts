import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { MenuController} from 'ionic-angular';
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

  constructor(public menuCtrl: MenuController,public fallo: Funciones_utilesProvider,public alertCtrl: AlertController,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
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

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(false, 'menu1');
  }

  ionViewWillLeave() {
    // Don't forget to return the swipe to normal, otherwise 
    // the rest of the pages won't be able to swipe to open menu
    this.menuCtrl.swipeEnable(true);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
   }
  async recuperar(user: User){
    try{
      const result = await this.ofAuth.auth.sendPasswordResetEmail(user.email);
      console.log(result);
      this.doAlert();
      
    }catch(e){
      let error: string = e.code;
      if (error == "auth/invalid-email") {
        this.fallo.aviso_error(this.translateService.instant("FORMATO_MAIL"));
      } else if (error == "auth/user-not-found") {
        this.fallo.aviso_error(this.translateService.instant("EMAIL_NOVALIDO"));
      } else if (error == "auth/wrong-password") {
        this.fallo.aviso_error(this.translateService.instant("PASSWORD_NO"));
      } else if (error == "auth/argument-error") {
        this.fallo.aviso_error(this.translateService.instant("EMPTLY_FIELDS"));
      } else if (error == "auth/email-already-in-use") {
        this.fallo.aviso_error(this.translateService.instant("EMAIL_NO"));
      }
    

    }
    
  }

}
