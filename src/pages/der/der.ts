import { Evento } from './../../models/evento';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, IonicPage,App } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
//import { GoogleMaps, GoogleMap, GoogleMapsEvent,LatLng, CameraPosition, MarkerOptions,Marker} from '@ionic-native/google-maps';
declare var google;

@IonicPage()
@Component({
  selector: 'page-der',
  templateUrl: 'der.html',
})

export class DerPage {

  evento = {} as Evento;
  public lat: any;
  public lng: any;
  public direccion: string;
  public ciudad: string;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public nombre: any;
  public event_marker:any;
  map: any;
  coord: any;
  infoWindow: any;
  public marker:any;
  markers = [];
  infowindow: any;

  constructor(public fallo: Funciones_utilesProvider,public ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public afDatabase: AngularFireDatabase,private camera: Camera,public app: App, public plt: Platform, private storage: Storage) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/iconos.png?alt=media&token=d77e8b7c-d044-42ac-b34d-e4a5dcb3d20d";
      this.myPhotosRef = firebase.storage().ref('/ImagenesEventos/');
      this.lat="";
      this.lng="";
      this.direccion="";
      this.ciudad="";
  }


  ngAfterViewInit(){
    this.initMap();
  }

  initMap() {
      let that=this;
      let myLatLng = {lat: 29.0468535, lng: -13.589973299999997};
      var infowindow = new google.maps.InfoWindow();
      

        this.map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          zoom: 9
        });

        this.marker = new google.maps.Marker({
          position: myLatLng,
          label: {
            color: 'black',
            fontWeight: 'bold',
            text: 'Mueveme'
          },
          map: that.map,
          draggable: true
        });
 
        google.maps.event.addListener(this.marker, "position_changed", function() {
            that.lat=this.getPosition().lat();
            that.lng=this.getPosition().lng();

            var geocoder = geocoder = new google.maps.Geocoder();
              geocoder.geocode({ 'latLng': this.getPosition() }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        that.direccion=results[0].formatted_address;
                        that.ciudad=results[0].address_components[2].long_name;
                    }
                }
            });

        });
  } 

   async registrarEvento(evento: Evento){
        var rootRef = firebase.database().ref().child("Eventos");
        var newKey = rootRef.push().key;
          evento.imagen=this.myPhotoURL;
          this.ofAuth.authState.take(1).subscribe(auth =>{
            evento.idCreador=auth.uid;
            evento.id=newKey;
            evento.lat=this.lat;
            evento.lng=this.lng;
            evento.direccion=this.direccion;
            evento.ciudad=this.ciudad; 
            this.afDatabase.object(`Eventos/${newKey}`).set(this.evento)
            .then(() => {
              this.app.getRootNav().setRoot('HomePage');
            })
          }) 
    
  }
    
  
  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 2000,
      targetHeight: 1000,
      allowEdit:true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 10,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
  private uploadPhoto(): void {
    this.nombre = this.generateUUID();
    this.myPhotosRef.child(this.nombre+'.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
      });
  }

  
  // GENERA NOMBRE RANDOM IMAGEN
  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid.toString();
  }


  setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
      }    
    
  ionViewWillLeave(){
    this.setMapOnAll(this.map);

  }

}
