import { FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, Nav ,NavParams, IonicPage,App } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActionSheetController} from 'ionic-angular';
import { count } from 'ionic-native/node_modules/rxjs/operator/count';
import { Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Headers,RequestOptions } from '@angular/http';


/** 
 * Generated class for the CntPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cnt',
  templateUrl: 'cnt.html',
})
export class CntPage {
  tusEventos: string = "tu";
  public eventList:Array<any>;

  selectedDay = new Date()
  selectedObject
  eventSource = []
  viewTitle;
  isToday: boolean;
  calendarModes = [
    { key: 'month', value: 'Month' },
    { key: 'week', value: 'Week' },
    { key: 'day', value: 'Day' },
  ]
  calendar = {
    mode: this.calendarModes[0].key,
    currentDate: new Date()
  }; // these are the variable used by the calendar.
  
  eventosUser: FirebaseListObservable<any[]>;
  public eventosApuntados: FirebaseListObservable<any[]>;
  public eventos: FirebaseListObservable<any[]>;
  public cadena: string;
  public apuntados:Array<any>;
  mostrarApuntados:Array<any>;
  public eventRef:firebase.database.Reference;
  public loadedeventList:Array<any>;
  public final:Array<any>=[];
  public info:Array<any>=[];
  public infoUser:Array<any>;
  public userRef:firebase.database.Reference;
  public finalUser:Array<any>;
  public listo:boolean;
  public hora:String;
  public usuario:string;
  public finalizado:boolean;
  public apuntado:boolean=false;

  constructor(public nav: Nav,public alertCtrl: AlertController,public loading: LoadingController,private http: Http,platform: Platform,public navCtrl: NavController,private actionSheetCtrl: ActionSheetController, public navParams: NavParams, public app: App, public storage: Storage,public afDatabase: AngularFireDatabase) {
    this.tusEventos="Apt"; 
    this.finalizado=false;
  }


  ionViewWillEnter() {
      //mis eventos creados
      var usuario;
      this.storage.get('id_user').then((id_user) =>{


        this.usuario=id_user;
        this.eventosUser = this.afDatabase.list('/Eventos', {
        query: {
          orderByChild: 'idCreador',
          equalTo: id_user //pasar variable id local
        }
        
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

    });
    this.loadEvents();
  }

  comprobarApuntado(id){
    let comprobar=[];
    
      var ref = firebase.database().ref("Apuntados");
      ref.orderByChild('idUsuario').equalTo(this.usuario).on('value', function(snapshot) { 
        console.log(snapshot.val());
        snapshot.forEach( item => {
          comprobar.push(item.val());
          return false;
        }); 
      });

        for(var i=0;i<comprobar.length;i++){
          console.log("recorremos");
          if(comprobar[i]['idEvento']==id){
            console.log("apuntado");
             this.apuntado=true;
             break;
          }else{
            this.apuntado=false;
            console.log("no apuntado");
          }
        }
  
        if(this.apuntado){
          return false;
        }else{
          return true;
        }
        
  }

  cargar(fecha){
    let a=[];
    let b=[];

    this.storage.get('id_user').then((id_user) =>{

      //mostrar solo los apuntados de la fecha seleccionada en el calendario.
      /*var playersRef = firebase.database().ref("Apuntados/");
      playersRef.orderByChild("idUsuario").equalTo(id_user).on("child_added", function(data) {
         //console.log(data.val().idEvento);
         a.push(data.val().idEvento);

        var aRef = firebase.database().ref("Eventos/");
        aRef.orderByChild("id").equalTo(data.val().idEvento).on("child_added", function(data) {
             var valor = data.val();
             if (valor.fecha==fecha) {
                 //console.log(valor);
                 b.push(data.val());
             }
        
          b.reverse();
          
        });  
        
      });*/ 

      var aRef = firebase.database().ref("Eventos/");
      aRef.orderByChild("id").on("child_added", function(data) {
           var valor = data.val();
           if (valor.fecha==fecha) {
               //console.log(valor);
               b.push(data.val());
           }
      
        b.reverse();
        
      }); 

     });
     this.info=[];
     console.log(b);
     this.info=b;

  } 

  out(){ 
    this.storage.remove('id_user');
    
    this.app.getRootNav().setRoot('LoginPage');
  }
  goprofile(){
    this.app.getRootNav().push('PerfilPage');
   
  }

  detallesEvento(idEvento){
    this.storage.set('id_evento',idEvento);
    this.nav.push('EventoPage',{calendario: true});

  }

  desapuntarse(idEvento){ 

    var elim=[];

    this.storage.get('id_user').then((id_user) =>{
      var ref = firebase.database().ref("Apuntados");
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
          if(elim[i]['idEvento']==idEvento){
            firebase.database().ref('/Apuntados').child(elim[i]['id']).remove();
          }
      }
 
  });
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
         
       //this.cargar();
      // this.navCtrl.push('CntPage');
       //this.navCtrl.setRoot('CntPage');
  }

  eliminar(idEvento){
    
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

          this.storage.get('id_user').then((id_user) =>{

          for(var i=0;i<ap.length;i++){
              if(ap[i]['idEvento']==idEvento){                  
                  this.sendNotification(ap[i]['idEvento'],ap[i]['idUsuario']);
                  cont++;                     
              }
          } 

        });

          for(var i=0;i<ap.length;i++){
            if(ap[i]['idEvento']==idEvento){
              firebase.database().ref('/Apuntados').child(ap[i]['id']).remove();
            }
          }



          firebase.database().ref('/Eventos').child(idEvento).remove();
      }, 1000);
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  sendNotification(idEvento,idUser) {  
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

        if(notificacion && nombreE!=undefined){  
     body = {
        "notification":{
          "title": "Se ha Eliminado un plan",
          "body": "El plan "+nombreE+ " ha sido cancelado. Consulta tu calendario",
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

  loadEvents() {

    let events = this.eventSource;
    var fecha1;
    var fecha2;
    var a=[];
    var b=[];

    this.storage.get('id_user').then((id_user) =>{
      
    var playersRef = firebase.database().ref("Apuntados/");
      
      playersRef.orderByChild("idUsuario").equalTo(id_user).on("child_added", function(data) {
         //console.log(data.val().idEvento);
         a.push(data.val().idEvento);
         b=[];
        var aRef = firebase.database().ref("Eventos/");
        aRef.orderByChild("id").equalTo(data.val().idEvento).on("child_added", function(data) {
         // console.log(data.val());
          b.push(data.val());
          b.reverse();

          fecha1=data.val().fecha+" "+data.val().horaInicio+":00";
          fecha2=data.val().fecha+" "+data.val().horaFinal+":00";

          events.push({
            title:  data.val().nombre,
            startTime: new Date(fecha1),
            endTime: new Date(fecha2),
            allDay: false
          });
        
        }); 
      });        
     });

    // this.info=b;

     console.log(b);

  /*  let dateString = '2018-06-1 10:00:00' 
    let newDate = new Date(dateString);
    let dateString2 = '2018-06-1 14:00:00' 
    let newDate2 = new Date(dateString2);*/

       
    this.eventSource = [];

    setTimeout(() => {
      this.eventSource = events;
      this.listo=true;
      this.finalizado=true;
    }, 800);
  }

  onViewTitleChanged(title) {
      this.viewTitle = title;
  }

  onEventSelected(event) {

    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    console.log(this.calendar.currentDate = new Date());
  } 

  onTimeSelected(ev) {

    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);

      var cambiar =new Date(ev.selectedTime);

      var mes;
      var dia;

      if(cambiar.getMonth()<10){
        mes=0+""+(cambiar.getMonth()+1);
      }else{
        mes=(cambiar.getMonth()+1);
      }

      if(cambiar.getDate()<10){
        dia=0+""+cambiar.getDate();
      }else{
        dia=cambiar.getDate();
      }

      var final=cambiar.getFullYear()+"-"+mes+"-"+dia;

    //console.log(final);

    this.selectedObject = ev
    
    
    //this.openActionSheet(ev)

  }

  onCurrentDateChanged(event: Date) {
    /*var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
    this.selectedDay = event*/
    var mes;
    var dia;

    if((event.getMonth()+1)<10){
      mes=0+""+(event.getMonth()+1);
    }else{
      mes=(event.getMonth()+1);
    }

    if((event.getDate()+1)<10){
      dia=0+""+event.getDate();
    }else{
      dia=event.getDate();
    }

    var final=event.getFullYear()+"-"+mes+"-"+dia;

    this.cargar(final);
    
  }

  onRangeChanged(ev) {
    //console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (date < current);
  };

  onOptionSelected($event: any) {
    //console.log($event)
    //this.calendar.mode = $event
  }


  permitirDesapuntar(id){
    var a="";
    var b="";
    var coord="";
    var entra=true;
    var fecha;
    var finaliza;

    var playersRef = firebase.database().ref("Eventos/"); 
    playersRef.orderByChild("id").equalTo(id).on("value", function(snapshot) {
      snapshot.forEach( item => {
      a=item.val().lat;
      b=item.val().lng;
      fecha=item.val().fecha;
      finaliza=item.val().horaFinal;
      return false;
      }); 
    });
    coord=a+", "+b;
    console.log(coord);

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
    var cont=0;

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
                console.log(output);
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000;
                var localdate = new Date(timestamp * 1000 + offsets); 
                var refreshDate = new Date(); 
                var millisecondselapsed=refreshDate.getTime() - targetDate.getTime(); 
                localdate.setMilliseconds(localdate.getMilliseconds()+millisecondselapsed); 
                var hora;

                var dd=localdate.getUTCDate();
                var mm=localdate.getMonth()+1;;
                var yy=localdate.getFullYear();
            
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
                    //console.log("fecha"+fecha);
                    if(fecha==hora){        
                            let alert = that.alertCtrl.create({
                              title: 'No te puedes desapuntar de este plan',
                              subTitle: 'Te puedes desapuntar con un máximo de antelación de 24h',
                              buttons: ['Ok']
                            });
                            alert.present();
                            visto=false;
                          }else if(cont==0){
                            cont++;
                            that.desapuntarse(id);
                          } 
                    console.log(localdate.toLocaleTimeString());
                        }
                }, 1000);
             }
        else{
            console.log('Request failed.  Returned status of ' + xhr.status)
        }    
    }
    xhr.send();

  }

  permitirEliminar(id){
    var a="";
    var b="";
    var coord="";
    var entra=true;
    var fecha;
    var finaliza;

    var playersRef = firebase.database().ref("Eventos/"); 
    playersRef.orderByChild("id").equalTo(id).on("value", function(snapshot) {
      snapshot.forEach( item => {
      a=item.val().lat;
      b=item.val().lng;
      fecha=item.val().fecha;
      finaliza=item.val().horaFinal;
      return false;
      }); 
    });
    coord=a+", "+b;
    //console.log(coord);

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
                    if(fecha==hora){        
                            let alert = that.alertCtrl.create({
                              title: 'No puedes eliminar este evento',
                              subTitle: 'Se puede eliminar con un máximo de antelación de 24h',
                              buttons: ['Ok']
                            });
                            alert.present();
                            visto=false;
                          }else if(cont==0){
                            cont++;
                            that.eliminar(id);
                            //that.navCtrl.setRoot(that.navCtrl.getActive().component);
                          } 
                    //console.log(localdate.toLocaleTimeString());
                        }
                }, 1000);
             }
        else{
          that.eliminar(id);
          //alert('Request failed.  Returned status of ' + xhr.status)
        }    
    }
    xhr.send();


    /*let d = new Date();
    let localTime = d.getTime();
    let localOffset = d.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    return true;*/
  }


}
