import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { informacionUser } from "../../models/informacionUser";
import { AngularFireAuth} from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { MenuController} from 'ionic-angular';
import { isCheckedProperty } from 'ionic-angular/util/util';
/**
 * Generated class for the Cuestionario1Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cuestionario1',
  templateUrl: 'cuestionario1.html',
})
export class Cuestionario1Page {

  myForm: FormGroup;
  informacionUser = {} as informacionUser;
  hijos:boolean=false;
  mascota:boolean=false;
  
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private ofAuth: AngularFireAuth,
    public menuCtrl: MenuController,
    private afDatabase: AngularFireDatabase,
    private storage: Storage
  ) {
    this.myForm = this.createMyForm();
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(false, 'menu1');
  }

  ionViewWillLeave() {
    // Don't forget to return the swipe to normal, otherwise 
    // the rest of the pages won't be able to swipe to open menu
    this.menuCtrl.swipeEnable(true);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
   }

  saveData(){
    this.informacionUser.edad=this.myForm.value.edad;
    this.informacionUser.genero=this.myForm.value.gender;
    this.informacionUser.hijos=this.hijos;
    this.informacionUser.mascota=this.mascota;
    this.informacionUser.nacionalidad=this.myForm.value.nacionalidad;
    this.informacionUser.profesion=this.myForm.value.profesion;

    console.log(this.informacionUser);

    this.ofAuth.authState.take(1).subscribe(auth =>{
        var id_usuario =auth.uid;
        this.storage.set('id_user', id_usuario);
        this.afDatabase.object(`Perfil/${auth.uid}`).update(this.informacionUser)
        .then(() => this.navCtrl.setRoot('HomePage'))
      });


  }

  
  private createMyForm(){
    return this.formBuilder.group({
      edad: ['', Validators.required],
      profesion: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  toggleHijos(){
    if(this.hijos==false){
      this.hijos=true;
      console.log(this.hijos);
    }else{
      this.hijos=false;
      console.log(this.hijos);
    }
    
  }

  toggleMascota(){
    if(this.mascota==false){
      this.mascota=true;
      console.log(this.mascota);
    }else{
      this.mascota=false;
      console.log(this.mascota);
    }
  }

}
