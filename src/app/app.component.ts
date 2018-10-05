import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Push } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Nav, NavParams, IonicPage, Content, NavController, MenuController, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from '@ngx-translate/core';
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { LoadingController } from 'ionic-angular';
@Component({
  templateUrl: 'app.html'
})


export class MyApp {


  public rootPage: any;
  @ViewChild(Nav) nav: Nav;

  constructor(public app: App, public loading: LoadingController, public Facebook: Facebook, private alertCtrl: AlertController, private ofAuth: AngularFireAuth, private translateService: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, public menuCtrl: MenuController) {

    platform.ready().then(() => {
      this.translateService.setDefaultLang('es');
      this.translateService.use('es');
      this.storage.get('id_user').then(loggedIn => {
        this.rootPage = loggedIn ? 'HomePage' : 'LoginPage';
      });


      /*
            this.storage.get('id_user').then(token => {
              if(!token){
                this.navCtrl.setRoot('LoginPage')
                this.menuCtrl.swipeEnable(false);
              }
              else{
                this.navCtrl.setRoot('HomePage')
                this.menuCtrl.swipeEnable(true);
              }
            })
      
           var push = Push.init({
              android: {
                senderID: "944185704251"
              },
              ios: {
                alert: "true",
                badge: true,
                sound: 'false'
              }, 
              windows: {}
            });
      
            push.on('registration', (data) => {
              console.log(data.registrationId);
              console.log(data.registrationId.toString());
            });
      */
      statusBar.overlaysWebView(false);
      statusBar.hide();
      splashScreen.hide();
    });
  }



  ajustes() {
    this.nav.push('AjustesPage');
  }

  conducta() {
    this.nav.push('ConductaPage');
  }

  politica() {
    this.nav.push('PoliticaPage');
  }

  premium() {
    this.nav.push('PremiumPage');
  }

  terminos() {
    this.nav.push('TerminosPage');
  }

  cuestionario() {
    this.nav.push('Cuestionario2Page');
  }

  cerrarSesion() {
    let loading = this.loading.create({
      content: 'Cerrando sesión...'
    });

    loading.present();

    setTimeout(() => {

      this.storage.remove('id_user');
      this.Facebook.logout();
      this.Facebook = null;
      firebase.auth().signOut();
      this.app.getRootNav().setRoot('LoginPage');
      loading.dismiss();
    }, firebase.auth().signOut(), this.Facebook.logout());


  }



}

