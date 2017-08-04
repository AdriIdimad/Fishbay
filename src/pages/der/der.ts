import { Evento } from './../../models/evento';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
/**
 * Generated class for the IzqPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-der',
  templateUrl: 'der.html',
})
export class DerPage {

  evento = {} as Evento;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public nombre: any;
  

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase,private camera: Camera) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/iconos.png?alt=media&token=d77e8b7c-d044-42ac-b34d-e4a5dcb3d20d";
      this.myPhotosRef = firebase.storage().ref('/ImagenesEventos/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IzqPage');
  }

   async registrarEvento(evento: Evento){
     var rootRef = firebase.database().ref().child("Eventos");
     var newKey = rootRef.push().key;
      evento.imagen=this.myPhotoURL;
      this.ofAuth.authState.take(1).subscribe(auth =>{
        evento.idCreador=auth.uid;
        evento.id=newKey;
        this.afDatabase.object(`Eventos/${newKey}`).set(this.evento)
        .then(() => this.navCtrl.setRoot('HomePage'))
      })
  }
    
  
  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 200,
      targetHeight: 100,
      allowEdit:false,
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


}
