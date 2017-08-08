import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AngularFireAuthModule } from "angularfire2/auth";
import {Facebook} from '@ionic-native/facebook';
import firebase from 'firebase';
import { MyApp } from './app.component';
import { Funciones_utilesProvider } from '../providers/funciones_utiles/funciones_utiles';
import { HttpModule } from "@angular/http";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

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
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Camera,
    Funciones_utilesProvider,
    Crop,
    Geolocation,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
