import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Evento } from './../models/evento';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Nav, NavParams, IonicPage, Content, NavController, MenuController, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from '@ngx-translate/core';
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { LoadingController } from 'ionic-angular';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { DatePipe } from '@angular/common';
@Component({
  templateUrl: 'app.html'
}) 

 
export class MyApp { 
 
  
  public rootPage: any;
  @ViewChild(Nav) nav: Nav;

  constructor(private screenOrientation: ScreenOrientation,public datepipe: DatePipe,public afDatabase: AngularFireDatabase, public app: App, public loading: LoadingController, public Facebook: Facebook, private alertCtrl: AlertController, private ofAuth: AngularFireAuth, private translateService: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, public menuCtrl: MenuController) {

    platform.ready().then(() => {
      this.translateService.setDefaultLang('es');
      this.translateService.use('es');
      this.storage.get('id_user').then(loggedIn => {
        this.rootPage = loggedIn ? 'HomePage' : 'LoginPage';
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
      });


      this.permitirEliminar();
      

      this.LanzarPlanesGenericos();
      /*
            this.storage.get('id_user').then(token => {
              if(!token){
                this.navCtrl.setRoot('LoginPage')
                this.menuCtrl.swipeEnable(false);
              }
              else{
                this.navCtrl.setRoot('HomePage')
                this.menuCtrl.swipeEnable(true);
              }
            })
      
           var push = Push.init({
              android: {
                senderID: "944185704251"
              },
              ios: {
                alert: "true",
                badge: true,
                sound: 'false'
              }, 
              windows: {}
            });
      
            push.on('registration', (data) => {
              console.log(data.registrationId);
              console.log(data.registrationId.toString());
            });
      */

      statusBar.overlaysWebView(false);
      statusBar.hide();
      splashScreen.hide();
    });
  }



  LanzarPlanesGenericos(){

        var lanzadosLunes;
        var lanzadosJueves;
        var that=this;

        var dia = new Date();
        var diaSemana=dia.getDay();
        var hora=dia.getHours();

       firebase.database().ref("Genericos").on('value', function(snapshot) { 
          lanzadosLunes=snapshot.val().lunes;
          lanzadosJueves=snapshot.val().jueves;

          if(diaSemana==7 && lanzadosLunes==0 && lanzadosJueves==0){
            console.log("Se lanzan los planes genericos de la semana");
                var lunes=dia.setDate(dia.getDate()+1);
                var martes=dia.setDate(dia.getDate()+1);
                var miercoles=dia.setDate(dia.getDate()+1);
                var jueves=dia.setDate(dia.getDate()+1);
                var viernes=dia.setDate(dia.getDate()+1);
                var sabado=dia.setDate(dia.getDate()+1);
                var domingo=dia.setDate(dia.getDate()+1);


                setTimeout(() => {
                  that.genericosLunes(lunes,martes,miercoles,jueves,viernes,sabado,domingo);
                  that.afDatabase.object(`Genericos/lunes`).set(1);           
                }, 1000);
  
                setTimeout(() => {
                  that.genericosJueves(lunes,martes,miercoles,jueves,viernes,sabado,domingo);
                  that.afDatabase.object(`Genericos/jueves`).set(1);
                }, 1000);
  
            }else{
              console.log("No es hora de lanzar planes genericos");
              if(diaSemana==5){
                that.afDatabase.object(`Genericos/lunes`).set(0);
                that.afDatabase.object(`Genericos/jueves`).set(0);
              }
            }
      });


  }

