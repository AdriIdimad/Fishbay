import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage,ViewController} from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the VotarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-votar',
  templateUrl: 'votar.html',
})
export class VotarPage {

public idCreador;
public idEvento;

  constructor(public afDatabase: AngularFireDatabase, private view:ViewController,public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {
    this.idCreador=this.navParams.get("id");
    this.idEvento=this.navParams.get("idEvento");
  }

  dismiss(){
    this.view.dismiss();
    
  }
   
  onModelChange(voto){
  
    var puntuacion;
    var media;
    var votos;

    firebase.database().ref('Perfil/').orderByChild("id").equalTo(this.idCreador).on("child_added", function(data) {
      puntuacion=data.val().puntuacion;
      votos=data.val().nVotos;
    });  

    setTimeout(() => {
      
    puntuacion=puntuacion+voto;
    if(votos>0){
    media=puntuacion/votos;
    }else{
      media=puntuacion;
    } 
    votos++;
    firebase.database().ref('Perfil/').child(this.idCreador).update({ puntuacion: media, nVotos: votos});
    firebase.database().ref('Eventos/').child(this.idEvento).update({ ptnOrganizador: media});
    

    var rootRef = firebase.database().ref().child("Votos/");
    var newKey = rootRef.push().key; 
    this.storage.get('id_user').then((id_user) =>{
  
      this.afDatabase.object(`Votos/${newKey}`).set({
        id: newKey,
        idUsuario: id_user,
        idEvento: this.idEvento 
      })
     
    });

    }, 1000);
    
    this.dismiss();

    } 
 

}
