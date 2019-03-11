import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { User } from './../../models/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core'
import { MenuController } from 'ionic-angular';

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
  last_name: string;
  email: string;
  picture: any;
  first_name: string;
  edad: any;
  ciudad: string;
  idioms: any[] = [];
  spa: boolean;
  ing: boolean;

  constructor(public menuCtrl: MenuController, private translateService: TranslateService, public fallo: Funciones_utilesProvider, private ofAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public Facebook: Facebook, private storage: Storage, private afDatabase: AngularFireDatabase) {
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

  spain() {

    if (localStorage.getItem("idioma") === null) {
      console.log("no hay idioma");
      this.spa = true;
      this.ing = false;
      this.storage.set('idioma', "es");
    } else {
      this.storage.get('idioma').then((idioma) => {
        if (idioma == "") {
          this.spa = true;
          this.ing = false;
          this.storage.set('idioma', "es");
        } else if (idioma == "es") {
          this.translateService.use("es");
          this.spa = true;
          this.ing = false;
          this.storage.set('idioma', idioma);
        } else if (idioma == "en") {
          this.translateService.use("en");
          this.spa = false;
          this.ing = true;
          this.storage.set('idioma', idioma);
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

  fblogin() {
    this.Facebook.getLoginStatus().then((success) => {
      if (success.status === 'connected') {
        this.Facebook.logout();
      } else {
        this.Facebook.login(['email']).then(res => {
          const fc = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)

          firebase.auth().signInWithCredential(fc).then(fs => {
            var fb = true;
            this.storage.set('fb', fb);

            this.Facebook.api("me/?fields=name,email,first_name,picture.width(400).height(400),last_name,birthday,hometown", ['public_profile', 'email'])
              .then(response => {

                this.user.nombre = response.name;
                this.user.nick = response.first_name;
                this.user.email = response.email;
                this.user.imagen = response.picture.data.url;
                this.user.id = fs.uid;
                this.user.token = res.authResponse.accessToken;



                if (response.birthday == null) {
                  this.user.edad = null;
                } else {
                  this.user.edad = response.birthday;
                }
                if (response.ciudad == null) {
                  this.user.ciudad = "";
                } else {
                  this.user.ciudad = response.hometown;
                }

                let userExists;
                var perf = firebase.database().ref("Perfil/");
                perf.orderByChild("id").equalTo(fs.uid).on("child_added", function (data) {
                  userExists = data.val().nombre;
                });
                setTimeout(() => {
                  this.storage.set('id_user', fs.uid);
                  if (userExists != null) {
                    firebase.database().ref('Perfil/').child(fs.uid).update({ nombre: this.user.nombre, nick: this.user.nick, email: this.user.email, edad: this.user.edad, ciudad: this.user.ciudad, imagen: this.user.imagen, token: this.user.token }).then(() => this.navCtrl.push('HomePage'));
                  } else {
                    this.user.puntuacion = 0;
                    this.user.publico = true;
                    this.user.notificaciones = true;
                    this.afDatabase.object(`Perfil/${fs.uid}`).set(this.user).then(() => this.navCtrl.push('HomePage'));
                  }
                }, 500);
              });
 
          }).catch(err => {
            console.log("firebase " + JSON.stringify(err));
          })

        }).catch(err => {
          console.log("facebook " + JSON.stringify(err));
        })
      }

    });
  }

  async login(user: User) {
    let that=this; 
      try {
        const result = await this.ofAuth.auth.signInWithEmailAndPassword(user.email, user.password);
        
        firebase.auth().onAuthStateChanged(function(user2) {
         
          if (user2.emailVerified) {
              var fb = false;
                    that.ofAuth.authState.take(1).subscribe(auth => {
                      var id_usuario = auth.uid;
                      that.storage.set('id_user', id_usuario);
                      that.storage.set('fb', fb);
                      that.navCtrl.push('HomePage');
                    })
          }
          else {
            
            that.fallo.aviso_error("Email no verificado");
            user2.sendEmailVerification(); 
          }
        });
        
      } catch (e) {
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

  register() {
    this.navCtrl.push('RegisterPage');
  }

  lostpass() {
    this.navCtrl.push('LostpassPage');
  }


}
