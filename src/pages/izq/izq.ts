import { Evento } from './../../models/evento';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
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

  public eventList:Array<any>;
  public loadedeventList:Array<any>;
  public eventRef:firebase.database.Reference;
  

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase, private storage: Storage) {
        this.eventRef = firebase.database().ref('/Eventos');
        this.eventRef.on('value', eventList => {
        let countries = [];
          eventList.forEach( country => {
          countries.push(country.val());
          return false;
        });

      this.eventList = countries;
      this.loadedeventList = countries;
      console.log(this.eventList.length);
    } );

  }

  loading: boolean = true
  onLoad() {
      this.loading = false;
  }
 
  ionViewDidLoad() {
    /*this.eventos = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'fecha'
      }
    });*/
  }

  initializeItems(): void {
  this.eventList = this.loadedeventList;
  }

  detallesEvento(idEvento){
    this.storage.set('id_evento',idEvento);
    this.navCtrl.push('EventoPage');
  }


  getItems(searchbar) {
  // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.eventList = this.eventList.filter((v) => {
      if(v.nombre && q) {
        if (v.nombre.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.eventList.length);

}


}
