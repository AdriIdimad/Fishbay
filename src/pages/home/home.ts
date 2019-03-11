import { CntPage } from './../cnt/cnt';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { NavParams,Content , App} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Evento } from './../../models/evento';
import { TranslateService } from '@ngx-translate/core'

/**
 * Generated class for the HomePage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

declare var FCMPlugin;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  firestore = firebase.database().ref('/pushtokens');
  firemsg = firebase.database().ref('/messages');

  izqRoot = 'IzqPage' 
  cntRoot = 'CntPage'
  derRoot = 'DerPage'
  perfilRoot= 'PerfilPage'
  ListaFiltrada: Array<any>;
 
  constructor(private translateService: TranslateService,private storage: Storage,public navCtrl: NavController,public navParams: NavParams,public afd: AngularFireDatabase) {
    //this.ListaFiltrada=this.navParams.get("listaFiltrada");
    //this.navCtrl.setRoot(HomePage,{listaFiltrada:this.ListaFiltrada});
    this.tokensetup().then((token) => {
      this.storetoken(token);
    }) 
    //this.permitirEliminar();
    //this.planesGenericos();
    this.storage.get('idioma').then((idioma) =>{
      this.translateService.use(idioma);
    }); 


  }  

  ionViewDidLoad() {
    FCMPlugin.onNotification(function(data){
    if(data.wasTapped){
      //Notification was received on device tray and tapped by the user.
        //alert("al clicar notificacion"+ JSON.stringify(data) );
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified.
      console.log( JSON.stringify(data) );
    }
    });

    FCMPlugin.onTokenRefresh(function(token){
      console.log( token ); 
    });    
  } 

  //cojer el token del movil para enviar notificaciones, se actualiza con el ultimo dispositivo con el que se conecta el usuario.

  tokensetup() { 
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function(token){
    resolve(token);
      }, (err) => {
        reject(err);
});
    })
    return promise; 
  }

  storetoken(t) {
    var cant=0;
    var snap;
    this.storage.get('id_user').then((id_user) =>{
      this.afd.object(`pushtokens/${id_user}`).set({
        uid: firebase.auth().currentUser.uid,
        devtoken: t
      }).then(() => {
        //alert('Token stored');
        }).catch(() => {
          //alert('Token not stored');
        })
      });

      /*alert("existe");
      firebase.database().ref('/pushtokens').child(firebase.auth().currentUser.uid).update({
        uid: firebase.auth().currentUser.uid,
        devtoken: t
          
      }).then(() => {
        //alert('Token stored');
        }).catch(() => {
          //alert('Token not stored');
        })*/
} 

  desapuntarse(idEvento){ 
  
      var elim=[];
  

        var ref = firebase.database().ref("Apuntados");
          ref.orderByChild('idEvento').equalTo(idEvento).on('value', function(snapshot) { 
            console.log(snapshot.val());
            snapshot.forEach( item => {
              elim.push(item.val());
              return false;
            }); 
   
        });
        console.log(elim);
        console.log(elim.length);
  
        for(var i=0;i<elim.length;i++){
           // if(elim[i]['idEvento']==idEvento){
              firebase.database().ref('Apuntados/').child(elim[i]['id']).remove();
            //}
        }
   
  }


  //eliminar evento cuando a pasado un día
  permitirEliminar(){
    var a="";
    var b="";
    var arr=[];
    var coord="";
    var entra=true;
    var that=this;
    var fecha;
    var finaliza;

    var ref = firebase.database().ref("Eventos/");
    ref.on("child_added", function(snapshot) {
        arr.push(snapshot.val());
    }); 

    var dia = new Date();

    var dd=dia.getUTCDate();
    var mm=dia.getMonth()+1;;
    var yy=dia.getFullYear();

    if(dd<10) {
      var d=dd.toString();
      d = "0"+dd
    } 
    if(mm<10) {
    var m=mm.toString();
      m = "0"+mm
    }
  
    var fechaHoy;

    if(d==undefined && m==undefined){
      fechaHoy=yy+"-"+mm+"-"+dd;
    }else if(d==undefined && m!=undefined){
      fechaHoy=yy+"-"+m+"-"+dd;
    }else if(d!=undefined && m==undefined){
      fechaHoy=yy+"-"+mm+"-"+d;
    }
    else{
      fechaHoy=yy+"-"+m+"-"+d;
    }

 
    setTimeout(() => {
    for(var i=0;i<arr.length;i++){
      fecha=arr[i]['fecha'];

      var dia1 = new Date(fechaHoy);
      var dia2 = new Date(fecha);

      var utc1 = Date.UTC(dia1.getFullYear(), dia1.getMonth(), dia1.getDate());
      var utc2 = Date.UTC(dia2.getFullYear(), dia2.getMonth(), dia2.getDate());
      var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

      var result=Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

      if(result<=-1){
        console.log("borramos "+fecha);
        firebase.database().ref('Eventos/').child(arr[i]['id']).remove();
        that.desapuntarse(arr[i]['id']);
      }

      console.log(fecha);
      console.log(result);

    }  

  }, 2000);


}

  planesGenericos(){

        var dia = new Date();
        var nDia;
        nDia=dia.getDay();
        var numeroSemana;

        var dia = new Date();
        
            var dd=dia.getUTCDate();
            var mm=dia.getMonth()+1;;
            var yy=dia.getFullYear();
         
              var date = new Date(dia.getTime());
               date.setHours(0, 0, 0, 0);
              // Thursday in current week decides the year.
              date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
              // January 4 is always in week 1.
              var week1 = new Date(date.getFullYear(), 0, 4);
              // Adjust to Thursday in week 1 and count number of weeks from date to week1.
              numeroSemana=1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                                    - 3 + (week1.getDay() + 6) % 7) / 7);

              firebase.database().ref('programados/').on("child_added", function(data) {
                  ptn=data.val().puntuacion;              
              });    

        if(nDia==1){
         var evento: Evento;
            var ptn;
            var rootRef = firebase.database().ref().child("Eventos");
            var newKey = rootRef.push().key;
                firebase.database().ref('Perfil/').orderByChild("id").equalTo("qKK8VjSHWpSAZ9fTqz1w12NwQ4f2").on("child_added", function(data) {
                  ptn=data.val().puntuacion;              
            });

                setTimeout(() => {
                this.afd.object(`Eventos/${newKey}`).set({
                  imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/Marca-Fishbay.png?alt=media&token=2a8028ee-e472-4664-9a0f-85b6d35c61d8",
                  idCreador: "qKK8VjSHWpSAZ9fTqz1w12NwQ4f2",
                  id : newKey,
                  lat:29.0468535,
                  lng:-13.589973299999997,
                  direccion:"Calle Fishbay",
                  ciudad:"Las Palmas",
                  ptnOrganizador: ptn
                });
              }, 1000);

        }

  }

}
