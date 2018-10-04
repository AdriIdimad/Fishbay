import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";
import {Facebook} from '@ionic-native/facebook';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core'
import { MenuController} from 'ionic-angular';


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
  idioms: any[] = [];
  spa:boolean;
  ing:boolean;
 
  constructor(public menuCtrl: MenuController,private translateService: TranslateService, public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public Facebook:Facebook, private storage: Storage,private afDatabase: AngularFireDatabase) {
    this.spain();
    setTimeout(() => {
    this.idioms = [
      {
        value: 'es', 
        label: 'Español',
        selected: this.spa
      },
      {
        value: 'en',
        label: 'Inglés',
        selected: this.ing
      }
    ];
  }, 500);
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

    spain(){

      if (localStorage.getItem("idioma") === null) {
        console.log("no hay idioma");
        this.spa=true;
        this.ing=false;
      }else{
        this.storage.get('idioma').then((idioma) =>{
            if(idioma==""){
              this.spa=true;
              this.ing=false;
            }else if(idioma=="es"){
              this.translateService.use("es");
              this.spa=true;
              this.ing=false;
            }else if(idioma=="en"){
              this.translateService.use("en");
              this.spa=false;
              this.ing=true;
            }
        });
    }

  }

    choose(lang) {
      this.translateService.use(lang);
      this.storage.set('idioma', lang);
      setTimeout(() => {
        this.spain();
      }, 500); 
    }

    fblogin(){
      this.Facebook.getLoginStatus().then((success) => {
        if (success.status === 'connected') {
          this.Facebook.logout();
        }else{

      this.Facebook.login(['email']).then(res=>{
        const fc=firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
      
        firebase.auth().signInWithCredential(fc).then(fs=>{ 
          var fb=true;
          this.storage.set('fb', fb);
          this.Facebook.api("me/?fields=name,email,first_name,picture.width(400).height(400),last_name,birthday,hometown",['public_profile','email'])
         .then(response => {
            this.user.nombre=response.name;
            this.user.nick=response.first_name;
            this.user.email=response.email;
            this.user.imagen=response.picture.data.url;
            this.user.id=fs.uid;
            this.user.token=res.authResponse.accessToken;
            this.user.publico=true;
            this.user.notificaciones=true;
            if(response.birthday==null){
              this.user.edad=null;
            }else{
              this.user.edad=response.birthday;
            }
            if(response.ciudad==null){
              this.user.ciudad="";
            }else{
              this.user.ciudad=response.hometown;
            } 
            this.storage.set('id_user', fs.uid);
            this.afDatabase.object(`Perfil/${fs.uid}`).set(this.user).then(() => this.navCtrl.push('HomePage'));
        });
       
      }).catch(err=>{
        console.log("firebase "+JSON.stringify(err));
      })
      
    }).catch(err=>{
      console.log("facebook "+JSON.stringify(err));
    })
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
        this.fallo.aviso_error("Los campos email y contraseña estan vacios.");    
      }else if(error=="auth/email-already-in-use"){
        this.fallo.aviso_error("Email no disponible.");
      }
      
    }
  }

  register(){
    this.navCtrl.push('RegisterPage');
  }

  lostpass(){
    this.navCtrl.push('LostpassPage');
  }


}
