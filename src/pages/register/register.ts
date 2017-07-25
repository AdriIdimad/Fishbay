import { HomePage } from './../home/home';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase) {
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User){
    try{
      const result = await this.ofAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
      this.ofAuth.authState.take(1).subscribe(auth =>{
        this.afDatabase.object(`Perfil/${auth.uid}`).set(this.user)
        .then(() => this.navCtrl.push('HomePage'))
      })
    }catch(e){
      let error: string= e.code;
      if(error == "auth/invalid-email"){
        this.fallo.aviso_error("El formato del email es incorrecto.");
      }else if(error=="auth/user-not-found"){
        this.fallo.aviso_error("El email introducido no corresponde a ningún usuario.");
      }else if(error=="auth/wrong-password"){
        this.fallo.aviso_error("Contraseña incorrecta");
      }else if(error=="auth/argument-error"){
        this.fallo.aviso_error("Los campos email y contraseña estan vacios.")
      }
      
    }
  } 

  registroBD(){

  }

}
