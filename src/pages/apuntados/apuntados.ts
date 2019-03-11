import { Component } from '@angular/core';
import { NavController, Nav,NavParams, IonicPage,Content , App} from 'ionic-angular';
import firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the ApuntadosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage() 
@Component({
  selector: 'page-apuntados',
  templateUrl: 'apuntados.html',
})
export class ApuntadosPage {

  public idEvento:any;
  public loadedeventList:Array<any>;
  public nav: Nav

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.idEvento = this.navParams.get('idEvento');
    this.cargarLista();
  }


  cargarLista(){
    var a=[];
    var b=[];
    var c=[];
 
    
      var playersRef = firebase.database().ref("Apuntados/"); 
      playersRef.orderByChild("idEvento").equalTo(this.idEvento).on("value", function(snapshot) {
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
            if(a[i]['idUsuario']==b[j]['id']){
              c.push(b[j]);
            }
        }
      }
    }, 400);
    
      this.loadedeventList=c;
      console.log(this.loadedeventList);
    

  } 

  verUsuario(id){
    this.navCtrl.push('VerPerfilPage',{id:id});
  }

}
