import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage,App,Nav } from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import { User } from './../../models/user';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { FirebaseListObservable } from 'angularfire2/database';
import { Camera } from '@ionic-native/camera';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the PerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',  
})
export class PerfilPage { 
  user = {} as User;
  usuario: {};
  perfilData: FirebaseListObservable<any[]>;
  name: string;
  last_name:string;
  email:string;
  picture:any;
  first_name:string;
  edad:any;
  ciudad:string;
  facebook: boolean;
  public puntuacion:number;
  public myPhotosRef: any; 
  public myPhoto: any;
  public myPhotoURL: any;
  public nombre: any;
  public error1:any; 
  public error2:any;
  
  constructor(public mensaje: Funciones_utilesProvider, public translateService:TranslateService, private alertCtrl: AlertController,private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,public Facebook:Facebook,
  private afDatabase: AngularFireDatabase,private storage: Storage,private camera: Camera,public app: App,public loading: LoadingController) {
    this.myPhotosRef = firebase.storage().ref('/Imagenes/');
  }  
 
  ionViewWillLoad() {
    this.afAuth.authState.take(1).subscribe(data =>{  
      if(data && data.email && data.uid){   
        this.perfilData = this.afDatabase.list('/Perfil', {
          query: {
            orderByChild: 'id',
            equalTo: data.uid 
          }
        }); 

      }


      this.storage.get('fb').then((fb) =>{
        this.facebook=fb;
      if(fb==true){
        this.getInfo();
      }
    });
    })
  
  }

  cargar(){
    this.afAuth.authState.take(1).subscribe(data =>{  
      if(data && data.email && data.uid){  
        this.perfilData = this.afDatabase.list('/Perfil', {
          query: {
            orderByChild: 'id',
            equalTo: data.uid 
          }
        }); 
      } 
      this.storage.get('fb').then((fb) =>{
        this.facebook=fb;
      if(fb==true){
        this.getInfo();
      } 
    });
    })
  } 

  actualizar(user: User){
    var id=firebase.auth().currentUser.uid;
      firebase.database().ref('Perfil/').child(id).update(user).then(() => this.mensaje.mostrarMensaje(this.translateService.instant("PERFIL_ACTUALIZADO"),"")).catch(error => {
        console.log('Error - ' + error.message);
      });
    
  }
 
  ajustes(){
    this.navCtrl.push('AjustesPage');
  }

  getInfo(){
      this.Facebook.api("me/?fields=name,email,first_name,picture,last_name,birthday,hometown",['public_profile','email'])
         .then(response => {
            this.name=response.name;;
            this.first_name=response.first_name;
            this.email=response.email;
            this.picture=response.picture.data.url;
            this.edad=response.birthday;
            this.ciudad=response.hometown;
        });  
            
  }

