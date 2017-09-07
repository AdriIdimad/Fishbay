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
  public eventosApuntados: FirebaseListObservable<any[]>;
  public cadena: string;
  public apuntados:Array<any>;
  mostrarApuntados:Array<any>;
  eventos: FirebaseListObservable<any[]>;
  public eventRef:firebase.database.Reference;
  public loadedeventList:Array<any>;
  public final:Array<any>=[];
  public infoUser:Array<any>;
  public userRef:firebase.database.Reference;
  public finalUser:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public storage: Storage,public afDatabase: AngularFireDatabase) {
    this.tusEventos="Apt";
  }

  ionSelected() {
    alert("Home Page has been selected");
    // do your stuff here
  }

  ionViewDidLoad() {
    //mis eventos creados
    var usuario;
    this.storage.get('id_user').then((id_user) =>{
      console.log("usuario "+id_user);
      this.eventosUser = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'idCreador',
        equalTo: id_user //pasar variable id local
      }
    });
    });
  }

  cargar(){
    this.final.length = 0;
    //recojo los id de los eventos a los que esta apuntado
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
          console.log("Array apuntados "+this.apuntados);
          this.storage.set('apuntado', this.apuntados);
      })
        

    })
        //recojo toda la informacion de todos los eventos
        this.eventRef = firebase.database().ref('/Eventos');
        this.eventRef.on('value', eventList => {
        let countries = [];
          eventList.forEach( country => {
          countries.push(country.val());
          return false;
        });
        
      this.eventList = countries;
      this.loadedeventList = countries;
      //console.log(this.eventList.length);
      //comparo los id y cojo la informacion de los que esta apuntado el usuario
      this.storage.get('apuntado').then((apuntado) =>{
      for(var j=0;j<apuntado.length;j++){
            for(var i=0;i<this.loadedeventList.length;i++){
              if(apuntado[j]==this.loadedeventList[i]['id'] && apuntado[j]!=""){ 
                this.final.push(this.loadedeventList[i]);
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

  desapuntarse(idEvento){ 
    this.storage.get('id_user').then((id_user) =>{
      firebase.database().ref(`Perfil/${id_user}`).once('value').then(function(snapshot) {
            var apt = snapshot.val().eventosApuntados;
            apt = apt.replace(idEvento+",","");
            firebase.database().ref(`Perfil/${id_user}`).update({'eventosApuntados': apt});
          });
      })
      this.cargar();
      this.navCtrl.setRoot('CntPage');
  }
}
