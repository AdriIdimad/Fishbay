import { Evento } from './../../models/evento';
import { Component,ElementRef } from '@angular/core';
import { NavController, Nav,NavParams, IonicPage,Content , App} from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Http } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database'; 
import {ViewChild, ViewChildren, QueryList } from '@angular/core';
import {StackConfig,Stack,Card,ThrowEvent,Direction,DragEvent,SwingStackComponent,SwingCardComponent} from 'angular2-swing';
import { MenuController} from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import { LoadingController } from 'ionic-angular';
import { configuracionPage } from './../configuracion/configuracion';
import { AlertController } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Observable } from "rxjs/Rx"; 
import 'rxjs/Rx'; 
import { Headers,RequestOptions } from '@angular/http';
import { User } from './../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { log } from 'util';
      
/**        
 * Generated class for the IzqPage page.
 * 
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.  
 */ 
           
@IonicPage()        
@Component({ 
  selector: 'page-izq',  
  templateUrl: 'izq.html',
})    
             
   
export class IzqPage {

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: ElementRef;
     
     
  ListaFiltrada: Array<any>; 
  cards: Array<any>;
  stackConfig: StackConfig;  
  recentCard: string = '';
  public loaded:boolean;
  public mostrarUltimo:boolean;
  public entra:boolean; 
  public rate : any=0; 
  public cont:number;
  public cont2:number;
  public contAnuncios:number;
  public accion:number; 
  public idEnventoDetalles:string;
  public listaFinal: Array<any>; 
   
  evento = {} as Evento;
  eventos: FirebaseListObservable<any[]>;
   
  public apun:boolean;        
  public eventList:Array<any>;
  public eventList2:Array<any>;    
  public loadedeventList:Array<any>;
  public loadedeventList2:Array<any>;    
  public loadedBueno:Array<any>;
  public imagenes:Array<any>;
  public finalizado:boolean;
  public eventRef:firebase.database.Reference= firebase.database().ref('/Eventos');
  perfilData: FirebaseObjectObservable<User>;

  constructor(private admob: AdMobFree,public translateService: TranslateService,private httpC:Http,private alertCtrl: AlertController,public loading: LoadingController,public menuCtrl: MenuController,public mensaje: Funciones_utilesProvider, public fallo: Funciones_utilesProvider, private ofAuth: AngularFireAuth,
    public navCtrl: NavController,public nav: Nav, public navParams: NavParams,public app: App, private afDatabase: AngularFireDatabase, private storage: Storage,private http: Http,public Facebook:Facebook) {
      this.loaded=false;
      this.entra=false;
      this.apun=false;
      this.mostrarUltimo=true;
      this.finalizado=false;
      this.cont=0;   
      this.cont2=0;
      this.contAnuncios=0;
      this.menuCtrl = menuCtrl;
      //this.cargarNoapuntado();


      this.stackConfig = {
        allowedDirections: [
          Direction.LEFT,
          Direction.RIGHT
        ],
        throwOutConfidence: (offsetX, offsetY, element) => {
          return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);// un 2 en 0.5
        },
        transform: (element, x, y, r) => {
          this.onItemMove(element, x, y, r);
        },
        throwOutDistance: (d) => {
          return 900; //800
        }
      }; 
 
      this.storage.get('idioma').then((idioma) =>{
        this.translateService.use(idioma);
      });
    
  }  
  
  launchInterstitial() {
    
           let interstitialConfig: AdMobFreeInterstitialConfig = {
               isTesting: true, // Remove in production
               autoShow: true,
               id: 'ca-app-pub-6644524226406908/7389573468'
           };
    
           this.admob.interstitial.config(interstitialConfig);
    
           this.admob.interstitial.prepare().then(() => {
            this.admob.interstitial.show();
           }).catch(e => alert(e));;
     
       }

cargado(){
  this.finalizado=true;
  if(document.getElementsByName("cartas")){
    document.getElementsByName("cartas")[0].click();
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
        "icon":"fcm_push_icon"
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
  }, 1000);  
  
}

