import { Component } from '@angular/core';
import { NavController, NavParams ,IonicPage} from 'ionic-angular';

/**
 * Generated class for the PoliticaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-politica',
  templateUrl: 'politica.html',
})
export class PoliticaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PoliticaPage');
  }

}
