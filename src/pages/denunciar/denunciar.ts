import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage,ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase';
/**
 * Generated class for the DenunciarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-denunciar',
  templateUrl: 'denunciar.html',
})
export class DenunciarPage {

  public idEvento;
  public tipo:String;
  public descripcion:String;
  public email:String;
  public nombreEvento:String;

  constructor(private view:ViewController,public navCtrl: NavController, private emailComposer: EmailComposer,public navParams: NavParams,private alertCtrl: AlertController) {
    this.idEvento=this.navParams.get("idEvento");
  }

  ionViewDidLoad() {
    
  }

  dismiss(){
    this.view.dismiss();
  }

  reportar(){
    var nombre;
    var event = firebase.database().ref("Eventos/");
    event.orderByChild("id").equalTo(this.idEvento).on("child_added", function(data) {
      nombre=data.val().nombre
    });

      let email = {
            to: 'fishbay@gmail.com',
            cc: 'adrian@grupoidimad.com',
            subject: 'Denunciar un plan',
            body: "El usuario con email "+this.email+" ha denunciado el plan "+nombre+" de tipo "+this.tipo +" por los siguientes motivos: "+this.descripcion,
            isHtml: false
        };
                
      // Send a text message using default options
      this.emailComposer.open(email);


  }

}
