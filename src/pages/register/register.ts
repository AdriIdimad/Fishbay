import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { ToastController } from 'ionic-angular';

import { AngularFireAuth} from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(private ofAuth: AngularFireAuth,private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User){
    try{
      const result = await this.ofAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
    }catch(e){
      console.error(e.message);
      var msg = e.message;
      let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'});
      toast.present();
    }
  }

}
