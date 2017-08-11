import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";
import {Facebook} from '@ionic-native/facebook';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
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
  fb: boolean;
  name: string;
  last_name:string;
  email:string;
  picture:any;
  first_name:string;
  edad:any;
  ciudad:string;
  id:string;

  

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public Facebook:Facebook, private storage: Storage,private afDatabase: AngularFireDatabase) {
  }

    fblogin(){
      this.Facebook.login(['email']).then(res=>{
        const fc=firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
        firebase.auth().signInWithCredential(fc).then(fs=>{ 
          var fb=true;
          this.storage.set('fb', fb);
          this.Facebook.api("me/?fields=id,name,email,first_name,picture,last_name,birthday,hometown",['public_profile','email'])
         .then(response => {
            this.user.nombre=response.name;
            this.user.apellido=response.first_name;
            this.user.email=response.email;
            this.user.imagen=response.picture.data.url;
            this.user.edad=response.birthday;
            this.user.ciudad=response.hometown;
            this.user.id=response.id;            
        }); 
      }).catch(err=>{
        alert("firebase erro")
      })
      alert(this.user.id);
      this.afDatabase.object(`Perfil/${this.user.id}`).set(this.user).then(() => this.navCtrl.push('HomePage'));
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
      var fb=false;
      this.ofAuth.authState.take(1).subscribe(auth =>{
          var id_usuario =auth.uid;
          this.storage.set('id_user', id_usuario);
      })

      this.storage.set('fb', fb);     
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
    this.navCtrl.push('LostpassPage');
  }


}
