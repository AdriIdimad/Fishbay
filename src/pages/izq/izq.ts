import { Evento } from './../../models/evento';
import { Component } from '@angular/core';
import { NavController, Nav,NavParams, IonicPage,Content , App} from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth} from "angularfire2/auth";
import { Http } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { SocialSharing } from '@ionic-native/social-sharing'; 
import {ViewChild, ViewChildren, QueryList } from '@angular/core';
import {StackConfig,Stack,Card,ThrowEvent,DragEvent,SwingStackComponent,SwingCardComponent} from 'angular2-swing';
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
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
     
     
  ListaFiltrada: Array<any>; 
  cards: Array<any>;
  stackConfig: StackConfig; 
  recentCard: string = '';
  defaultImage: string = "https://img.freepik.com/psd-gratis/diseno-de-fondo-abstracto_1297-82.jpg?size=664&ext=jpg";
  public loaded:boolean;
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

  constructor(private admob: AdMobFree,private translateService: TranslateService,private httpC:Http,private alertCtrl: AlertController,public loading: LoadingController,public menuCtrl: MenuController,public mensaje: Funciones_utilesProvider, public fallo: Funciones_utilesProvider,private socialSharing: SocialSharing, private ofAuth: AngularFireAuth,
    public navCtrl: NavController,public nav: Nav, public navParams: NavParams,public app: App, private afDatabase: AngularFireDatabase, private storage: Storage,private http: Http,public Facebook:Facebook) {
      this.loaded=false;
      this.entra=false;
      this.apun=false;
      this.finalizado=false;
      this.cont=0;  
      this.cont2=0;
      this.contAnuncios=0;
      this.menuCtrl = menuCtrl;
      //this.cargarNoapuntado();
      this.stackConfig = {
        throwOutConfidence: (offsetX, offsetY, element) => {
          return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
        },
        transform: (element, x, y, r) => {
          this.onItemMove(element, x, y, r);
        },
        throwOutDistance: (d) => {
          return 800;
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
}


sendNotification(idUser,idEvento) {  
  let body;
  var id_creador=""; 
  var token="";
  var nombre;
  var notificacion:boolean;

  var perf = firebase.database().ref("Perfil/");
  perf.orderByChild("id").equalTo(idUser).on("child_added", function(data) {
    nombre=data.val().nombre;
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
        "title": "Se han apuntado a tu plan!!",
        "body": nombre+" se ha apuntado a tu plan",
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

    /*this.storage.get('id_user').then((id_user) =>{
    var ref = firebase.database().ref("Apuntados");
    ref.orderByChild("idEvento").equalTo(id_evento).on("value", function(snapshot) {
        snap=snapshot.val();
        console.log(snap);
        for(let index in snap){ 
          if(snap.idUsuario==id_user){
            ee=true;
          }else{
            ee=false;
          }
        }
    }); 
  }); */

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

  ionViewWillEnter() {

/*
    this.ListaFiltrada=this.navParams.get("listaFiltrada");
    this.listaFinal=this.navParams.get("listaFinal");
    this.idEnventoDetalles=this.navParams.get("idEventoD");

    if(this.ListaFiltrada==undefined){

      if(this.listaFinal==undefined){
        console.log("lista sin filtrar");
        this.addNewCards(1);
      }else{
        if(this.idEnventoDetalles==undefined){
          //this.loadedeventList=this.listaFinal;       
        }else{
          this.voteUp(this.idEnventoDetalles);
        }
      
      }

    }else if(this.ListaFiltrada.length==0){
      console.log("lista con todo");
      this.addNewCards(1);
    }else{
      console.log("lista filtrando");
      this.loadedeventList=this.ListaFiltrada;
    }*/
    //this.addNewCards(1);
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
      this.loadedeventList=this.ListaFiltrada;
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

    setTimeout(() => {
      this.rate=pt;
    }, 1000);

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

  sharee(mensaje,imagen,url){
    this.socialSharing.share("Apuntate a este evento: "+mensaje,imagen,this.app.getRootNav().push('HomePage'));
  }

  share(mensaje,imagen,url){
    this.socialSharing.shareViaWhatsApp("Apuntate a este evento: "+mensaje,imagen,"http://localhost:8100/#/HomePage");
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
  this.mensaje.aviso_error("Te has apuntado al evento");
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
    let alert = this.alertCtrl.create({
      title: 'Este plan esta completo',
      subTitle: 'Lo sentimos mucho este plan esta completo',
      buttons: ['Ok']
    });
    this.pasar();
  }else{

    this.storage.get('id_user').then((id_user) =>{

      this.afDatabase.object(`Apuntados/${newKey}`).set({
        id: newKey,
        idUsuario: id_user,
        idEvento: id 
      })
        this.sendNotification(id_user,id);
    });

    this.mostrarToast();
    this.loadedeventList.pop();

    this.contAnuncios++;
    
    if(this.contAnuncios==3){
      this.launchInterstitial();
      this.contAnuncios=0;
    }

    if(this.loadedeventList.length==0){
      const appDiv: HTMLElement = document.getElementById('capa');
      appDiv.innerHTML = `<h1 style="text-align:justify; vertical-align: middle;">No hay mas eventos</h1>`;
    }
  }
}

voteUp(id_evento) {

  var i=this.loadedeventList.length-1
  var id=this.loadedeventList[i].id;
  var limite=this.contar(id);
  var cupo=this.loadedeventList[i].cupo;

  console.log(cupo);
  console.log(limite);
  if(cupo==limite){
    let alert = this.alertCtrl.create({
      title: 'Este plan esta completo',
      subTitle: 'Lo sentimos mucho plan este plan a llegado al limite de personas.',
      buttons: ['Ok']
    });
    alert.present();
    this.pasar();
    
  }else{

    var rootRef = firebase.database().ref().child("Apuntados");
    var newKey = rootRef.push().key; 
    this.storage.get('id_user').then((id_user) =>{
  
      this.afDatabase.object(`Apuntados/${newKey}`).set({
        id: newKey,
        idUsuario: id_user,
        idEvento: id_evento 
      })
    
      this.sendNotification(id_user,id_evento);
     
    });
    this.mostrarToast();
    this.loadedeventList.pop();
    if(this.loadedeventList.length==0){
      const appDiv: HTMLElement = document.getElementById('capa');
      appDiv.innerHTML = `<h1>No hay mas eventos.</h1>`;
      appDiv.style.height = "20%";
    }
  }
}

pasar(){
  this.loadedeventList.pop();
  if(this.loadedeventList.length==0){
    const appDiv: HTMLElement = document.getElementById('capa');
    appDiv.innerHTML = `<h1>No hay mas eventos.</h1>`;
    appDiv.style.height = "80%";
  }

  this.contAnuncios++;
  
  if(this.contAnuncios==3){
    this.launchInterstitial();
    this.contAnuncios=0;
  }
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
        b.push(snapshot.val());

    });
    
    var ref = firebase.database().ref("Eventos/");
    ref.on("child_added", function(snapshot) {
        c.push(snapshot.val());

    });

    var ref = firebase.database().ref("Eventos/");
    ref.on("child_added", function(snapshot) {
        e.push(snapshot.val());

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
      console.log(b);
      console.log("bloqueados");
      console.log(d);
    }, 2000);
 

   setTimeout(() => {

    for(var i=0;i<a.length;i++){
      var index = c.findIndex(function(el) {
        return el.id == a[i]['idEvento'];
      });
      c.splice(index,1);
    }  

    console.log("sinApuntados");
    console.log(c);

    for(var i=0;i<c.length;i++){
      for(var j=0;j<d.length;j++){
        var index = c.findIndex(function(el) {
        return el.idCreador==d[j]['idBloqueado'];
        });
        c.splice(index,1);
      }
    } 

    console.log("sinbloqueados");
    console.log(c);

    this.loadedeventList=c;
    console.log("FInal");
    console.log(this.loadedeventList);
}, 2000);

  
});

/*setTimeout(() => {
      this.eventRef.on('value', itemSnapshot => {
        this.loadedeventList = [];
        itemSnapshot.forEach( itemSnap => {
          this.loadedeventList.push(itemSnap.val());
          return false;
        });
      });
    }, 1000);*/
 
  /*});
  loader.dismiss();*/
}
  
// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  
  return hex;
} 

verPerfil(id){
  this.navCtrl.push('VerPerfilPage',{id: id });
}

}