apuntado(id_evento){
  var snap;
  var apuntados=[];

  setTimeout(() => {
    this.storage.get('id_user').then((id_user) =>{
      var ref = firebase.database().ref("Apuntados");
      ref.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
          snapshot.forEach( item => {
          apuntados.push(item.val());  
          return false;
      });
      console.log(apuntados);
    });
  });

  }, 500);
  return true;

}
  
  openMenu() {
    this.menuCtrl.open();
  }

  onModelChange(event){
    this.rate = event;
    console.log(event);
    }

  busqueda(){
    this.navCtrl.push('configuracionPage');    
  }

  ionViewDidLoad() {
    this.ListaFiltrada=this.navParams.get("listaFiltrada");

    if(this.ListaFiltrada==undefined){
      console.log("lista sin filtrar");
      this.addNewCards(1);  
    }else if(this.ListaFiltrada.length==0){
      console.log("lista con todo");
      this.addNewCards(1);
    }else{
      console.log("lista filtrando");
      //this.loadedeventList=this.ListaFiltrada;
      this.storage.set('planes', this.ListaFiltrada);
      this.loadedeventList = [];
  
      for(var i=0;i<this.ListaFiltrada.length;i++){ 
        if(i<3){
          this.loadedeventList.push(this.ListaFiltrada[i]);
          this.storage.set('planesCargados',i+2); 
        }else{
          break;
        }
      } 
      this.loadedeventList.reverse();
      //console.log(this.loadedeventList);
    }

  }
 

  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });
    this.cards=[]; 
  
  }

  cogerImagen(id){
    var playersRef = firebase.database().ref("Perfil/");
    var src;
    playersRef.orderByChild("id").equalTo(id).on("child_added", function(data) {
       src=data.val().imagen;
    });
    return src;
  }  
 
  cogerPuntuacion(id){
    var playersRef = firebase.database().ref("Perfil/");
    var src;
    var pt;  
    playersRef.orderByChild("id").equalTo(id).on("child_added", function(data) {
       pt=data.val().puntuacion;
    });

    return pt;
    
  }

  initializeItems(): void {
  //this.eventList = this.loadedeventList;
  }

  out(){
    let loading = this.loading.create({
      content: 'Cerrando sesión...'
    });
  
    loading.present();
  
    setTimeout(() => {

      this.storage.remove('id_user');
      this.Facebook.logout();
      this.Facebook=null;
      firebase.auth().signOut();
      this.app.getRootNav().setRoot('LoginPage'); 
      loading.dismiss();
    }, firebase.auth().signOut(),this.Facebook.logout());
  
  }

  goprofile(){
    this.app.getRootNav().push('PerfilPage');
  }
