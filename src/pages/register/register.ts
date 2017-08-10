import { HomePage } from './../home/home';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

   

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {} as User;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public nombre: any;

  constructor(public fallo: Funciones_utilesProvider,private ofAuth: AngularFireAuth,private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase,private camera: Camera, private storage: Storage) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/1467646262_522853_1467646344_noticia_normal.jpg?alt=media&token=becd877e-b16c-43fe-8a68-f1267d38cff0";
      this.myPhotosRef = firebase.storage().ref('/Imagenes/');
      
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User){
    try{
      const result = await this.ofAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
      user.imagen=this.myPhotoURL;
      user.eventosApuntados="";
      this.ofAuth.authState.take(1).subscribe(auth =>{
        var id_usuario =auth.uid;
        this.storage.set('id_user', id_usuario);
        this.afDatabase.object(`Perfil/${auth.uid}`).set(this.user)
        .then(() => this.navCtrl.setRoot('HomePage'))
      })
    }catch(e){
      let error: string= e.code;
      if(error == "auth/invalid-email"){
        this.fallo.aviso_error("El formato del email es incorrecto.");
      }else if(error=="auth/user-not-found"){
        this.fallo.aviso_error("El email introducido no corresponde a ningún usuario.");
      }else if(error=="auth/wrong-password"){
        this.fallo.aviso_error("Contraseña incorrecta");
      }else if(error=="auth/argument-error"){
        this.fallo.aviso_error("Los campos email y contraseña estan vacios.")
      }
      
    }
  } 

  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 80,
      targetHeight: 80,
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

}
