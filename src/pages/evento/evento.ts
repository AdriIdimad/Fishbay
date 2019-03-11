import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Nav,IonicPage, Platform,ModalController, App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Http } from '@angular/http';
import { Headers,RequestOptions } from '@angular/http';
import { IzqPage } from './../izq/izq';
import { TranslateService } from '@ngx-translate/core';

declare var google;
 

@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {
  //map: GoogleMap; 
  deshabilitado: boolean=false;
   
  infoEvento: FirebaseListObservable<any[]>;
  infoUsuario: FirebaseObjectObservable<User>;
  public latitud:any;
  public longitud:any;
  public o:any;
  public e:any;
  public event_marker:any;
  public cantidad:any;
  public lista:any;
  public votado:any;
  public usuario:any;
  public calendario:any;
  mostrarFooter:boolean=false;
  idUsuario:any;
  map: any;
  infoWindow: any;
  marker:any;
  markers = [];
  public b= document.getElementById('boton');
  public navegador:any;
  
  constructor(private http:Http,public translateService: TranslateService,public nav: Nav, private modal: ModalController,private emailComposer: EmailComposer,public mensaje: Funciones_utilesProvider,public navCtrl: NavController, public navParams: NavParams, public ofAuth: AngularFireAuth,public storage: Storage,public afDatabase: AngularFireDatabase, public afAuth: AngularFireAuth, public platform:Platform, public app: App,private alertCtrl: AlertController){
      this.latitud="";
      this.longitud="";
      this.storage.get('id_user').then((id_user) =>{
        this.idUsuario=id_user;
      });
  }


  ionViewDidEnter(){
    this.initMap();
    this.desactivarVoto(); 

    this.storage.get('id_user').then((id_user) =>{ 
    this.usuario=id_user;
    });

    
  }

  ionViewDidLoad() {
    this.lista = this.navParams.get('lista');

    if(this.navParams.get('calendario')!=undefined){
      this.calendario=true;
    }
}

  accionDescartar(){
      this.lista.pop();
      if(this.lista.length==1){
        this.lista.pop();
        console.log("solo 1");
        this.storage.get('planes').then((arrayPlanes) =>{
          this.storage.get('planesCargados').then((ContCargados) =>{
            //this.lista=arrayPlanes.slice(ContCargados-1, ContCargados+2);
            this.lista.push(arrayPlanes[ContCargados]);
            this.lista.push(arrayPlanes[ContCargados-1]);
            this.lista.push(arrayPlanes[ContCargados-2]);
            console.log(this.lista);
            this.storage.set('planesCargados',(ContCargados+2));
          });
        });
      }

    this.navCtrl.pop();
    
    ///this.app.getRootNav().setRoot('IzqPage',{listaFinal:this.lista});
  }

  accionVotar(){
      this.storage.get('id_evento').then((id_evento) =>{
        this.voteUp(id_evento);

        this.navCtrl.pop();
      //this.app.getRootNav().setRoot('IzqPage',{listaFinal:this.lista,idEvento:id_evento})
    });
    
  }

  verApuntados(idEvento){
    this.navCtrl.push('ApuntadosPage',{idEvento:idEvento});
  }

  comprobarVotado(id){
    let comprobar=[];
    
      var ref = firebase.database().ref("Votos/");
      ref.orderByChild('idUsuario').equalTo(this.usuario).on('value', function(snapshot) { 
        //console.log(snapshot.val());
        snapshot.forEach( item => {
          comprobar.push(item.val());
          return false;
        }); 
      });

        for(var i=0;i<comprobar.length;i++){
          console.log("recorremos");
          if(comprobar[i]['idEvento']==id){
             this.votado=true;
             (<HTMLInputElement> document.getElementById("apuntarse")).disabled=true;
             break;
          }else{
            this.votado=false;
            (<HTMLInputElement> document.getElementById("apuntarse")).disabled=false;
          }
        }

  }
  
  contar(id_evento){
    var cant=0;
    var snap; 

      var ref = firebase.database().ref("Apuntados");
      ref.orderByChild("idEvento").equalTo(id_evento).on("value", function(snapshot) {
          snap=snapshot.val();
          for(let index in snap){ 
            cant++;
          }
      });
    return cant;
  }  
  goChat(id_evento){ 
    this.navCtrl.push('ChatPage',{infodata: id_evento });
    
  }

  verPerfil(id){
    this.navCtrl.push('VerPerfilPage',{id: id });
  }

  async votar(idCreador,id){
      const myModal=this.modal.create("VotarPage", { id: idCreador, idEvento:id });
      myModal.present();
    
  }

  denunciar(){
    this.storage.get('id_evento').then((id_evento) =>{
    const myModal=this.modal.create("DenunciarPage", {idEvento:id_evento });
    myModal.present();
    });
  }

 
  desactivarVoto(){
    var snap;
    var deshabilitar=false;
    var desactivados=[];
    var ss;
    setTimeout(() => {
      
   
    this.storage.get('id_evento').then((id_evento) =>{
      this.storage.get('id_user').then((id_user) =>{

        var that=this;
        
        var ref = firebase.database().ref("Apuntados");
        ref.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
            snapshot.forEach( item => {
            desactivados.push(item.val());  
            return false;
            }); 
            console.log(desactivados.length);
          if(desactivados.length==0){
            if(document.getElementById("apuntarse")){
              (<HTMLInputElement> document.getElementById("apuntarse")).disabled = true;
              that.mostrarFooter=true;
            }

          }else{

          for(var i=0;i<desactivados.length;i++){
            if(desactivados[i]['idEvento']==id_evento){
              if(document.getElementById("apuntarse")){
              console.log("si");
              (<HTMLInputElement> document.getElementById("apuntarse")).disabled = false;
              (<HTMLInputElement> document.getElementById("botonChat")).disabled = false;
              that.mostrarFooter=false;
              that.comprobarVotado(id_evento);
              break;
              }
            }else{
              if(document.getElementById("apuntarse")){
              console.log("no");
              //(<HTMLInputElement> document.getElementById("apuntarse")).disabled = true;
              (<HTMLInputElement> document.getElementById("botonChat")).disabled = true;
              (<HTMLInputElement> document.getElementById("apuntarse")).disabled = true;
              that.mostrarFooter=true;
              }  
            }
          }

        }

        });
      }); 
    });
    
  }, 200);

  }

  desactivar(){
    var snap;
    var deshabilitar=false;
    var desactivados=[];
    var ss;
    setTimeout(() => {
      
    this.storage.get('id_evento').then((id_evento) =>{
      this.storage.get('id_user').then((id_user) =>{
        
        var ref = firebase.database().ref("Apuntados");
        ref.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
            snapshot.forEach( item => {
            desactivados.push(item.val());  
            return false;
            }); 
            console.log(desactivados.length);

          for(var i=0;i<desactivados.length;i++){
            if(desactivados[i]['idEvento']==id_evento){
              if(document.getElementById("apuntarse")){
              console.log("si");
              (<HTMLInputElement> document.getElementById("apuntarse")).disabled = true;
              (<HTMLInputElement> document.getElementById("botonChat")).disabled = false;
              this.mostrarFooter=false;
              break;
              }
            }else{
              if(document.getElementById("apuntarse")){
              console.log("no");
              (<HTMLInputElement> document.getElementById("apuntarse")).disabled = false;
              (<HTMLInputElement> document.getElementById("botonChat")).disabled = true;
              this.mostrarFooter=true;
              }
            }
          }
        });
      }); 
    });

  }, 50);
  }

  initMap() {
     
    let that=this;
    this.storage.get('id_evento').then((id_evento) =>{
      this.infoEvento = this.afDatabase.list('/Eventos', {
      query: {
        orderByChild: 'id',
        equalTo: id_evento 
      }
    });

    this.infoEvento.forEach(element => {
        var id=element[0].idCreador;
        this.afAuth.authState.take(1).subscribe(data =>{  
        if(data && data.email && data.uid){   
        this.infoUsuario= this.afDatabase.object(`Perfil/${id}`)
      }  
    })
      var latitud=element[0].lat;
      var long=element[0].lng;
      var direccion=encodeURI(element[0].direccion);
      let myLatLng = {lat: latitud, lng: long};

        this.map = new google.maps.Map(document.getElementById('mapa'), {
          center: myLatLng,
          zoom: 9,
          disableDefaultUI: true
        });

        this.marker = new google.maps.Marker({
          position: myLatLng,
          map: that.map,
          title: 'evento'
        });

        this.navegador='https://www.google.com/maps/dir/?api=1&destination='+direccion+'&dir_action=navigate';

        google.maps.event.addListener(this.marker, 'click', function () {
          window.location.href = 'https://www.google.com/maps/dir/?api=1&destination='+direccion+'&dir_action=navigate';
        });
        this.markers.push(this.marker);

  })    
});       

}

  setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
      }    
    
  ionViewWillLeave(){
    this.setMapOnAll(this.map);
  }

  mostrarToast(){
      this.mensaje.mostrarMensaje(this.translateService.instant("APUNTADO_AL_PLAN"),this.translateService.instant("APUNTADO_AL_PLAN2"));
  }

  async apuntarse(id_evento){ 
    var rootRef = firebase.database().ref().child("Apuntados");
    var newKey = rootRef.push().key;

    this.storage.get('id_user').then((id_user) =>{

      this.afDatabase.object(`Apuntados/${newKey}`).set({
        id: newKey,
        idUsuario: id_user,
        idEvento: id_evento 
      })
     
    });

    this.mostrarToast();

  }

  
  reportar(){
      let alert = this.alertCtrl.create({
        title: 'Denunciar el plan',
        inputs: [
          {
            name: 'texto',
            placeholder: '',
            type:'text'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancelar');
            }
          },
          {
            text: 'Enviar',
            handler: data => {
                  let email = {
                    to: 'adrian@grupoidimad.com',
                    cc: 'fishbay@gmail.com',
                    subject: 'Denuncia de un plan',
                    body: data.texto,
                    isHtml: false
                  };
                  
                  // Send a text message using default options
                  this.emailComposer.open(email);
                }
            
          }
        ]
      });
      alert.present();
    }

    accionVotar2(){
      this.storage.get('id_evento').then((id_evento) =>{
        var limite=this.contar(id_evento);
        var rootRef = firebase.database().ref().child("Apuntados");
        var newKey = rootRef.push().key;
        var playersRef = firebase.database().ref("Eventos/"); 
        var a="";
        var b=""; 
        var coord="";
        var entra=true;
        var fecha;
        var finaliza;
        var empieza;
        var entra2=true;
        var cupo;

        playersRef.orderByChild("id").equalTo(id_evento).on("value", function(snapshot) {
          snapshot.forEach( item => {
          a=item.val().lat;
          b=item.val().lng;
          fecha=item.val().fecha;
          finaliza=item.val().horaFinal;
          empieza=item.val().horaInicio;
          cupo=item.val().cupo;
          return false;
          }); 
        });
      
        console.log(cupo);
        console.log(limite);
        if(cupo==limite){
          this.mensaje.mostrarMensaje(this.translateService.instant("COMPLETO"),this.translateService.instant("COMPLETO2"));
        }else{

          coord=a+", "+b;
          //console.log(coord);
          
          var empieza2 = empieza.split(":")[0];
          empieza2=empieza2.replace(/^0+/, '');
          console.log(empieza2);
      
          var apikey="AIzaSyBxViocR4sk3WK97iwIhrxzvwQ2xSSJGrk";
          var targetDate = new Date() // Current date/time of user computer
          var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
          var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + coord + '&timestamp=' + timestamp + '&key=' + apikey;
          var horaa;
          var cont=0;
          var dd=targetDate.getUTCDate();
          var mm=targetDate.getMonth()+1;;
          var yy=targetDate.getFullYear();
          var horaHoy;
          var that=this;
          var visto=true;
      
          if(dd<10) {
            var d=dd.toString();
            d = "0"+dd
          } 
          if(mm<10) {
          var m=mm.toString();
            m = "0"+mm
          } 
          if(d==undefined && m==undefined){
            horaHoy=yy+"-"+m+"-"+d;
          }else if(d==undefined && m!=undefined){
            horaHoy=yy+"-"+m+"-"+dd;
          }else if(d!=undefined && m==undefined){
            horaHoy=yy+"-"+mm+"-"+dd;
          }
          else{
            horaHoy=yy+"-"+mm+"-"+dd;
          }
      
          var xhr = new XMLHttpRequest(); 
          xhr.abort();
          xhr.open('GET', apicall);
          xhr.onload = function(){
              if (xhr.status === 200){ 
                      var output = JSON.parse(xhr.responseText);
                      //console.log(output);
                      var offsets = output.dstOffset * 1000 + output.rawOffset * 1000;
                      var localdate = new Date(timestamp * 1000 + offsets); 
                      var refreshDate = new Date(); 
                      var millisecondselapsed=refreshDate.getTime() - targetDate.getTime(); 
                      localdate.setMilliseconds(localdate.getMilliseconds()+millisecondselapsed); 
                      var hora;
      
                      var dd=localdate.getUTCDate();
                      var mm=localdate.getMonth()+1;;
                      var yy=localdate.getFullYear();
                      var hour=localdate.getHours();
                  
                      if(dd<10) {
                        var d=dd.toString();
                        d = "0"+dd
                      } 
                      if(mm<10) {
                      var m=mm.toString();
                        m = "0"+mm
                      } 
                      if(d==undefined && m==undefined){
                        hora=yy+"-"+mm+"-"+dd;
                      }else if(d==undefined && m!=undefined){
                        hora=yy+"-"+m+"-"+dd;
                      }else if(d!=undefined && m==undefined){
                        hora=yy+"-"+mm+"-"+d;
                      }
                      else{
                        hora=yy+"-"+m+"-"+d;
                      }
                      setInterval(function(){
                        if(visto==true){
                          localdate.setSeconds(localdate.getSeconds()+1);
                          //console.log("hora"+hora);
                          //console.log(fecha+" y la otra "+hora);
                         if(fecha==hora){
                            if(hour>empieza2){
                             // console.log("entra2");
                              if(entra){
                                that.mensaje.mostrarMensaje(that.translateService.instant("NO_PUEDES_APUNTAR"),that.translateService.instant("NO_PUEDES_APUNTAR2"));  
                                //that.pasar();this.translateService.instant("NOTI_APUNTADO")
                                entra=false;
                              }                         
                            }else{
                              if(entra2){
                                that.storage.get('id_user').then((id_user) =>{
                                  
                                        that.afDatabase.object(`Apuntados/${newKey}`).set({
                                          id: newKey,
                                          idUsuario: id_user,
                                          idEvento: id_evento 
                                        })
                                          that.sendNotification(id_user,id_evento);
                                      });
                                  
                                      that.mostrarToast();                 
                                      entra2=false;
                              }
                            }
                          }else{   
                            if(entra2){
                              that.storage.get('id_user').then((id_user) =>{
                                
                                      that.afDatabase.object(`Apuntados/${newKey}`).set({
                                        id: newKey,
                                        idUsuario: id_user,
                                        idEvento: id_evento 
                                      })
                                        that.sendNotification(id_user,id_evento);
                                    });
                                
                                    that.mostrarToast();          
                                    entra2=false;
                            }
                          }
                        } 
                      }, 1000);
                   }
              else{
                //alert('Request failed.  Returned status of ' + xhr.status)
              }    
          }
          xhr.send();
        }
        this.navCtrl.setRoot("HomePage")
    });
    }

    voteUp(id_evento) {
      
        var i=this.lista.length-1
        var id=this.lista[i].id;
        var limite=this.contar(id);
        var rootRef = firebase.database().ref().child("Apuntados");
        var newKey = rootRef.push().key;
        var cupo=this.lista[i].cupo;
      
        console.log(cupo);
        console.log(limite);
        if(cupo==limite){
          this.mensaje.mostrarMensaje(this.translateService.instant("COMPLETO"),this.translateService.instant("COMPLETO2"));
        }else{

          var a="";
          var b=""; 
          var coord="";
          var entra=true;
          var fecha;
          var finaliza;
          var empieza;
          var entra2=true;
      
          var playersRef = firebase.database().ref("Eventos/"); 
          playersRef.orderByChild("id").equalTo(id).on("value", function(snapshot) {
            snapshot.forEach( item => {
            a=item.val().lat;
            b=item.val().lng;
            fecha=item.val().fecha;
            finaliza=item.val().horaFinal;
            empieza=item.val().horaInicio;
            return false;
            }); 
          });
          coord=a+", "+b;
          //console.log(coord);
          
          var empieza2 = empieza.split(":")[0];
          empieza2=empieza2.replace(/^0+/, '');
          console.log(empieza2);
      
          var apikey="AIzaSyBxViocR4sk3WK97iwIhrxzvwQ2xSSJGrk";
          var targetDate = new Date() // Current date/time of user computer
          var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
          var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + coord + '&timestamp=' + timestamp + '&key=' + apikey;
          var horaa;
          var cont=0;
          var dd=targetDate.getUTCDate();
          var mm=targetDate.getMonth()+1;;
          var yy=targetDate.getFullYear();
          var horaHoy;
          var that=this;
          var visto=true;
      
          if(dd<10) {
            var d=dd.toString();
            d = "0"+dd
          } 
          if(mm<10) {
          var m=mm.toString();
            m = "0"+mm
          } 
          if(d==undefined && m==undefined){
            horaHoy=yy+"-"+m+"-"+d;
          }else if(d==undefined && m!=undefined){
            horaHoy=yy+"-"+m+"-"+dd;
          }else if(d!=undefined && m==undefined){
            horaHoy=yy+"-"+mm+"-"+dd;
          }
          else{
            horaHoy=yy+"-"+mm+"-"+dd;
          }
      
          var xhr = new XMLHttpRequest(); 
          xhr.abort();
          xhr.open('GET', apicall);
          xhr.onload = function(){
              if (xhr.status === 200){ 
                      var output = JSON.parse(xhr.responseText);
                      //console.log(output);
                      var offsets = output.dstOffset * 1000 + output.rawOffset * 1000;
                      var localdate = new Date(timestamp * 1000 + offsets); 
                      var refreshDate = new Date(); 
                      var millisecondselapsed=refreshDate.getTime() - targetDate.getTime(); 
                      localdate.setMilliseconds(localdate.getMilliseconds()+millisecondselapsed); 
                      var hora;
      
                      var dd=localdate.getUTCDate();
                      var mm=localdate.getMonth()+1;;
                      var yy=localdate.getFullYear();
                      var hour=localdate.getHours();
                  
                      if(dd<10) {
                        var d=dd.toString();
                        d = "0"+dd
                      } 
                      if(mm<10) {
                      var m=mm.toString();
                        m = "0"+mm
                      } 
                      if(d==undefined && m==undefined){
                        hora=yy+"-"+mm+"-"+dd;
                      }else if(d==undefined && m!=undefined){
                        hora=yy+"-"+m+"-"+dd;
                      }else if(d!=undefined && m==undefined){
                        hora=yy+"-"+mm+"-"+d;
                      }
                      else{
                        hora=yy+"-"+m+"-"+d;
                      }
                      setInterval(function(){
                        if(visto==true){
                          localdate.setSeconds(localdate.getSeconds()+1);
                          //console.log("hora"+hora);
                          console.log(fecha+" y la otra "+hora);
                         if(fecha==hora){
                            if(hour>empieza2){
                              console.log("entra2");
                              if(entra){
                                that.mensaje.mostrarMensaje(that.translateService.instant("NO_PUEDES_APUNTAR"),that.translateService.instant("NO_PUEDES_APUNTAR2"));  
                                //that.pasar();this.translateService.instant("NOTI_APUNTADO")
                                entra=false;
                              }                         
                            }else{
                              if(entra2){
                                that.storage.get('id_user').then((id_user) =>{
                                  
                                        that.afDatabase.object(`Apuntados/${newKey}`).set({
                                          id: newKey,
                                          idUsuario: id_user,
                                          idEvento: id 
                                        })
                                          that.sendNotification(id_user,id);
                                      });
                                  
                                      that.mostrarToast();                 
                                      entra2=false;
                              }
                            }
                          }else{   
                            if(entra2){
                              that.storage.get('id_user').then((id_user) =>{
                                
                                      that.afDatabase.object(`Apuntados/${newKey}`).set({
                                        id: newKey,
                                        idUsuario: id_user,
                                        idEvento: id 
                                      })
                                        that.sendNotification(id_user,id);
                                    });
                                
                                    that.mostrarToast();          
                                    entra2=false;
                            }
                          }
                        }
                      }, 1000);
                   }
              else{
                //alert('Request failed.  Returned status of ' + xhr.status)
              }    
          }
          xhr.send();

          this.lista.pop();

        }
      }

      sendNotification(idUser,idEvento) {  
        let body;
        var id_creador=""; 
        var token="";
        var nombre;
        var notificacion:boolean;
      
        var perf = firebase.database().ref("Perfil/");
        perf.orderByChild("id").equalTo(idUser).on("child_added", function(data) {
          nombre=data.val().nick;
        });
      
        var event = firebase.database().ref("Eventos/");
        event.orderByChild("id").equalTo(idEvento).on("child_added", function(data) {
          id_creador=data.val().idCreador
        });
        
          var tok = firebase.database().ref("pushtokens/");
          tok.orderByChild("uid").equalTo(id_creador).on("child_added", function(data) {
            token=data.val().devtoken;
          });
      
          var perf = firebase.database().ref("Perfil/");
          perf.orderByChild("id").equalTo(id_creador).on("child_added", function(data) {
            notificacion=data.val().notificaciones;
          });
      
      
          setTimeout(() => { 
            if(notificacion){  
         body = {
            "notification":{
              "title": this.translateService.instant("NOTI_APUNTADO"),
              "body": nombre+this.translateService.instant("APUNTADO_PLAN"),
              "sound":"default",
              "click_action":"FCM_PLUGIN_ACTIVITY",
              "icon":"https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/Marca-Fishbay.png?alt=media&token=2a8028ee-e472-4664-9a0f-85b6d35c61d8"
            },
            "data":{
              // 
            },
              "to": token,
              "priority":"high",
              "restricted_package_name":""
          }
      
          //console.log(body);
      
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'key=AAAA29Xafzs:APA91bEPixto3K-QNT1HWgtXEXRA9ICcDVAyQsEZRMejQZhD5QsOydqnXd7nqH5yJWA-S--G1aiIPm0ntU15oERoFaNDOT7uoaNoalTUmh7ts6kxe4Hu9Qc9jI1p6nLQzvVK4ShjRthS');
            const options = new RequestOptions({headers: headers});
            this.http.post("https://fcm.googleapis.com/fcm/send",body,options).subscribe(); 
        } else{
          console.log("usuario con notificaciones desactivadas");
        }
        }, 1200);  
      
      }

      permitirVotar(id,idCreador){
        if(idCreador!=this.idUsuario){
      
        var a="";
        var b=""; 
        var coord="";
        var entra=true;
        var fecha;
        var finaliza;
        var empieza;
        var entra2=true;
    
        var playersRef = firebase.database().ref("Eventos/"); 
        playersRef.orderByChild("id").equalTo(id).on("value", function(snapshot) {
          snapshot.forEach( item => {
          a=item.val().lat;
          b=item.val().lng;
          fecha=item.val().fecha;
          finaliza=item.val().horaFinal;
          empieza=item.val().horaInicio;
          return false;
          }); 
        });
        coord=a+", "+b;
        //console.log(coord);
        
        var empieza2 = empieza.split(":")[0];
        empieza2=empieza2.replace(/^0+/, '');
        console.log(empieza2);
    
        var apikey="AIzaSyBxViocR4sk3WK97iwIhrxzvwQ2xSSJGrk";
        var targetDate = new Date() // Current date/time of user computer
        var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
        var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + coord + '&timestamp=' + timestamp + '&key=' + apikey;
        var horaa;
        var cont=0;
        var dd=targetDate.getUTCDate();
        var mm=targetDate.getMonth()+1;;
        var yy=targetDate.getFullYear();
        var horaHoy;
        var that=this;
        var visto=true;
    
        if(dd<10) {
          var d=dd.toString();
          d = "0"+dd
        } 
        if(mm<10) {
        var m=mm.toString();
          m = "0"+mm
        } 
        if(d==undefined && m==undefined){
          horaHoy=yy+"-"+m+"-"+d;
        }else if(d==undefined && m!=undefined){
          horaHoy=yy+"-"+m+"-"+dd;
        }else if(d!=undefined && m==undefined){
          horaHoy=yy+"-"+mm+"-"+dd;
        }
        else{
          horaHoy=yy+"-"+mm+"-"+dd;
        }
    
        var xhr = new XMLHttpRequest(); 
        xhr.abort();
        xhr.open('GET', apicall);
        xhr.onload = function(){
            if (xhr.status === 200){ 
                    var output = JSON.parse(xhr.responseText);
                    //console.log(output);
                    var offsets = output.dstOffset * 1000 + output.rawOffset * 1000;
                    var localdate = new Date(timestamp * 1000 + offsets); 
                    var refreshDate = new Date(); 
                    var millisecondselapsed=refreshDate.getTime() - targetDate.getTime(); 
                    localdate.setMilliseconds(localdate.getMilliseconds()+millisecondselapsed); 
                    var hora;
    
                    var dd=localdate.getUTCDate();
                    var mm=localdate.getMonth()+1;;
                    var yy=localdate.getFullYear();
                    var hour=localdate.getHours();
                
                    if(dd<10) {
                      var d=dd.toString();
                      d = "0"+dd
                    } 
                    if(mm<10) {
                    var m=mm.toString();
                      m = "0"+mm
                    } 
                    if(d==undefined && m==undefined){
                      hora=yy+"-"+mm+"-"+dd;
                    }else if(d==undefined && m!=undefined){
                      hora=yy+"-"+m+"-"+dd;
                    }else if(d!=undefined && m==undefined){
                      hora=yy+"-"+mm+"-"+d;
                    }
                    else{
                      hora=yy+"-"+m+"-"+d;
                    }
                    setInterval(function(){
                      if(visto==true){
                        localdate.setSeconds(localdate.getSeconds()+1);
                        //console.log("hora"+hora);
                        console.log(fecha+" y la otra "+hora);
                       if(fecha==hora){
                          if(hour>empieza2){
                            console.log("entra2");
                            if(entra){
                              const myModal=that.modal.create("VotarPage", { id: idCreador, idEvento:id });
                              myModal.present();
                              //enviar notificaciones de que pueden votar
                              that.notificacionVoto(id);
                              myModal.onDidDismiss(() => {
                                setTimeout(() => {
                                  that.comprobarVotado(id);
                                }, 1000);
                                
                              });
                              entra=false;
                            }                         
                          }else{
                            if(entra2){
                            that.mensaje.mostrarMensaje(that.translateService.instant("NO_PUEDES_APUNTAR"),that.translateService.instant("NO_PUEDES_APUNTAR2"));                   
                            entra2=false;
                            }
                          }
                        }else{   
                          if(entra2){
                          that.mensaje.mostrarMensaje(that.translateService.instant("NO_PUEDES_APUNTAR"),that.translateService.instant("NO_PUEDES_APUNTAR2"));            
                          entra2=false;
                          }
                        }
                      }
                    }, 1000);
                 }
            else{
              //alert('Request failed.  Returned status of ' + xhr.status)
            }    
        }
        xhr.send();
      }else{
        this.mensaje.mostrarMensaje(this.translateService.instant("NO_VOTE"),this.translateService.instant("NO_VOTE2")); 
      }

    }

      notificacionVoto(id){
        let votaciones=[];

          var ref = firebase.database().ref("Votos/");
          ref.orderByChild('idEvento').equalTo(id).on('value', function(snapshot) { 
            //console.log(snapshot.val());
            snapshot.forEach( item => {
              votaciones.push(item.val());
              return false;
            }); 
          });

          if(votaciones.length==0){
            this.EnviarNotificacionVoto(id);
          }else{
            console.log("no se envia");
          }

      }


      EnviarNotificacionVoto(idEvento){
        var ap=[];
        var apt=[];
        var cont=0;
             
              var ref = firebase.database().ref("Apuntados");
                ref.orderByChild('idEvento').equalTo(idEvento).on('value', function(snapshot) {
                  console.log(snapshot.val()); 
                  snapshot.forEach( item => {
                    ap.push(item.val());
                    return false;
                  }); 
              });
            
            setTimeout(() => {
    
              console.log(ap);
              console.log(ap.length);
 
              for(var i=0;i<ap.length;i++){
                  if(ap[i]['idEvento']==idEvento){                  
                      this.sendNotificationVoto(ap[i]['idEvento'],ap[i]['idUsuario']);
                      cont++;                     
                  }
              } 

          }, 1000);

      }


      sendNotificationVoto(idEvento,idUser) {  
        let body;
        var id_creador="";
        var token="";
        var notificacion:boolean;
        var nombreE;
    
        firebase.database().ref('Eventos/').orderByChild("id").equalTo(idEvento).on("child_added", function(data) {
            nombreE=data.val().nombre;
        });
    
          var tok = firebase.database().ref("pushtokens/");
          tok.orderByChild("uid").equalTo(idUser).on("child_added", function(data) {
            token=data.val().devtoken;
          });
      
          var perf = firebase.database().ref("Perfil/");
          perf.orderByChild("id").equalTo(idUser).on("child_added", function(data) {
            notificacion=data.val().notificaciones;
          });
    
          setTimeout(() => { 
    
            if(notificacion){  
         body = {
            "notification":{
              "title": this.translateService.instant("NOTI_VOTAR"),
              "body": this.translateService.instant("PLAN")+nombreE+this.translateService.instant("VOTAR"),
              "sound":"default",
              "click_action":"FCM_PLUGIN_ACTIVITY",
              "icon":"./assets/img/logo.png"
            },
            "data":{
              // 
            },
              "to": token,
              "priority":"high",
              "restricted_package_name":""
          }
        
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'key=AAAA29Xafzs:APA91bEPixto3K-QNT1HWgtXEXRA9ICcDVAyQsEZRMejQZhD5QsOydqnXd7nqH5yJWA-S--G1aiIPm0ntU15oERoFaNDOT7uoaNoalTUmh7ts6kxe4Hu9Qc9jI1p6nLQzvVK4ShjRthS');
            const options = new RequestOptions({headers: headers});
            this.http.post("https://fcm.googleapis.com/fcm/send",body,options).subscribe(); 
        } else{
          console.log(idUser+" usuario con notificaciones desactivadas");
        }
        }, 2000);  
      
      }





  }


