import { FirebaseListObservable } from 'angularfire2/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform, App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
import { HomePage } from './../home/home';
import { IzqPage } from './../izq/izq';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})

export class configuracionPage {

  public carga:Array<any>=[];
  public final:Array<any>=[];
  public selec:Array<any>=[];
  public prueba:Array<any>=[];
  public todos:boolean;
  public ciudadS:String="";
  public categoriaElegida:String="";
  public eventRef:firebase.database.Reference= firebase.database().ref('/Eventos');
  public cont:number;

  constructor(private alertCtrl: AlertController, public translateService: TranslateService, public mensaje: Funciones_utilesProvider, public fallo: Funciones_utilesProvider, private ofAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams,public app: App, private afDatabase: AngularFireDatabase, private storage: Storage,) {
      this.cont=0;
      this.todos=false;
  }

  ionViewDidLoad() {
    this.busqueda();
    var ref = firebase.database().ref("Eventos/");
    ref.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        this.prueba.push(itemSnap.val().ciudad);
        return false;
      });
    });
    this.prueba = this.prueba.filter((el, i, a) => i === a.indexOf(el))
  }

  busqueda(){
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
  
      /*var ref = firebase.database().ref("Eventos/");
      ref.on("child_added", function(snapshot) {
          b.push(snapshot.val());
  
      });*/

      var ref = firebase.database().ref("Eventos/");
      ref.on("child_added", function(snapshot) {
          c.push(snapshot.val());
  
      });
  
      /*var ref = firebase.database().ref("Eventos/");
      ref.on("child_added", function(snapshot) {
          e.push(snapshot.val());
  
      });*/

      var playersRef = firebase.database().ref("bloqueados/"); 
      playersRef.orderByChild("idUsuario").equalTo(id_user).on("value", function(snapshot) {
        snapshot.forEach( item => {
        d.push(item.val());
        return false;
        }); 
      });
  
      setTimeout(() => {
  
      for(var i=0;i<a.length;i++){
        var index = c.findIndex(function(el) {
          return el.id == a[i]['idEvento'];
        });
        if(index!=-1){
          c.splice(index,1);
          }
      }  

      var array = [];
      for (var i = 0; i < c.length; i++) {
          var igual=false;
          for (var j = 0; j < d.length && !igual; j++) {
              if(c[i]['idCreador'] == d[j]['idBloqueado']) 
                      igual=true;
          }
          if(!igual)array.push(c[i]);
      }

      this.carga=array;
  }, 800);
  
  });

/*
      var ref = firebase.database().ref("Eventos/");
      ref.on('value', itemSnapshot => {
        itemSnapshot.forEach( itemSnap => {
          this.carga.push(itemSnap.val());
          return false;
        });
      });

    */
  }

  onFilter() : void{
    setTimeout(() => {
        //console.log(this.carga);
        
          this.final = this.carga.filter((item) =>{

            console.log("categoria: "+this.categoriaElegida);
            console.log("ciudad: "+this.ciudadS);
            
            if(this.ciudadS=="" && this.categoriaElegida==""){
              this.todos=true;         
              console.log("todos los planes");   
            }
            if(this.categoriaElegida!=""){
                if(this.ciudadS!=""){  
                  console.log("1");
                  return item.categoria.toLowerCase().indexOf(this.categoriaElegida.toLowerCase()) > -1 && item.ciudad.toLowerCase().indexOf(this.ciudadS.toLowerCase()) > -1;
                }
            }

            if(this.ciudadS=="" && this.categoriaElegida!=""){
              console.log("2");
              return item.categoria.toLowerCase().indexOf(this.categoriaElegida.toLowerCase()) > -1;
              
            }
            if(this.ciudadS!="" && this.categoriaElegida==""){
              console.log("3");
              return item.ciudad.toLowerCase().indexOf(this.ciudadS.toLowerCase()) > -1;
            }
            
          })

          if(this.todos){
            this.final=this.carga.reverse();
          }
        }, 500);
  }

  guardar(){
    this.onFilter();
    setTimeout(() => {
    console.log(this.final);
    if(this.todos==true){
      this.navCtrl.setRoot(IzqPage,{listaFiltrada:this.carga});
    }else{
      if(this.final.length==0){
      console.log("entra");
      let alert = this.alertCtrl.create({
        title: this.translateService.instant("NO_HAY_EVENTOS"),
        subTitle: this.translateService.instant("NO_HAY_EVENTOS2"),
        buttons: ['Ok']
      });
      alert.present();
      }else{
        this.navCtrl.setRoot(IzqPage,{listaFiltrada:this.final});
      }
    
    }
    }, 1000);
  }
  
}