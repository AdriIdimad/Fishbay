import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage} from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import firebase from 'firebase';
import { User } from './../../models/user';
import { AngularFireAuth} from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import {Facebook} from '@ionic-native/facebook';
import {Keyboard } from 'ionic-native';
import { TextInput } from 'ionic-angular/components/input/input';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation. 
 */

@IonicPage()
@Component({   
  selector: 'ChatPage',
  templateUrl: 'chat.html',
}) 
export class ChatPage {
  @ViewChild(Content) content: Content;

  public perfilData: FirebaseObjectObservable<User>;
  facebook: boolean;
  public username: string="";
  public imagen: string="";
  message: string="";
  messages: object[]=[];
  idEvento; 
  s; 
  as;
  myActualDate;
  @ViewChild('chat_input') messageInput: TextInput;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDatabase: AngularFireDatabase, public afAuth: AngularFireAuth,public storage: Storage,public Facebook:Facebook) {
  
  }

  ionViewDidLoad()
  {
    this.idEvento = this.navParams.get("infodata");
    
    this.s=this.afDatabase.list('/Chat/'+this.idEvento).subscribe( data =>{
        this.messages=data;
        
    });

     setTimeout(() => { 
        this.content.scrollToBottom(100);
     }, 50); 
 

  }    
 
  ngOnInit(){
    this.afAuth.authState.take(1).subscribe(data =>{  
      this.as=this.afDatabase.list('/Perfil/'+data.uid).subscribe( data2 =>{
        data2.forEach(element => {
          if(element.$key=="nombre"){
            this.username=element.$value;         
          }
          if(element.$key=="imagen"){
            this.imagen=element.$value;         
          }             
        }); 
      });
    });
    setTimeout(() => {
      this.content.scrollToBottom(100);
   }, 500);

  
  }   

  getRandomColor()
  {
      var color = "#";
      for (var i = 0; i < 3; i++)
      {
          var part = Math.round(Math.random() * 255).toString(16);
          color += (part.length > 1) ? part : "0" + part;
      }
      return color;
  }


  enviarMensaje(){
    if(this.message!=""){

      this.storage.get('fb').then((fb) =>{ 
        this.facebook=fb;
        if(fb==true){
          this.getInfo();
        }

        console.log(this.username);
        const d = new Date();
        const curHour = d.getHours();
        const curMin = d.getMinutes();
        const curSec = d.getSeconds();
        var horaMenasaje=curHour+":"+curMin; 
    
  
        this.afDatabase.list("/Chat/"+this.idEvento).push({
          username: this.username,
          message: this.message,
          imagen: this.imagen,
          hora: horaMenasaje
        }).then( () =>{
          this.message="";

          this.idEvento = this.navParams.get("infodata");
          
          this.s=this.afDatabase.list('/Chat/'+this.idEvento).subscribe( data =>{
              this.messages=data;
          });
      
          /*this.afAuth.authState.take(1).subscribe(data =>{  
            this.username=data.email;
          });*/

          this.messageInput.setFocus();
          this.updateScroll();

        }).catch( () =>{
        // error
        });
  
       });
      }
  }

  getInfo(){
    this.Facebook.api("me/?fields=name,email,first_name,picture,last_name,birthday,hometown",['public_profile','email'])
       .then(response => {
          this.username=response.name;
          this.imagen=response.picture.data.url;
      }); 
   
} 
  

updateScroll() {
  console.log('updating scroll')
  setTimeout(() => {
    this.content.scrollToBottom();
  }, 400)
}

}
