import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Event } from 'src/app/models/events.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent  implements OnInit {

  constructor(
    public firebaseSvc: FirebaseService,
    public utilsSvc: UtilsService
  ) { }
  @Input() evento: Event;
  user = {} as User;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    fecha: new FormControl(this.getCurrentFormattedDate()),
    image: new FormControl(''),
    description: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ubicacion: new FormControl(''),
    sector: new FormControl(''),
    createdAt: new FormControl(new Date()),
  })

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if(this.evento){
      this.form.setValue(this.evento);
    }
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
      if (this.evento) {
        this.updateEvent();
      } else {
        this.createEvent();
      }
    }
  }


  //CREAR PUBLICACION
  async createEvent() {

    let path = `users/${this.user.uid}/eventos`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    //SUBIR IMAGEN Y OBTENER URL
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Evento agregado correctamente',
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
  async updateEvent() {

    let path = `users/${this.user.uid}/eventos/${this.evento.title}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    //SUBIR IMAGEN Y OBTENER URL SI ES DIFERENTE
    if (this.form.value.image !== this.evento.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.evento.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.title;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Evento actualizado correctamente',
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
