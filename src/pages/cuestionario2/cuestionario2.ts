import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the Cuestionario2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cuestionario2',
  templateUrl: 'cuestionario2.html',
})
export class Cuestionario2Page {

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
  }

  saveData() {
    //guardar datos en el perfil de usuario y parar al paso 2
    this.navCtrl.setRoot('HomePage');
  }

}
