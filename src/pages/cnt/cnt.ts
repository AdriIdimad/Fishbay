import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage,App } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CntPage');
  }
  goprofile(){
    this.app.getRootNav().push('PerfilPage');
  }

}
