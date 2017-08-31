import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform, App} from 'ionic-angular';
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
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  map: GoogleMap;
  public deshabilitar: boolean=false;
  infoEvento: FirebaseListObservable<any[]>;
  infoUsuario: FirebaseObjectObservable<User>;
  public o:any;
  public e:any;
  public event_marker:any;

  
  constructor(public mensaje: Funciones_utilesProvider,public navCtrl: NavController, public navParams: NavParams, private ofAuth: AngularFireAuth,private storage: Storage,private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, private googleMaps: GoogleMaps,
  public geolocation: Geolocation, private platform:Platform, private app: App){

  
  }

  obtenerCoordenadas(){
    this.geolocation.getCurrentPosition().then((resp) => {
        this.o=resp.coords.latitude;
        this.e=resp.coords.longitude;
        this.storage.set('la', this.o);
        this.storage.set('lon', this.e);       
    })
      this.loadMap();
  }

  ngAfterViewInit() {
    this.obtenerCoordenadas();
  }

  prueba(la,lo,map){
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
   title: 'Evento'
 };

map.addMarker(markerOptions)
   .then((marker: Marker) => {

       marker.showInfoWindow();
       this.event_marker = marker;
   
    });
  }
  ionViewWillLeave(){
    if(this.event_marker){
      this.event_marker.remove();
    }
    
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
 }