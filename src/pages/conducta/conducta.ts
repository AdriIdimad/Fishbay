import { Component } from '@angular/core';
import { NavController, NavParams ,IonicPage} from 'ionic-angular';

/**
 * Generated class for the ConductaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conducta',
  templateUrl: 'conducta.html',
})
export class ConductaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConductaPage');
  }

}