  genericosLunes(lunes,martes,miercoles,jueves,viernes,sabado,domingo){

    lunes=this.datepipe.transform(lunes, 'yyyy-MM-dd');
    martes=this.datepipe.transform(martes, 'yyyy-MM-dd');
    miercoles=this.datepipe.transform(miercoles, 'yyyy-MM-dd');
    jueves=this.datepipe.transform(jueves, 'yyyy-MM-dd');
    viernes=this.datepipe.transform(viernes, 'yyyy-MM-dd');
    sabado=this.datepipe.transform(sabado, 'yyyy-MM-dd');
    domingo=this.datepipe.transform(domingo, 'yyyy-MM-dd');

    var eventosGenericos= { 
      0:{categoria: "Animales",ciudad: "Playa Blanca",cupo: "4",descripcion: "La manera perfecta de conocer nuevos amigos y sus mascotas",direccion: "Avenida Marítima, 133, Hotel Casa del Embajador, 35570 Playa Blanca, Las Palmas, España",fecha: jueves,
      horaFinal: "20:00",horaInicio: "20:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fmascotas.png?alt=media&token=83dbf3ac-820a-400e-a053-d0eb8767b416",
      lat: 28.862098,lng: -13.827552,nombre: "Paseos con perros",ptnOrganizador: 5},
      1:{categoria: "Deporte",ciudad: "Playa Honda",cupo: "100",descripcion: "Únete a otros apasionados del running y del deporte",direccion: "Calle Cruceta, 2, 35509 Playa Honda, Las Palmas, España",fecha: miercoles,
      horaFinal: "07:00",horaInicio: "07:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
      lat: 28.950414,lng: -13.592284,nombre: "Mañanas de running",ptnOrganizador: 5},
      2:{categoria: "Deporte",ciudad: "Playa Honda",cupo: "100",descripcion: "Únete a otros apasionados del running y del deporte",direccion: "Av. Marítima, 97-99, 35580 Playa Blanca, Las Palmas, España",fecha: jueves,
      horaFinal: "19:00",horaInicio: "19:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
      lat: 28.962266,lng: -13.546978999999965,nombre: "Tardes de running",ptnOrganizador: 5},
      3:{categoria: "Aire Libre",ciudad: "Playa Blanca",cupo: "100",descripcion: "Conoce gente nueva dando una vuelta.",direccion: "Av. Marítima, 97-99, 35580 Playa Blanca, Las Palmas, España",fecha: miercoles,
      horaFinal: "19:00",horaInicio: "19:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
      lat: 28.862879,lng: -13.829162,nombre: "Vámonos de paseo",ptnOrganizador: 5},    
      4:{categoria: "Deporte",ciudad: "Arrecife",cupo: "100",descripcion: "Descubre gente nueva, conoce otros padres con los que compartir un rato diferente mientras los niños juegan juntos",direccion: "Av. Marítima, 97-99, 35580 Playa Blanca, Las Palmas, España",fecha: jueves,
      horaFinal: "17:00",horaInicio: "17:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
      lat: 28.862879,lng: -13.829162,nombre: "Nos vamos al parque con los niños",ptnOrganizador: 5},
      5:{categoria: "Deporte",ciudad: "Arrecife",cupo: "100",descripcion: "Conoce nuevos amigos sobre dos ruedas. Únete a otros apasionados de la bici y del deporte.",direccion: "Av. Fred Olsen, 8, 35500 Arrecife, Las Palmas, Las Palmas, España",fecha: viernes,
      horaFinal: "18:00",horaInicio: "18:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
      lat: 28.958775,lng: -13.557891,nombre: "Bicicleta",ptnOrganizador: 5},
      6:{categoria: "Fiesta",ciudad: "Arrecife",cupo: "100",descripcion: "Conoce gente nueva de manera distendida afterwork.",direccion: "Av. César Manrique, 17, 35500 Arrecife, Las Palmas, España",fecha: viernes,
      horaFinal: "18:00",horaInicio: "18:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Ffiesta.png?alt=media&token=41a4e6f7-acf6-4ab0-ad5a-d64e59eaf417",
      lat: 28.96223,lng: -13.54622,nombre: "Cerveceo treintañeros",ptnOrganizador: 5},
      7:{categoria: "Fiesta",ciudad: "Arrecife",cupo: "100",descripcion: "Charla con gente nueva tomándote algo.",direccion: "Avda Cesar Manrique nº22 Charco San Ginés 35500 Arrecife ES, Av. César Manrique, 35500 Arrecife, Las Palmas, España",fecha: jueves,
      horaFinal: "18:00",horaInicio: "18:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fchicos.png?alt=media&token=505eec40-4056-48d2-aa45-55212d9cb89e",
      lat: 28.962266,lng: -13.546979,nombre: "Cerveceo veinteañeros",ptnOrganizador: 5},
      8:{categoria: "Fiesta",ciudad: "Arrecife",descripcion: "Conoce nuevas amigas, es hora de relajarse!",direccion: "Av. César Manrique, 20, 35500 Arrecife, Las Palmas, España",fecha: jueves,
      horaFinal: "18:30",horaInicio: "18:30",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fchicas.png?alt=media&token=b5bae77e-2d04-49c9-89aa-ab2017451a35",
      lat: 28.962326,lng: -13.546774,nombre: "Quedada chicas",ptnOrganizador: 5},
      9:{categoria: "Cultura",ciudad: "Arrecife",cupo: "100",descripcion: "Descubre amigos con tus mismos gustos por el séptimo arte. La película se elegirá en el chat.",direccion: "Calle León y Castillo, 42, 35500 Arrecife, Las Palmas, España",fecha: miercoles,
      horaFinal: "19:20",horaInicio: "19:20",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcultura.png?alt=media&token=985c4a60-c716-44c1-9ede-51894b0e0d71",
      lat: 28.961089,lng: -13.549069,nombre: "¡Quedamos en el cine!",ptnOrganizador: 5},
      10:{categoria: "Gastronomia", ciudad: "Arrecife", descripcion: "Descubre a otros foodies como tú mientras practicáis una de vuestras pasiones: COMER!",direccion: "C/ Ginés de Castro y Álvarez, 9 B, 35500 Arrecife, Las Palmas, España",fecha: jueves,
      horaFinal: "19:00",horaInicio: "19:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fgastronomia.png?alt=media&token=4a0317e0-1bf4-4d48-958b-093002f3fc29",
      lat: 28.959245,lng: -13.547779,nombre: "Gastroplan",ptnOrganizador: 5},
      11:{categoria: "Aire Libre", ciudad: "Playa de Famara", descripcion: "Qué mejor manera de conocer amigos que disfrutar juntos de un bonito atardecer en la playa!",direccion: "C/ Ginés de Castro y Álvarez, 9 B, 35500 Arrecife, Las Palmas, España",fecha: miercoles,
      horaFinal: "20:30",horaInicio: "20:30",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fgastronomia.png?alt=media&token=4a0317e0-1bf4-4d48-958b-093002f3fc29",
      lat: 29.115559,lng: -13.556345,nombre: "Atardezcamos juntos",ptnOrganizador: 5},
      12:{categoria: "Aire Libre", ciudad: "San Bartolomé", descripcion: "Únete a un grupo de gente en la playa y disfrutad juntos de media hora de silencio y concentración.",direccion: "Avenida Playa Honda, 88, 35509 San Bartolomé, España",fecha: jueves,
      horaFinal: "20:00",horaInicio: "20:00",id: "",idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
      imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fgastronomia.png?alt=media&token=4a0317e0-1bf4-4d48-958b-093002f3fc29",
      lat: 28.951085 ,lng: -13.589928,nombre: "Meditación en la playa ",ptnOrganizador: 5},
      };


    var lunes1:Evento;
    var rootRef = firebase.database().ref().child("Eventos");
    for(var i=0;i<13;i++){
      
      var newKey = rootRef.push().key;
      eventosGenericos[i]['id']=newKey;
      lunes1=eventosGenericos[i];
      this.afDatabase.object(`Eventos/${newKey}`).set(lunes1);
    }

  }