s
  detallesEvento(id){
    this.storage.set('id_evento',id);
    this.nav.push('EventoPage',{lista:this.loadedeventList});
  }

  verApuntados(idEvento){
    this.navCtrl.push('ApuntadosPage',{idEvento:idEvento});
  }

  
  goChat(){ 
      this.app.getRootNav().push('ChatPage'); 
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
  

  getItems(searchbar) { 
  // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.eventList = this.eventList.filter((v) => {
      if(v.nombre && q) {
        if (v.nombre.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.eventList.length);
 
}
mostrarToast(){
  this.mensaje.mostrarMensaje(this.translateService.instant("APUNTADO_AL_PLAN"),this.translateService.instant("APUNTADO_AL_PLAN2"));
}


onItemMove(element, x, y, r) {
  
  var color = '';
  var abs = Math.abs(x);
  let min = Math.trunc(Math.min(16*16 - abs, 16*16));
  let hexCode = this.decimalToHex(min, 2);
  
  if (x < 0) {
    color = '#FF' + hexCode + hexCode;
    //element.innerHTML="<p>Me apunto!</p>"
  } else {
    color = '#' + hexCode + 'FF' + hexCode;
    
  }
  
  element.style.background = color;
  element.style.borderColor = color;
  element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
}
 
// Connected through HTML
voteSwipe(){

  var i=this.loadedeventList.length-1
  var id=this.loadedeventList[i].id;
  var limite=this.contar(id);
  var cupo=this.loadedeventList[i].cupo;
  var rootRef = firebase.database().ref().child("Apuntados");
  var newKey = rootRef.push().key;

  console.log(cupo);
  console.log(limite);
  if(cupo==limite){
    this.mensaje.mostrarMensaje(this.translateService.instant("COMPLETO"),this.translateService.instant("COMPLETO2"));
    this.pasar();
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
  
    this.storage.get('planes').then((arrayPlanes) =>{
      this.storage.get('planesCargados').then((ContCargados) =>{
        console.log("contador cargados: "+ContCargados);      
        var final=0;
        do{
          if(ContCargados==4){
            console.log("entra");
            this.loadedeventList.pop();
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }else{
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }

          if((ContCargados+1)>arrayPlanes.length){
            final=1; 
          }

        }while(this.loadedeventList.length<3 && final!=1);

        if(ContCargados>arrayPlanes.length+2){
          this.mostrarUltimo=false;
        }else{
          setTimeout(() => {
			if(this.loadedeventList.length>0 ){
            document.getElementsByName("cartas")[0].focus();
			}
          }, 300);
            
        }
 
      });

    }); 

    this.contAnuncios++;
    
  }
}

voteUp(id_evento) {

  var i=this.loadedeventList.length-1
  var id=this.loadedeventList[i].id;
  var limite=this.contar(id);
  var cupo=this.loadedeventList[i].cupo;
  var rootRef = firebase.database().ref().child("Apuntados");
  var newKey = rootRef.push().key;

  console.log(cupo);
  console.log(limite);
  if(cupo==limite){
    this.mensaje.mostrarMensaje(this.translateService.instant("COMPLETO"),this.translateService.instant("COMPLETO2"));
    this.pasar();
    
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
                          //that.pasar();
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



    this.storage.get('planes').then((arrayPlanes) =>{
      this.storage.get('planesCargados').then((ContCargados) =>{
        console.log("contador cargados: "+ContCargados);      
        var final=0;
        do{ 
          if(ContCargados==4){
            console.log("entra");
            this.loadedeventList.pop();
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }else{
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }

          if((ContCargados+1)>arrayPlanes.length){
            final=1; 
          }

        }while(this.loadedeventList.length<3 && final!=1);

        if(ContCargados>arrayPlanes.length+2){
          this.mostrarUltimo=false;
        }else{
          setTimeout(() => {
           if(this.loadedeventList.length>0 ){
            document.getElementsByName("cartas")[0].focus();          
          }
          }, 300);
            
        }
 
      });

    }); 

  }
}

async pasar(){
  var pasar=0;

    this.storage.get('planes').then((arrayPlanes) =>{
      this.storage.get('planesCargados').then((ContCargados) =>{
        console.log("contador cargados: "+ContCargados);      
        var final=0;
        do{
          if(ContCargados==4){
            this.loadedeventList.pop();
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }else{
            this.loadedeventList=arrayPlanes.slice(ContCargados-3, ContCargados);
            this.loadedeventList.reverse();
            this.storage.set('planesCargados',(ContCargados+1)); 
            console.log(this.loadedeventList);
          }

          if((ContCargados+1)>arrayPlanes.length){
            final=1;  
          }

        }while(this.loadedeventList.length<3 && final!=1);

        if(ContCargados>arrayPlanes.length+2){
          this.mostrarUltimo=false;
          pasar=1;
        }


      }); 

    });

    if(this.loadedeventList.length>0 && pasar==0){
      await document.getElementsByName("cartas")[0].click();
      console.log("click pasar");
    }
            

  //this.contAnuncios++;
  
  /*if(this.contAnuncios==3){
    this.launchInterstitial();
    this.contAnuncios=0;
  }*/
}

// Add new cards to our array
addNewCards(count: number) {
  
  /*let loader = this.loading.create({
    content: 'Cargando..',
  });*/

  /*loader.present().then(() => {*/

    var b=[];
    var a=[];
    var c=[];
    var d=[];
    var e=[];
    var foco=0;

   this.storage.get('id_user').then((id_user) =>{

    var that=this; 

    var playersRef = firebase.database().ref("Apuntados/"); 
    playersRef.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
      snapshot.forEach( item => {
      a.push(item.val());
      return false; 
      }); 
    });

    
    var ref = firebase.database().ref("Eventos/");
    ref.on("child_added", function(snapshot) {
        c.push(snapshot.val());

    });


    var playersRef = firebase.database().ref("bloqueados/"); 
    playersRef.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
      snapshot.forEach( item => {
      d.push(item.val());
      return false;
      }); 
    });

   setTimeout(() => {

    console.log("apuntados");
    console.log(a);

    console.log("eventos");
    console.log(c);

    for(var i=0;i<a.length;i++){
      var index = c.findIndex(function(el) {     
        return el.id == a[i]['idEvento'];        
      });
      console.log(index);
      if(index!=-1){
      c.splice(index,1);
      }
    }   
  
    console.log("quito a los que esta Apuntado");
    console.log(c);

    console.log("longitud"+c.length);
    var cont=0;

    var array = [];
    var array2= [];
    for (var i = 0; i < c.length; i++) {
        var igual=false;
        for (var j = 0; j < d.length && !igual; j++) {
            if(c[i]['idCreador'] == d[j]['idBloqueado']) 
                    igual=true;
        }
        if(!igual)array.push(c[i]);
    }
 
    console.log("Quito los que tiene bloqueados");
    console.log(array);
    array.reverse();
    //modificado
    this.storage.set('planes', array);
    this.loadedeventList = [];

    for(var i=0;i<array.length;i++){ 
      if(i<3){
        this.loadedeventList.push(array[i]);
        this.storage.set('planesCargados',i+2); 
      }else{
        break;
      }
    } 
    this.loadedeventList.reverse();

    //this.loadedeventList=array2;
    console.log("Final");
    console.log(this.loadedeventList); 

    if(this.loadedeventList.length==0){
      this.mostrarUltimo=false;
      foco=1;
    }
    if(this.loadedeventList.length>0 && foco==0){
      setTimeout(() => {
        document.getElementsByName("cartas")[0].click();
        console.log("click");
      }, document.getElementsByName("cartas")[0]);
      

    }

    
  }, 1200);
  
  
});



 
}

foco(){
  document.getElementsByName("cartas")[0].click();
  console.log("foco");
}
  
decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  
  while (hex.length < padding) {
    hex = "0" + hex;  
  }
  
  return hex;
}  

 
recargar(){
  this.finalizado=false; 
  this.mostrarUltimo=true;
  this.addNewCards(1);
}

verPerfil(id){
 
  this.navCtrl.push('VerPerfilPage',{id: id });
}

}
   