import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform, App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
declare var google;


@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {
  //map: GoogleMap;
  public deshabilitar: boolean=false;
  infoEvento: FirebaseListObservable<any[]>;
  infoUsuario: FirebaseObjectObservable<User>;
  public latitud:any;
  public longitud:any;
  public o:any;
  public e:any;
  public event_marker:any;
  map: any;
  infoWindow: any;
  marker:any;
  markers = [];

  
  constructor(public mensaje: Funciones_utilesProvider,public navCtrl: NavController, public navParams: NavParams, public ofAuth: AngularFireAuth,public storage: Storage,public afDatabase: AngularFireDatabase, public afAuth: AngularFireAuth, public platform:Platform, public app: App){
      this.latitud="";
      this.longitud="";
  }

   ionViewDidLoad() {
    
  
    /*this.storage.get('deshabilitar').then((desh) =>{
          this.deshabilitar=desh;
    });*/

  }

  ngAfterViewInit(){
    this.initMap();
  }

  initMap() {
    let that=this;
    this.storage.get('id_evento').then((id_evento) =>{
      this.infoEvento = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'id',
        equalTo: id_evento 
      }
    });

    this.infoEvento.forEach(element => {
        var id=element[0].idCreador;
        this.afAuth.authState.take(1).subscribe(data =>{  
        if(data && data.email && data.uid){   
        this.infoUsuario= this.afDatabase.object(`Perfil/${id}`)
      }  
    })
      var latitud=element[0].lat;
      var long=element[0].lng;
      let myLatLng = {lat: latitud, lng: long};

        this.map = new google.maps.Map(document.getElementById('mapa'), {
          center: myLatLng,
          zoom: 9
        });

        this.marker = new google.maps.Marker({
          position: myLatLng,
          map: that.map,
          title: 'evento'
        });
        this.markers.push(this.marker);

  })    
});       

}

  setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
      }    
    
  ionViewWillLeave(){
    this.setMapOnAll(this.map);

  }

  mostrarToast(){
      this.mensaje.aviso_error("Te has apuntado al evento");
  }

  async apuntarse(id){        
    
      this.ofAuth.authState.take(1).subscribe(auth =>{
        firebase.database().ref(`Perfil/${auth.uid}`).once('value').then(function(snapshot) {
          var apuntados = snapshot.val().eventosApuntados;          
          firebase.database().ref(`Perfil/${auth.uid}`).update({'eventosApuntados': apuntados+""+id+","});
        });

        firebase.database().ref(`Eventos/${id}`).once('value').then(function(snapshot) {
          var numPersonas = snapshot.val().numApuntadas;
          var sumarPersona= numPersonas+1;          
          firebase.database().ref(`Eventos/${id}`).update({'numApuntadas': sumarPersona});
        });

        var cadena="";


        var sacarID = this.afDatabase.list('/Eventos', {
            query: {
              orderByChild: 'id',
              equalTo: id 
            }
          });

        sacarID.forEach(element => {
            cadena=element[0].eventosApuntados;
        })

        if(cadena.indexOf(id)>= -1){
          var d = document.getElementById("boton"); 
          d.setAttribute("disabled", "true");
          this.mostrarToast();
        }

        //this.deshabilitar=true;
        //this.storage.set('deshabilitar', this.deshabilitar);
        //this.storage.set('idEvento', id);
        
      })
  
  }

 }
