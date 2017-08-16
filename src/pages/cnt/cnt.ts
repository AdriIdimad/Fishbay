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
  public eventList:Array<any>;
  eventosUser: FirebaseListObservable<any[]>;
  eventosApuntados: FirebaseListObservable<any[]>;
  public cadena: string;
  apuntados:Array<any>;
  mostrarApuntados:Array<any>;
  eventos: FirebaseListObservable<any[]>;
  public eventRef:firebase.database.Reference;
  public loadedeventList:Array<any>;
  final:Array<any>=[];
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
  
    this.storage.get('id_user').then((id_user) =>{

      this.eventosApuntados = this.afDatabase.list('/Perfil', {
      query: {
        orderByChild: 'id',
        equalTo: id_user //pasar variable id local
      }
    });
      this.eventosApuntados.forEach(evento => {
          this.cadena=evento[0].eventosApuntados;
          this.apuntados=this.cadena.split(',');
          this.storage.set('apuntado', this.apuntados);
      })

    })

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
      console.log(this.eventList);

      this.storage.get('apuntado').then((apuntado) =>{

      for(var j=0;j<apuntado.length;j++){
            for(var i=0;i<this.loadedeventList.length;i++){
              if(apuntado[j]==this.loadedeventList[i]['id'] && apuntado[j]!=""){ 
                this.final.push(this.loadedeventList[i]);
                console.log(this.loadedeventList[i]);
              }
               
            }
          
      }
          console.log(this.final);
      })
      
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
