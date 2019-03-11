import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';
import { Http,RequestOptions,Headers } from '@angular/http';
import { Funciones_utilesProvider } from './../../providers/funciones_utiles/funciones_utiles';
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
  public tipo: String;
  public descripcion: String;
  public email: String;
  public nombreEvento: String;

  constructor(public mensaje: Funciones_utilesProvider,public translateService:TranslateService,private http: Http,private view: ViewController, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.idEvento = this.navParams.get("idEvento");
  }
 
  ionViewDidLoad() { 

  }

  dismiss() {
    this.view.dismiss();
  }

  reportar() {
    var nombre;
    var event = firebase.database().ref("Eventos/");
    event.orderByChild("id").equalTo(this.idEvento).on("child_added", function (data) {
      nombre = data.val().nombre
    });

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    const requestOptions = new RequestOptions({ headers: headers });

    let postData = {
      "name": nombre,
      "email": this.email,
      "tipo" : this.tipo,
      "descripcion" : this.descripcion
    }

    var senderBody = JSON.stringify(postData);
    
    console.log(postData);
    
    this.http.post("http://gofishbay.com/emailDenuncia.php", senderBody, requestOptions)
        .subscribe(data => {
            console.log(data['_body']);
            this.mensaje.mostrarMensaje(this.translateService.instant("DENUNCIA"),"");
            this.view.dismiss();
        }, error => {
            console.log(error);
    });

    /*let email = {
      to: 'info@fishbayandfun.com',
      cc: 'adrian@grupoidimad.com',
      subject: 'Denunciar un plan',
      body: "El usuario con email " + this.email + " ha denunciado el plan " + nombre + " de tipo " + this.tipo + " por los siguientes motivos: " + this.descripcion,
      isHtml: false
    };*/

  }

}
