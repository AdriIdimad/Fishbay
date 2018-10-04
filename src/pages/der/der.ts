import { Evento } from './../../models/evento';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, IonicPage,App } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { AlertController } from 'ionic-angular';
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
  public loaded:boolean;
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
  public fecha:any;
  moment:any;

  constructor(private alertCtrl: AlertController, private admobFree: AdMobFree,public fallo: Funciones_utilesProvider,public ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public afDatabase: AngularFireDatabase,private camera: Camera,public app: App, public plt: Platform, private storage: Storage) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/iconos.png?alt=media&token=d77e8b7c-d044-42ac-b34d-e4a5dcb3d20d";
      this.myPhotosRef = firebase.storage().ref('/ImagenesEventos/');
      this.lat="";
      this.lng="";
      this.direccion="";
      this.ciudad="";
      this.loaded=false;

      this.fecha =new Date().toISOString();

      /*const bannerConfig: AdMobFreeBannerConfig = {
        // add your config here
        // for the sake of this example we will just use the test config
        isTesting: true,
        autoShow: true
       };
       this.admobFree.banner.config(bannerConfig);
       
       this.admobFree.banner.prepare()
         .then(() => {
           // banner Ad is ready
           // if we set autoShow to false, then we will need to call the show method here
         })
         .catch(e => console.log(e));*/
  }

  calculateTime(offset: any) {
    // create Date object for current location
    let d = new Date();

    // create new Date object for different city
    // using supplied offset
    let nd = new Date(d.getTime() + (3600000 * offset));

    return nd.toISOString();
  }


  ngAfterViewInit(){
    this.initMap();
  }

  initMap() {
    let that=this;
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      
    });
  
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(29.0468535, -13.589973299999997));
        map.fitBounds(defaultBounds);
   
    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));
  

    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }
  
      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
  
        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });
  
        markers.push(marker);
  
        bounds.extend(place.geometry.location);
      }
  
      map.fitBounds(bounds);
     
      that.lat=marker.getPosition().lat();
      that.lng=marker.getPosition().lng(); 
  
      var geocoder = geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                that.direccion=results[0].formatted_address;
                that.ciudad=results[0].address_components[2].long_name;
            }
        }
    }); 
    });


    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
      if (this.getZoom() > 20) {
        this.setZoom(10);
      }
    });

  }

   async registrarEvento(evento: Evento){

        var ptn;
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

            if(evento.nombre!="" && evento.descripcion!="" && evento.ciudad!="" && evento.imagen!="" &&
              evento.fecha!=null && evento.lugar!="" && evento.horaInicio!=null && evento.horaFinal!=null && evento.categoria!=null &&
              evento.idCreador!="" && evento.id!="" && evento.lat!="" && evento.lng!="" && evento.direccion!="" && evento.cupo!=null){

              firebase.database().ref('Perfil/').orderByChild("id").equalTo(auth.uid).on("child_added", function(data) {
                ptn=data.val().puntuacion;              
              });
              
              
              setTimeout(() => {
              evento.ptnOrganizador=ptn;
              this.afDatabase.object(`Chat/${newKey}`).set('');
              this.afDatabase.object(`Eventos/${newKey}`).set(this.evento)
              .then(() => {

                var rootRef = firebase.database().ref().child("Apuntados");
                var newKey2 = rootRef.push().key;        
                this.afDatabase.object(`Apuntados/${newKey2}`).set({
                    id: newKey2,
                    idUsuario: auth.uid,
                    idEvento: newKey 
                  })
                        
                this.app.getRootNav().setRoot('HomePage');
              })
            }, 1000);
            
          }else{
            let alert = this.alertCtrl.create({
              title: 'Hay campos vacíos',
              subTitle: 'Completa todos los campos',
              buttons: ['Ok']
            });
            alert.present();
          
          }

        }); 
    
  }
    
  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 800,
      targetHeight: 600,
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

  onChange(categoria){
    if(categoria=="deportes"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/deportes-2126641.jpg?alt=media&token=78fff571-1f4c-4e66-93e3-6f59d5bfbf0b";
    }
  }


}
