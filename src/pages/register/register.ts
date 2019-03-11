import { HomePage } from './../home/home';
import { Cuestionario1Page } from './../cuestionario1/cuestionario1';
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
import { MenuController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http,RequestOptions,Headers } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
   
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

  constructor(private http: Http,private alertCtrl: AlertController,public translateService:TranslateService, public menuCtrl: MenuController,public fallo: Funciones_utilesProvider,public ofAuth: AngularFireAuth,private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase,private camera: Camera, private storage: Storage) {
      this.myPhotoURL="https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/1467646262_522853_1467646344_noticia_normal.jpg?alt=media&token=becd877e-b16c-43fe-8a68-f1267d38cff0";
      this.myPhotosRef = firebase.storage().ref('/Imagenes/');     
  }
  
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(false, 'menu1');
  }

  ionViewWillLeave() {
    // Don't forget to return the swipe to normal, otherwise 
    // the rest of the pages won't be able to swipe to open menu
    this.menuCtrl.swipeEnable(true);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
   }



   sendPostRequest(email,nombre) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    const requestOptions = new RequestOptions({ headers: headers });

    let postData = {
            "name": nombre,
            "email": email
    }
    var senderBody = JSON.stringify(postData);

    console.log(postData);

    this.http.post("http://gofishbay.com/enviaremail.php", senderBody, requestOptions)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);
      });

  }

  
  async register(user: User){


    if(user.nombre==undefined || user.nick==undefined || user.descripcion==undefined || user.ciudad==undefined || user.email==undefined || user.password==undefined){
        let alert = this.alertCtrl.create({
          title: this.translateService.instant("CAMPOS_VACIOS"),
          subTitle: this.translateService.instant("CAMPOS_VACIOS2"),
          buttons: ['OK']
        });
        alert.present();
    }else{
   
      try{

        const result = await this.ofAuth.auth.createUserWithEmailAndPassword(user.email,user.password);  
        firebase.auth().onAuthStateChanged(function(user) {
          user.sendEmailVerification();  
        });
        this.sendPostRequest(user.email,user.nombre);   
        console.log(result); 
        user.imagen=this.myPhotoURL;   
        this.ofAuth.authState.take(1).subscribe(auth =>{
          var id_usuario =auth.uid;
          user.id=auth.uid;
          user.publico=true;
          user.notificaciones=true;
          user.puntuacion=0;
          user.nVotos=0;
          this.storage.set('id_user', id_usuario);
          this.storage.set('notificaciones', true);
          this.afDatabase.object(`Perfil/${auth.uid}`).set(this.user)
          .then(() => this.navCtrl.setRoot('Cuestionario1Page'))
        })
      }catch(e){
        let error: string = e.code;
        if (error == "auth/invalid-email") {
          this.fallo.aviso_error(this.translateService.instant("FORMATO_MAIL"));
        } else if (error == "auth/user-not-found") {
          this.fallo.aviso_error(this.translateService.instant("EMAIL_NOVALIDO"));
        } else if (error == "auth/wrong-password") {
          this.fallo.aviso_error(this.translateService.instant("PASSWORD_NO"));
        } else if (error == "auth/argument-error") {
          this.fallo.aviso_error(this.translateService.instant("EMPTLY_FIELDS"));
        } else if (error == "auth/email-already-in-use") {
          this.fallo.aviso_error(this.translateService.instant("EMAIL_NO"));
        }
        
      }  
  }

} 

  subirImagen(): void {
    this.camera.getPicture({
      targetWidth: 500,
      targetHeight: 500,
      allowEdit:true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
  public uploadPhoto(): void {
    this.nombre = this.generateUUID();
    firebase.storage().ref('/Imagenes/').child(this.nombre+'.jpeg')
      .putString(this.myPhoto, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
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
