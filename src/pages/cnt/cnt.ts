import { FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage,App } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the CntPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cnt',
  templateUrl: 'cnt.html',
})
export class CntPage {
  tusEventos: string = "tu";

  eventosUser: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, private storage: Storage,private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    var usuario;
    this.storage.get('id_user').then((id_user) =>{
      console.log(id_user);
      this.eventosUser = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'idCreador',
        equalTo: id_user //pasar variable id local
      }
    });
    });
    
     

  }
  out(){
    this.storage.remove('id_user');
    this.app.getRootNav().setRoot('LoginPage');
  }
  goprofile(){
    this.app.getRootNav().push('PerfilPage');
  }

  detallesEvento(idEvento){
    this.storage.set('id_evento',idEvento);
    this.navCtrl.push('EventoPage');

  }


}
