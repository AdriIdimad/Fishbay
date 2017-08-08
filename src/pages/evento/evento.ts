import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {

  infoEvento: FirebaseListObservable<any[]>;
  infoUsuario: FirebaseObjectObservable<User>;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, public googleMaps: GoogleMaps,
  public geolocation: Geolocation) {
    
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
      this.obtenerPosicion();
  }


  obtenerPosicion():any{
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      alert(error);
    })
  }

  loadMap(postion: Geoposition){
    let latitude = postion.coords.latitude;
    let longitud = postion.coords.longitude;
    console.log(latitude, longitud);
   
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('mapa');

    let map: GoogleMap = this.googleMaps.create(element);

    // create LatLng object
    let myPosition: LatLng = new LatLng(latitude,longitud);

    // create CameraPosition
    let position: CameraPosition = {
      target: myPosition,
      zoom: 18,
      tilt: 30
    };

    map.one(GoogleMapsEvent.MAP_READY).then(()=>{
      alert('Map is ready!');

      // move the map's camera to position
      map.moveCamera(position);

      // create new marker
      let markerOptions: MarkerOptions = {
        position: myPosition,
        title: 'Here'
      };
      map.addMarker(markerOptions);
    });

  }



}




  



