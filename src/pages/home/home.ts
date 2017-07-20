import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

/**
 * Generated class for the HomePage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  izqRoot = 'IzqPage'
  cntRoot = 'CntPage'
  derRoot = 'DerPage'


  constructor(public navCtrl: NavController) {}

}
