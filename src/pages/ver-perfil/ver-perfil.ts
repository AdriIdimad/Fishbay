import { Component } from '@angular/core';
import { User } from './../../models/user';
import { NavController, NavParams, IonicPage,Content , App} from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
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
  picture:any;
  first_name:string; 
  edad:any;
  ciudad:string;
  public idUsuario="";
  perfilData: FirebaseObjectObservable<User>
  public deshabilitado:boolean=false;

  constructor(private storage: Storage,public navCtrl: NavController, public navParams: NavParams,private afDatabase: AngularFireDatabase,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.idUsuario = this.navParams.get("id");
    this.perfilData= this.afDatabase.object(`Perfil/${this.idUsuario}`)
    this.comprobarBloqueado();
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
          title: 'Bloquear usuario',
          subTitle: 'Has bloqueado a este usuario',
          buttons: ['OK']
        });
        alert.present();
      });
      this.comprobarBloqueado();
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
