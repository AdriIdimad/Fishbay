import { Component } from '@angular/core';
import { User } from './../../models/user';
import { NavController, NavParams, IonicPage,Content , App} from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';
import { FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the VerPerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-perfil',
  templateUrl: 'ver-perfil.html',
})
export class VerPerfilPage {

  user = {} as User;
  usuario: {}; 
  name: string; 
  last_name:string;
  email:string;
  puntuacion:number;
  picture:any;
  first_name:string;
  edad:any;
  ciudad:string;
  public idUsuario="";
  currentUser:string;
  perfilData: FirebaseListObservable<any[]>;
  public deshabilitado:boolean=false;
ocultarBloqueo: boolean = false;
  constructor(private storage: Storage,public navCtrl: NavController,public translateService:TranslateService, public navParams: NavParams,private afDatabase: AngularFireDatabase,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.idUsuario = this.navParams.get("id");
    this.currentUser = firebase.auth().currentUser.uid;
    this.perfilData = this.afDatabase.list('/Perfil', {
      query: {
        orderByChild: 'id',
        equalTo: this.idUsuario 
      }
    }); 
    console.log(this.perfilData);
    this.comprobarBloqueado();
    this.ocultarBotonBloqueo();

  }
 

  bloquear(){
    var rootRef = firebase.database().ref().child("bloqueados");
    var newKey = rootRef.push().key;
      this.afDatabase.object(`bloqueados/${newKey}`).set({
        id: newKey,
        idUsuario: firebase.auth().currentUser.uid,
        idBloqueado: this.idUsuario
      }).then(() => {
        let alert = this.alertCtrl.create({
          title: this.translateService.instant("BLOCK_USER"),
          subTitle: this.translateService.instant("BLOCK_USER2"),
          buttons: ['OK']
        });
        alert.present();
      });
      this.comprobarBloqueado();
  }
ocultarBotonBloqueo(){
  if(this.currentUser == this.idUsuario){
    this.ocultarBloqueo = true;
  }else{
    this.ocultarBloqueo = false;
  }
}
  comprobarBloqueado(){
    var elim=[];

    this.storage.get('id_user').then((id_user) =>{

      var ref = firebase.database().ref("bloqueados");
        ref.orderByChild('idUsuario').equalTo(id_user).on('value', function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach( item => {
            elim.push(item.val());
            return false;
          });
      });

      for(var i=0;i<elim.length;i++){
        if(elim[i]['idBloqueado']==this.idUsuario){
          this.deshabilitado=true;
          break;
          }
      }

      //this.navCtrl.setRoot(this.navCtrl.getActive().component);

  });

  }

}
