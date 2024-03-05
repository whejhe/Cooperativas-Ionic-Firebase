//app/components/nuevaPublicacion/nuevaPublicacion.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Publicacion } from 'src/app/models/publicacion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-nuevapublicacion',
  templateUrl: './nuevaPublicacion.component.html',
  styleUrls: ['./nuevaPublicacion.component.scss'],
})
export class NuevaPublicacionComponent implements OnInit {

  @Input() publicacion: Publicacion;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl(''),
    comentario: new FormControl('', [Validators.required, Validators.minLength(6)]),
    date: new FormControl(this.getCurrentFormattedDate()),
    userId: new FormControl(''),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if(this.publicacion){
      this.form.setValue(this.publicacion);
    }
    this.form.controls.userId.setValue(this.user.uid);
  }

  //FORMATO FECHA
  getCurrentFormattedDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  //TOMAR O SELECCIONAR UNA IMAGEN
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Publicacion')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.publicacion) {
        this.updatePublicacion();
      } else {
        this.createPublicacion();
      }
    }
  }


  //CREAR PUBLICACION
  async createPublicacion() {

    // let path = `users/${this.user.uid}/publicaciones`;
    let pathPortada = `publicaciones`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    //SUBIR IMAGEN Y OBTENER URL
    let dataUrl = this.form.value.image;
    let imagePath = `publicaciones/${Date.now()}`;
    // let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    let usuarioId = this.utilsSvc.getFromLocalStorage('user').uid;
    this.form.controls.image.setValue(imageUrl);
    this.form.controls.userId.setValue(usuarioId);

    this.firebaseSvc.addDocument(pathPortada, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Publicacion agregada correctamente',
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

  //ACTUALIZAR PRODUCTO
  async updatePublicacion() {

    // let path = `users/${this.user.uid}/publicaciones/${this.publicacion.title}`;
    let pathPortada = `publicaciones`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    //SUBIR IMAGEN Y OBTENER URL SI ES DIFERENTE
    if (this.form.value.image !== this.publicacion.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.publicacion.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.title;

    this.firebaseSvc.updateDocument(pathPortada, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Publicacion actualizado correctamente',
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

}
