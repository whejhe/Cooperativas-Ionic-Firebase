import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Galeria } from 'src/app/models/galeria.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  @Input() galeria: Galeria;

  form = new FormGroup({
    image: new FormControl(''),
  })

  user = {} as User;
  images: string[] = [];

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  //TOMAR O SELECCIONAR UNA IMAGEN
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de la Galeria')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.galeria) {
        this.updatePublicacion();
      } else {
        this.createPublicacion();
      }
    }
  }

  //CREAR PUBLICACION
  async createPublicacion() {

    let path = `users/${this.user.uid}/galeria`;

    //SUBIR IMAGEN Y OBTENER URL
    let dataUrl = this.form.value.image;
    let imagePath = `${this.galeria}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Imagen agregada correctamente',
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
    })
  }

  //ACTUALIZAR PRODUCTO
  async updatePublicacion() {

    let path = `users/${this.user.uid}/galeria/${this.galeria.image}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    //SUBIR IMAGEN Y OBTENER URL SI ES DIFERENTE
    if (this.form.value.image !== this.galeria.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.galeria.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }


    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ sucess: true });

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


  ngOnInit() {

  }

}
