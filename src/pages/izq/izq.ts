import { Evento } from './../../models/evento';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the IzqPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-izq',
  templateUrl: 'izq.html',
})
export class IzqPage {


  evento = {} as Evento;
  eventos: FirebaseListObservable<any[]>;
  

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    this.eventos = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'fecha'
      }
    });
  }



}
