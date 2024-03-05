import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { orderBy } from 'firebase/firestore';
import { NuevaPublicacionComponent } from 'src/app/components/nuevaPublicacion/nuevaPublicacion.component';
import { Publicacion } from 'src/app/models/publicacion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  loading: boolean = false;
  publicacion: Publicacion[] = [];
  filtro: string = '';


  ngOnInit() {

  }

  doRefresh(event) {
    setTimeout(()=>{
      this.getPublicaciones();
      event.target.complete();
    },1000);
  }

  getPublicaciones() {
    // let path = `users/${this.user().uid}/publicaciones`;
    let path = `publicaciones`;
    this.loading = true;

    let query = [
      orderBy('date', 'desc'),
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.publicacion = res;

        this.loading = false;
        sub.unsubscribe();
      }
    })
  }

  async addUpdatePublicaciones(publicacion?: Publicacion) {
    let sucess = await this.utilsSvc.presentModal({
      component: NuevaPublicacionComponent,
      cssClass: 'add-update-modal',
      componentProps: { publicacion }
    })
    if (sucess) {
      this.getPublicaciones();
    }
  }

  //TOMAR O SELECCIONAR UNA IMAGEN
  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile}`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

}
