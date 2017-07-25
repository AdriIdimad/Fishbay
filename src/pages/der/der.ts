import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import { AngularFireAuth} from "angularfire2/auth";
/**
 * Generated class for the DerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-der',
  templateUrl: 'der.html',
})
export class DerPage {

  usuario= {};

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,public Facebook:Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DerPage');
  }

  getInfo(){
    this.Facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data=>{
      console.log(data);
      this.usuario = data;
    })
    .catch(error =>{
      console.error( error );
    });
  }

}
