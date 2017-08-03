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
  name: string;
  last_name:string;
  email:string;
  picture:string;
  first_name:string;
  edad:string;
  ciudad:string;
  facebook: boolean;
  
  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,public Facebook:Facebook,
  private afDatabase: AngularFireDatabase,private storage: Storage) {
  }

  ionViewWillLoad() {
    this.afAuth.authState.take(1).subscribe(data =>{  
      if(data && data.email && data.uid){   
      this.perfilData= this.afDatabase.object(`Perfil/${data.uid}`)
      }
      this.storage.get('fb').then((fb) =>{
        this.facebook=fb;
      if(fb==true){
        this.getInfo();
      }
    });
    })
  
  }

  getInfo(){
      this.Facebook.api("me/?fields=name,email,first_name,picture,last_name,birthday,location",['public_profile','email'])
         .then(response => {
            this.name=response.name;
            this.last_name=response.last_name;
            this.first_name=response.first_name;
            this.email=response.email;
            this.picture=response.picture;
            this.edad=response.birthday;
            this.ciudad=response.location;
        }); 
    
  }
}
