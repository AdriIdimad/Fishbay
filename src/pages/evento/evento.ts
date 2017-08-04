import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the EventoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {

  infoEvento: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.storage.get('id_evento').then((id_evento) =>{
      this.infoEvento = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'id',
        equalTo: id_evento 
      }
    });
    });
  }

}
