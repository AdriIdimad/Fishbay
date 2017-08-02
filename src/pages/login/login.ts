import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";
import {Facebook} from '@ionic-native/facebook';
import firebase from 'firebase';
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


  

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public Facebook:Facebook, private storage: Storage) {
  }

    fblogin(){
      this.Facebook.login(['email']).then(res=>{
        const fc=firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
        firebase.auth().signInWithCredential(fc).then(fs=>{
          this.navCtrl.push('HomePage');
      }).catch(err=>{
        alert("firebase erro")
      })
    }).catch(err=>{
      alert(JSON.stringify(err))
    })
  }

  

  ionViewDidLoad() {
    var test;
    console.log('ionViewDidLoad LoginPage');
    this.storage.get('id_user').then((id_user) =>{
      if(id_user!=null){
        this.navCtrl.setRoot("HomePage");
      }
    });

  }

  async login(user: User){
    try{
      const result = await this.ofAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      this.navCtrl.push('HomePage');
    }catch(e){
      let error: string= e.code;
      if(error == "auth/invalid-email"){
        this.fallo.aviso_error("El formato del email es incorrecto.");
      }else if(error=="auth/user-not-found"){
        this.fallo.aviso_error("El email introducido no corresponde a ningún usuario.");
      }else if(error=="auth/wrong-password"){
        this.fallo.aviso_error("Contraseña incorrecta");
      }else if(error=="auth/argument-error"){
        this.fallo.aviso_error("Los campos email y contraseña estan vacios.")      }
      
    }
    

  }

  register(){
    this.navCtrl.push('RegisterPage');
  }

    lostpass(){
    this.navCtrl.push('LostpassPage')
  }


}
