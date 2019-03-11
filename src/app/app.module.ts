import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AngularFireAuthModule } from "angularfire2/auth";
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { MyApp } from './app.component';
import { Funciones_utilesProvider } from '../providers/funciones_utiles/funciones_utiles';
import { HttpModule } from "@angular/http";
import { Http } from "@angular/http";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AjustesPage } from '../pages/ajustes/ajustes';
import { SwingModule } from 'angular2-swing';
import { NgCalendarModule } from 'ionic2-calendar';
import { Ionic2RatingModule } from 'ionic2-rating';
import { EmailComposer } from '@ionic-native/email-composer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdMobFree } from '@ionic-native/admob-free';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { DatePickerModule } from 'ion-datepicker';
import { DatePipe } from '@angular/common';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    SwingModule,
    DatePickerModule,
    Ionic2RatingModule,
    NgCalendarModule,
    AngularFireDatabaseModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    SocialSharing,
    Camera,
    AdMobFree,
    EmailComposer,
    Funciones_utilesProvider,
    Crop,
    DatePipe,
    NativeStorage,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ScreenOrientation
  ]
})
export class AppModule { }

