import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import { User } from './../../models/user';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  usuario: {};
  perfilData: FirebaseObjectObservable<User>
  nombre: string;
  apellido: string;
  perfilFacebook: {};
  name: string;
  last_name:string;
  
  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,public Facebook:Facebook,
  private afDatabase: AngularFireDatabase,private storage: Storage) {
  }

  ionViewWillLoad() {
    this.afAuth.authState.take(1).subscribe(data =>{  
      if(data && data.email && data.uid){   
      this.perfilData= this.afDatabase.object(`Perfil/${data.uid}`)
      }
      this.storage.get('fb').then((fb) =>{
      if(fb==true){
        this.getInfo();
      }
    });
    })
    
  }

  getInfo(){
      this.Facebook.api("me/?fields=name,email,first_name,picture,last_name,gender",['public_profile','email'])
         .then(response => {
            this.name=response.name;
            this.last_name=response.last_name;
        }); 
    
  }
}
