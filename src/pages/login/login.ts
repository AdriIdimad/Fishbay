import { User } from './../../models/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  

  constructor(private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }





  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
      const result = await this.ofAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      this.navCtrl.push('HomePage');
    }catch(e){
      console.error(e);
    }
    

  }

  register(){
    this.navCtrl.push('RegisterPage');
  }

  lostpass(){
    this.navCtrl.push('LostpassPage')
  }

}
