import { Component } from '@angular/core';
import { NavController, NavParams ,IonicPage} from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core'

/**
 * Generated class for the AjustesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ajustes',
  templateUrl: 'ajustes.html',
})
export class AjustesPage {
  perfilData: FirebaseObjectObservable<User>
  publico:boolean;
  notificaciones:boolean;
  idioms: any[] = []; 
  spa:boolean;
  ing:boolean;

  constructor(private translateService: TranslateService,public navCtrl: NavController,private storage: Storage, public navParams: NavParams,private afDatabase: AngularFireDatabase,private afAuth: AngularFireAuth) {
    this.spain();
    setTimeout(() => {
    this.idioms = [
      {
        value: 'es', 
        label: 'Español',
        selected: this.spa
      },
      {
        value: 'en',
        label: 'Inglés',
        selected: this.ing
      }
    ];
  }, 500);
  }

  spain(){
    if (localStorage.getItem("idioma") === null) {
      console.log("no hay idioma");
      this.spa=true;
      this.ing=false;
    }else{
      this.storage.get('idioma').then((idioma) =>{
          if(idioma==""){
            this.spa=true;
            this.ing=false;
          }else if(idioma=="es"){
            this.translateService.use("es");
            this.spa=true;
            this.ing=false;
          }else if(idioma=="en"){
            this.translateService.use("en");
            this.spa=false;
            this.ing=true;
          }
      });
    }
  }

  choose(lang) {
    this.translateService.use(lang);
    this.storage.set('idioma', lang);
    setTimeout(() => {
      this.spain();
    }, 1000); 
  }



  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data =>{  
      if(data && data.email && data.uid){   
      this.perfilData= this.afDatabase.object(`Perfil/${data.uid}`)
      }
    })
  }

  actualizar(){
    this.afAuth.authState.take(1).subscribe(data =>{
    firebase.database().ref('Perfil/').child(data.uid).update({ publico: this.publico});
  })
  }

  actualizarNotificacion(){
    this.afAuth.authState.take(1).subscribe(data =>{
    firebase.database().ref('Perfil/').child(data.uid).update({ notificaciones: this.notificaciones});
    this.storage.set('notificacion',this.notificaciones);
  })
  }



}
