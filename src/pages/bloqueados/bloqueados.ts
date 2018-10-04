import { Component} from '@angular/core';
import { NavController, NavParams,IonicPage} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
/**
 * Generated class for the BloqueadosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bloqueados',
  templateUrl: 'bloqueados.html',
})
export class BloqueadosPage {
  public loadedeventList:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
    this.cargarLista();
  }

  ionViewDidLoad() {
    
  }

  cargarLista(){
    var a=[];
    var b=[];
    var c=[];
    

    this.storage.get('id_user').then((id_user) =>{

      var playersRef = firebase.database().ref("bloqueados/"); 
      playersRef.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
        snapshot.forEach( item => {
        a.push(item.val());
        return false;
        }); 
      });

      var ref = firebase.database().ref("Perfil/");
      ref.on("child_added", function(snapshot) {
          b.push(snapshot.val());  
      });
      
      setTimeout(() => {

      for(var i=0;i<a.length;i++){
          for(var j=0;j<b.length;j++){
            if(a[i]['idBloqueado']==b[j]['id']){
              c.push(b[j]);
            }
        }
      }
    }, 1000);
    
      this.loadedeventList=c;
      console.log(this.loadedeventList);
    

  });
  }

  desbloquear(idUsuario){ 
    
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
          console.log(elim);
          console.log(elim.length);
    
          for(var i=0;i<elim.length;i++){
              if(elim[i]['idBloqueado']==idUsuario){
                firebase.database().ref('/bloqueados').child(elim[i]['id']).remove();
              }
          }
     
      });
       this.cargarLista();
             
           //this.cargar();
          // this.navCtrl.push('CntPage');
           //this.navCtrl.setRoot('CntPage');
      }



}