 subirImagen(user: User): void {
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
    this.myPhotosRef.child(this.nombre+'.jpeg')
      .putString(this.myPhoto, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
        this.afAuth.authState.take(1).subscribe(data =>{ 
          firebase.database().ref('Perfil/').child(data.uid).update({ imagen: this.myPhotoURL});
          this.cargar();
        })
        
      });
  }
 

  // GENERA NOMBRE RANDOM IMAGEN
  public generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid.toString();
  }

  listaBloqueados(){
    this.navCtrl.push('BloqueadosPage');
  }

  cancelarCuenta(email,password){
    var id=firebase.auth().currentUser.uid;

    var cant=0;
    var snap;
    var password;

    var playersRef = firebase.database().ref("Eventos/"); 
    playersRef.orderByChild("idCreador").equalTo(id).on("value", function(snapshot) {
      snap=snapshot.val();
      for(let index in snap){ 
        cant++;
      } 
    });

    var that=this;

    let alert = this.alertCtrl.create({
      title: this.translateService.instant("DELETE_ACCOUNT"),
      message: this.translateService.instant("DELETE_ACCOUNT2"),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {

            if(!this.facebook){
              console.log("normal");
            var elim=[];

            this.afAuth.authState.take(1).subscribe(auth =>{
              var user = firebase.auth().currentUser;
              var credential=firebase.auth.EmailAuthProvider.credential(email, password);
            user.reauthenticateWithCredential(credential).then(function() {
              user.delete().then(function() {

                var ref = firebase.database().ref("Apuntados");
                ref.orderByChild('idUsuario').equalTo(auth.uid).on('value', function(snapshot) { 
                  console.log(snapshot.val());
                  snapshot.forEach( item => {
                    elim.push(item.val());
                    return false;
                  }); 
        
              });
              console.log(elim);
              console.log(elim.length);
        
              for(var i=0;i<elim.length;i++){
                    firebase.database().ref('/Apuntados').child(elim[i]['id']).remove();
              }

              firebase.database().ref('/Perfil').child(auth.uid).remove();
              setTimeout(() => {
                
                      that.storage.remove('id_user');
                      firebase.auth().signOut();
                      that.app.getRootNav().setRoot('LoginPage'); 
                    }, firebase.auth().signOut());

                
              }).catch(function(error) {
                console.log(error);
                this.error1=error;
              }); 

            }).catch(function(error) {
              console.log(error);
              this.error2=error;
            });
          });

        }else{
          console.log("facebook");
          var elim=[];
          var tokenFacebook;
          
                      this.afAuth.authState.take(1).subscribe(auth =>{

                        var tok = firebase.database().ref("Perfil/");
                        tok.orderByChild("id").equalTo(auth.uid).on("child_added", function(data) {
                          tokenFacebook=data.val().token;
                        });
                        var user = firebase.auth().currentUser;
                        var credential=firebase.auth.FacebookAuthProvider.credential(tokenFacebook);
                        user.reauthenticateWithCredential(credential).then(function() {
                        user.delete().then(function() {
          
                          var ref = firebase.database().ref("Apuntados");
                          ref.orderByChild('idUsuario').equalTo(auth.uid).on('value', function(snapshot) { 
                            console.log(snapshot.val());
                            snapshot.forEach( item => {
                              elim.push(item.val());
                              return false;
                            }); 
                  
                        });
                        console.log(elim);
                        console.log(elim.length);
                  
                        for(var i=0;i<elim.length;i++){
                              firebase.database().ref('/Apuntados').child(elim[i]['id']).remove();
                        }
          
                        firebase.database().ref('/Perfil').child(auth.uid).remove();
                        setTimeout(() => { 
                          
                                that.storage.remove('id_user');
                                that.Facebook.logout();
                                that.Facebook=null;
                                firebase.auth().signOut();
                                that.app.getRootNav().setRoot('LoginPage'); 
                              }, firebase.auth().signOut(),that.Facebook.logout());
          
                          
                        }).catch(function(error) {
                          console.log(error);
                          this.error1=error;
                        }); 
          
                      }).catch(function(error) {
                        console.log(error);
                        this.error2=error;
                      });
                    });
            }

        }  
       } 
      ]
    });

    if(cant>0){
      let alert2 = this.alertCtrl.create({
        title: this.translateService.instant("DELETE_PLANS"),
        message: this.translateService.instant("DELETE_PLANS2"),
        buttons: [
          {
            text: 'OK',
            handler: () => {
              
            }
          }
        ]
      });
      alert2.present();
    }else{
      alert.present();
      
    }

  } 

  cambiarpassword(email,password){
    var auth = firebase.auth();
    let that=this;
    var id=firebase.auth().currentUser.uid;


    var user = firebase.auth().currentUser;
    var credential=firebase.auth.EmailAuthProvider.credential(email, password);
    user.reauthenticateWithCredential(credential).then(function() {
        let alert = that.alertCtrl.create({
          title: this.translateService.instant("NEW_PASSWORD"),
          inputs: [
            {
              name: 'password',
              placeholder: this.translateService.instant("NEW_PASSWORD"),
              type: 'password'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked'); 
              }
            },
            {
              text: 'OK',
              handler: data => {
                user.updatePassword(data.password).then(function() {
                  firebase.database().ref('Perfil/').child(id).update({ password: data.password}).then(() => this.mensaje.mostrarMensaje(this.translateService.instant("PASSWORD_UPDATE"),"") );
                }).catch(function(error) {
                 console.log(error);
                });
                
              }
            } 
          ]
        });
        alert.present();
      
    });

  }


}
