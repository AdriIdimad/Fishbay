import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';


@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {
  map: GoogleMap;

  infoEvento: FirebaseListObservable<any[]>;
  infoUsuario: FirebaseObjectObservable<User>;
  public o:any;
  public e:any;


  constructor(public toast: Funciones_utilesProvider,public navCtrl: NavController, public navParams: NavParams, private ofAuth: AngularFireAuth,private storage: Storage,private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, private googleMaps: GoogleMaps,
  private geolocation: Geolocation, private platform:Platform){

  
  }

  obtenerCoordenadas(){
    this.geolocation.getCurrentPosition().then((resp) => {
        this.o=resp.coords.latitude;
        this.e=resp.coords.longitude;
        this.storage.set('la', this.o);
        this.storage.set('lon', this.e);
        alert(this.o+" 1º "+this.e);        
    })
      this.loadMap();
  }

  ngAfterViewInit() {
    this.obtenerCoordenadas();
  }

  prueba(la,lo,map){
    alert(la+" ff "+lo);
    var myLatlng = new LatLng(la,lo);

 let position: CameraPosition = {
   target: {
     lat: la,
     lng: lo
   },
   zoom: 18,
   tilt: 30
 };

 map.moveCamera(position);

 // create new marker
 let markerOptions: MarkerOptions = {
   position: myLatlng,
   title: 'Ionic'
 };

map.addMarker(markerOptions)
   .then((marker: Marker) => {
      marker.showInfoWindow();
    });
  }

loadMap() {
 let element: HTMLElement = document.getElementById('map');

 let map: GoogleMap = this.googleMaps.create(element);

 map.one(GoogleMapsEvent.MAP_READY).then(
   () => {
     console.log('Map is ready!');
   }
 );

 this.storage.get('la').then((la) =>{
   this.storage.get('lon').then((lo) =>{
         this.prueba(la,lo,map);
         });
    });
 }

  
  ionViewDidLoad() {
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
    })   
    });
      
  }

  mostrarToast(){
      this.toast.aviso_error("Te has apuntado al evento");
  }

  async apuntarse(id){
        
    
      this.ofAuth.authState.take(1).subscribe(auth =>{
        firebase.database().ref(`Perfil/${auth.uid}`).once('value').then(function(snapshot) {
          var apuntados = snapshot.val().eventosApuntados;
          //this.afDatabase.object(`Perfil/${auth.uid}`).update({'eventosApuntados': apuntados+","+id})
          firebase.database().ref(`Perfil/${auth.uid}`).update({'eventosApuntados': apuntados+","+id})
        .then(() => {
          this.mostrarToast();
          
        })
          
        });

        
      })
  

  }

 }





  



