import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform, App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';



@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  
 }