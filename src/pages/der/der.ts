import { Evento } from './../../models/evento';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Nav,Platform, IonicPage,App } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { AlertController } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core';
//import { GoogleMaps, GoogleMap, GoogleMapsEvent,LatLng, CameraPosition, MarkerOptions,Marker} from '@ionic-native/google-maps';
declare var google;

@IonicPage()
@Component({  
  selector: 'page-der',
  templateUrl: 'der.html',
  providers: [DatePickerDirective,DatePipe],
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
  viewTitle;
  public event_marker:any;
  map: any;
  coord: any;
  infoWindow: any;
  public marker:any;
  markers = [];
  infowindow: any; 
  moment:any;
  fecha:any;
  public localDate: Date = new Date();
  public initDate: Date = new Date();
  public initDate2: Date = new Date(2015, 1, 1);
  public minDate: Date = new Date();
  public disabledDates: Date[] = [new Date(2017, 7, 14)];
  public localeString = {
    monday: true,
    weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  }; 
  public min: Date = new Date();

  constructor(public nav: Nav,public translateService: TranslateService,public mensaje: Funciones_utilesProvider,public datepipe: DatePipe,private alertCtrl: AlertController,public datepicker: DatePickerDirective, private admobFree: AdMobFree,public fallo: Funciones_utilesProvider,public ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public afDatabase: AngularFireDatabase,private camera: Camera,public app: App, public plt: Platform, private storage: Storage) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/Registro_Login.png?alt=media&token=482facce-07b2-48ab-aa1a-fc3c3893f947";
      this.myPhotosRef = firebase.storage().ref('/ImagenesEventos/');
      this.lat="";
      this.lng="";
      this.direccion=""; 
      this.ciudad=""; 
      this.loaded=false;

  }    

  public Log(stuff): void {
    this.datepicker.open();
    this.datepicker.changed.subscribe(() => console.log('test'));
    console.log(stuff);
  }
 
  public event(data: Date): void {
    //this.fecha =this.datepipe.transform(data, 'dd-MM-yyyy');
    this.localDate =data;
  } 
  
  setDate(date: Date) {
    //this.fecha =this.datepipe.transform(date, 'dd-MM-yyyy');
    this.initDate=date;
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

  ajustes() {
    this.nav.push('AjustesPage');
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
        
        var address = place.address_components;
        var city, state, zip;
        address.forEach(function(component) {
          var types = component.types;
          if (types.indexOf('locality') > -1) {
            city = component.long_name;
          }
        
        });

      }
  
      map.fitBounds(bounds);
      
      that.lat=marker.getPosition().lat();
      that.lng=marker.getPosition().lng(); 
      that.ciudad=city;

      
  
      var geocoder = geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                that.direccion=results[0].formatted_address;
                if(that.ciudad==undefined){
                that.ciudad=results[0].address_components[1].long_name;
                }
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
        this.fecha =this.datepipe.transform(this.initDate, 'yyyy-MM-dd');
          evento.imagen=this.myPhotoURL;
          this.storage.get('id_user').then((id_user) =>{
            
            evento.fecha=this.fecha;
            evento.idCreador=id_user;
            evento.id=newKey;  
            evento.lat=this.lat; 
            evento.lng=this.lng;
            evento.direccion=this.direccion;
            evento.ciudad=this.ciudad;

            if(evento.nombre!="" && evento.descripcion!="" && evento.ciudad!="" && evento.imagen!="" &&
              evento.fecha!=null && evento.lugar!="" && evento.horaInicio!=null && evento.categoria!=null &&
              evento.idCreador!="" && evento.id!="" && evento.lat!="" && evento.lng!="" && evento.direccion!=""){
              
                var crear =document.getElementById('crear');
                crear.setAttribute("value", "Creando plan...");
                crear.setAttribute("disabled", "true");
              
              firebase.database().ref('Perfil/').orderByChild("id").equalTo(id_user).on("child_added", function(data) {
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
                    idUsuario: id_user,
                    idEvento: newKey 
                  })
                        
                this.app.getRootNav().setRoot('HomePage');
                crear.setAttribute("disabled", "false");
                this.mensaje.mostrarMensaje(this.translateService.instant("PUBLICADO_EXITO"),"");
              })
            }, 1000);
             
          }else{
            this.mensaje.mostrarMensaje(this.translateService.instant("CAMPOS_VACIOS"),this.translateService.instant("CAMPOS_VACIOS2"));
   
          }

        });
    
  }
    
  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 400,
      targetHeight: 500,
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
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66";
    }
    if(categoria=="cultura"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcultura.png?alt=media&token=985c4a60-c716-44c1-9ede-51894b0e0d71";
    }
    if(categoria=="Gastronomia"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fgastronomia.png?alt=media&token=4a0317e0-1bf4-4d48-958b-093002f3fc29";
    }
    if(categoria=="Aire libre"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526";
    }
    if(categoria=="Noche/Fiesta"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Ffiesta.png?alt=media&token=41a4e6f7-acf6-4ab0-ad5a-d64e59eaf417";
    }
    if(categoria=="Viajes"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fviajes.png?alt=media&token=26e97e7e-53a2-40ff-b0bd-50f7e2dcf221";
    }
    if(categoria=="Solo con mujeres"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fchicas.png?alt=media&token=b5bae77e-2d04-49c9-89aa-ab2017451a35";
    }
    if(categoria=="Con niños"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcon_ninos_2.png?alt=media&token=0421b5a5-0b9b-4d97-9ca8-712e2c17b84f";
    }
    if(categoria=="Solo con hombres"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fchicos.png?alt=media&token=505eec40-4056-48d2-aa45-55212d9cb89e";
    }
    if(categoria=="Con animales"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fmascotas.png?alt=media&token=83dbf3ac-820a-400e-a053-d0eb8767b416";
    }
    if(categoria=="Gratuito"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fmanualidades.png?alt=media&token=6f660ae3-174f-476b-b26e-d7d2834b9158";
    }
    if(categoria=="Solidario"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2FSolidario.png?alt=media&token=5f96720f-269e-46fe-baa0-d788b902ebfd";
    }
    if(categoria=="Otro"){
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fotros_2.png?alt=media&token=c1fd8a79-8888-4e92-bad0-c27d3c5720f1";
    }
  }


}
