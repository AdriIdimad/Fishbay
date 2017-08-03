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

  eventosUser: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, private storage: Storage,private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
     this.eventosUser = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'idCreador',
        equalTo: 'xOvtx60PTrTPniIT8rIkYO7PFbG3' //pasar variable id local
      }
    });

  }
  goprofile(){
    this.app.getRootNav().push('PerfilPage');
  }


}