  genericosJueves(lunes,martes,miercoles,jueves,viernes,sabado,domingo){

    lunes=this.datepipe.transform(lunes, 'yyyy-MM-dd');
    martes=this.datepipe.transform(martes, 'yyyy-MM-dd');
    miercoles=this.datepipe.transform(miercoles, 'yyyy-MM-dd');
    jueves=this.datepipe.transform(jueves, 'yyyy-MM-dd');
    viernes=this.datepipe.transform(viernes, 'yyyy-MM-dd');
    sabado=this.datepipe.transform(sabado, 'yyyy-MM-dd');
    domingo=this.datepipe.transform(domingo, 'yyyy-MM-dd');

    //eventos del jueves
    var eventosGenericos = {
      0: {
          categoria: "Animales", ciudad: "San Bartolomé", cupo: "100", descripcion: "La manera perfecta de conocer nuevos amigos y sus mascotas.", direccion: "Avenida Playa Honda, 42, 35509 San Bartolomé, Las Palmas, España", fecha: sabado,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fmascotas.png?alt=media&token=83dbf3ac-820a-400e-a053-d0eb8767b416",
          lat: 28.951839, lng: -13.587345, nombre: "Paseos con perros", ptnOrganizador: 5
      },
      1: {
          categoria: "Animales", ciudad: "San Bartolomé", cupo: "100", descripcion: "La manera perfecta de conocer nuevos amigos y sus mascotas.", direccion: "Avenida Playa Honda, 42, 35509 San Bartolomé, Las Palmas, España", fecha: domingo,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fmascotas.png?alt=media&token=83dbf3ac-820a-400e-a053-d0eb8767b416",
          lat: 28.951839, lng: -13.587345, nombre: "Paseos con perros", ptnOrganizador: 5
      },
      2: {
          categoria: "Aire Libre", ciudad: "Charco San Ginés", cupo: "100", descripcion: "Conoce gente nueva dando una vuelta.", direccion: "Avda Cesar Manrique no22 Charco San Ginés 35500 Arrecife ES, Av. César Manrique, 35500 Arrecife, Las Palmas, España", fecha: martes,
          horaFinal: "19:00", horaInicio: "19:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 28.962266, lng: -13.546979, nombre: "Vámonos de paseo", ptnOrganizador: 5
      },
      3: {
          categoria: "Deporte", ciudad: "Playa", cupo: "100", descripcion: "Únete a otros apasionados del running y del deporte", direccion: "Calle Cruceta, 2, 35509 Playa Honda, Las Palmas, España", fecha: domingo,
          horaFinal: "08:00", horaInicio: "08:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
          lat: 28.950414, lng: -13.592284, nombre: "Mañanas de running", ptnOrganizador: 5
      },
      4: {
          categoria: "Deporte", ciudad: "Arrecife", cupo: "100", descripcion: "Únete a otros apasionados del running y del deporte", direccion: "Calle Cruceta, 2, 35509 Playa Honda, Las Palmas, España", fecha: martes,
          horaFinal: "08:00", horaInicio: "08:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
          lat: 28.950414, lng: -13.592284, nombre: "Mañanas de running", ptnOrganizador: 5
      },
      5: {
          categoria: "Deporte", ciudad: "Arrecife", cupo: "100", descripcion: "Únete a otros apasionados del running y del deporte", direccion: "Avda. Rafael González Negrín, 1, 35500 Arrecife, Las Palmas, España", fecha: martes,
          horaFinal: "19:00", horaInicio: "19:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
          lat: 28.950414, lng: -13.592284, nombre: "Tardes de running", ptnOrganizador: 5
      },
      6: {
          categoria: "Deporte", ciudad: "Playa", cupo: "100", descripcion: "Únete a otros apasionados del running y del deporte", direccion: "Avda. Rafael González Negrín, 1, 35500 Arrecife, Las Palmas, España", fecha: martes,
          horaFinal: "18:00", horaInicio: "18:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
          lat: 28.950414, lng: -13.592284, nombre: "Tardes de running", ptnOrganizador: 5
      },
      7: {
          categoria: "Aire Libre", ciudad: "Playa Blanca", cupo: "100", descripcion: "Conoce gente nueva dando una vuelta.", direccion: "Av. Marítima, 97-99, 35580 Playa Blanca, Las Palmas, España", fecha: domingo,
          horaFinal: "19:00", horaInicio: "19:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 28.862879, lng: -13.829162, nombre: "Vámonos de paseo", ptnOrganizador: 5
      },
      8: {
          categoria: "Aire Libre", ciudad: "Playa de Famara", cupo: "100", descripcion: "Descubre gente nueva en un fabuloso día de playa.", fecha: sabado,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 29.115559, lng: -13.556345, nombre: "¡Día de playa!", ptnOrganizador: 5
      },
      9: {
          categoria: "Aire Libre", ciudad: "Playa de Famara", cupo: "100", descripcion: "Descubre gente nueva en un fabuloso día de playa.", fecha: domingo,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 29.115559, lng: -13.556345, nombre: "¡Día de playa!", ptnOrganizador: 5
      },
      10: {
          categoria: "Con niños", ciudad: "Arrecife", cupo: "100", descripcion: "Vente a conocer a otros padres y a sus pequeñuelos y disfrutad juntos de un bonito día de playa", direccion: "Lancelot, Avenida Mancomunidad, 35509 Arrecife, España", fecha: sabado,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcon_ninos_1.png?alt=media&token=10cbf3c9-e4c2-4d75-8ad3-588e68be18ae",
          lat: 28.957908, lng: -13.55574, nombre: "¡Día de playa con niños!", ptnOrganizador: 5
      },
      11: {
          categoria: "Con niños", ciudad: "Lancelot", descripcion: "Vente a conocer a otros padres y a sus pequeñuelos y disfrutad juntos de un bonito día de playa.", direccion: "Lancelot, Avenida Mancomunidad, 35509 Arrecife, España", fecha: sabado,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcon_ninos_1.png?alt=media&token=10cbf3c9-e4c2-4d75-8ad3-588e68be18ae",
          lat: 28.957908, lng: -13.55574, nombre: "¡Día de playa con niños!", ptnOrganizador: 5
      },
      12: {
          categoria: "Con niños", ciudad: "Parque Viejo", descripcion: "Descubre gente nueva, conoce otros padres con los que compartir un rato diferente mientras los niños juegan juntos.", direccion: "Parque Viejo, Avenida La Marina, 35507 Arrecife, España", fecha: domingo,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcon_ninos_1.png?alt=media&token=10cbf3c9-e4c2-4d75-8ad3-588e68be18ae",
          lat: 28.958235, lng: -13.548546, nombre: "Nos vamos al parque con los niños", ptnOrganizador: 5
      },
      13: {
          categoria: "Aire libre", ciudad: "Playa de Famara", descripcion: "Qué mejor manera de conocer amigos que disfrutar juntos de un bonito atardecer en la playa!", direccion: "Playa de Famara, España", fecha: sabado,
          horaFinal: "20:30", horaInicio: "20:30", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 29.115559, lng: -13.556345, nombre: "Atardezcamos juntos", ptnOrganizador: 5
      },
      14: {
          categoria: "Deporte", ciudad: "Arrecife", descripcion: "Conoce nuevos amigos sobre dos ruedas. Únete a otros apasionados de la bici y del deporte.", direccion: "Av. Fred Olsen, 8, 35500 Arrecife, Las Palmas, Las Palmas, España", fecha: domingo,
          horaFinal: "10:00", horaInicio: "10:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fdeporte.png?alt=media&token=901c6074-161a-452b-a2e4-c8ad8b73fd66",
          lat: 28.958775, lng: -13.557891, nombre: "Bicicleta", ptnOrganizador: 5
      },
      15: {
          categoria: "Fiesta", ciudad: "Arrecife", descripcion: "Conoce nuevos amigos y amigas sin compromiso, pasa un rato divertido charlando con gente distinta.", direccion: "Avda Cesar Manrique nº22 Charco San Ginés 35500 Arrecife ES, Av. César Manrique, 35500 Arrecife, Las Palmas, España", fecha: sabado,
          horaFinal: "21:30", horaInicio: "21:30", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Ffiesta.png?alt=media&token=41a4e6f7-acf6-4ab0-ad5a-d64e59eaf417",
          lat: 28.962266, lng: -13.546979, nombre: "Cerveceo solter@s", ptnOrganizador: 5
      },
      16: {
          categoria: "Gastronomia", ciudad: "Arrecife", descripcion: "Descubre a otros foodies como tú mientras practicáis una de vuestras pasiones: COMER!", direccion: "C/ Ginés de Castro y Álvarez, 9 B, 35500 Arrecife, Las Palmas, España", fecha: domingo,
          horaFinal: "12:00", horaInicio: "12:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fgastronomia.png?alt=media&token=4a0317e0-1bf4-4d48-958b-093002f3fc29",
          lat: 28.959245, lng: -13.547779, nombre: "Vermut y picoteo", ptnOrganizador: 5
      },
      17: {
          categoria: "Aire libre", ciudad: "San Bartolomé", descripcion: "Únete a un grupo de gente en la playa y disfrutad juntos de media hora de silencio y concentración", direccion: "Avenida Playa Honda, 88, 35509 San Bartolomé, España", fecha: domingo,
          horaFinal: "08:00", horaInicio: "08:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 28.951085, lng: -13.589928, nombre: "Meditacion en la playa", ptnOrganizador: 5
      },
      18: {
          categoria: "Aire libre", ciudad: "San Bartolomé", descripcion: "Únete a un grupo de gente en la playa y disfrutad juntos de media hora de silencio y concentración", direccion: "Avenida Playa Honda, 88, 35509 San Bartolomé, España", fecha: martes,
          horaFinal: "08:00", horaInicio: "08:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fnaturaleza.png?alt=media&token=913afeb8-4cae-49a8-a818-df6efefa4526",
          lat: 28.951085, lng: -13.589928, nombre: "Meditacion en la playa", ptnOrganizador: 5
      },
      19: {
          categoria: "Cultura", ciudad: "Arrecife", cupo: "100", descripcion: "Descubre amigos con tus mismos gustos por el séptimo arte. La película se elegirá en el chat", direccion: "Calle León y Castillo, 42, 35500 Arrecife, Las Palmas, España", fecha: sabado,
          horaFinal: "20:00", horaInicio: "20:00", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcultura.png?alt=media&token=985c4a60-c716-44c1-9ede-51894b0e0d71",
          lat: 28.961089, lng: -13.549069, nombre: "¡Quedamos en el cine!", ptnOrganizador: 5
      },
      20: {
          categoria: "Cultura", ciudad: "Playa Honda", cupo: "100", descripcion: "Descubre amigos con tus mismos gustos por el séptimo arte . La película se elegirá en el chat", direccion: "Calle Chimidas, 20, 35509 Playa Honda, Las Palmas, España", fecha: lunes,
          horaFinal: "19:20", horaInicio: "19:20", id: "", idCreador: "xa9H95fVrUddlnZpilvxBaxvWix1",
          imagen: "https://firebasestorage.googleapis.com/v0/b/fishbay-912f5.appspot.com/o/ImagenesEventos%2Fcultura.png?alt=media&token=985c4a60-c716-44c1-9ede-51894b0e0d71",
          lat: 28.956855, lng: -13.586778, nombre: "En Versión Original ", ptnOrganizador: 5
      }
  };

    var jueves1:Evento;
    var rootRef = firebase.database().ref().child("Eventos");
    for(var i=0;i<20;i++){
      
      var newKey = rootRef.push().key;
      eventosGenericos[i]['id']=newKey;
      jueves1=eventosGenericos[i];
      this.afDatabase.object(`Eventos/${newKey}`).set(jueves1);
    }
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

          setTimeout(() => {
          console.log(elim);
          console.log(elim.length);
    
          for(var i=0;i<elim.length;i++){
              if(elim[i]['idEvento']==idEvento){
                firebase.database().ref('Apuntados/').child(elim[i]['id']).remove();
                console.log("borrando desapuntado"+elim[i]['id']);
              }
          } 
        }, 1000);
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
      var mm=dia.getMonth()+1;
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
          this.desapuntarse(arr[i]['id']);
          firebase.database().ref('Eventos/').child(arr[i]['id']).remove();
        }
      
  
      }  
  
    }, 2000);
  
  
  }



  ajustes() {
    this.nav.push('AjustesPage');
  }

  conducta() {
    this.nav.push('ConductaPage');
  }

  politica() {
    this.nav.push('PoliticaPage');
  }

  premium() {
    this.nav.push('PremiumPage');
  }

  terminos() {
    this.nav.push('TerminosPage');
  }

  cuestionario() {
    this.nav.push('Cuestionario2Page');
  }

  cerrarSesion() {
    let loading = this.loading.create({
      content: 'Cerrando sesión...'
    });

    loading.present();

      this.storage.remove('id_user');
      this.storage.get('fb').then((fb) =>{
        if(fb){
          setTimeout(() => {    
          }, firebase.auth().signOut());
          this.Facebook = null;      
        }else{
          setTimeout(() => {    
          }, firebase.auth().signOut());
        }
        this.app.getRootNav().setRoot('LoginPage');
        loading.dismiss();
      });
  }



}

