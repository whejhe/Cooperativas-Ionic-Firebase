//app/services/utils.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alerCtrl = inject(AlertController);

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Tomar una foto',
    });
  };

  //ALERT
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alerCtrl.create(opts);

    await alert.present();
  }

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}')
  }

  //MODAL
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  // OBTENER USUARIO ACTUAL
  getCurrentUser() {
    const user = this.getFromLocalStorage('user');
    return user ? user : null;
  }

  // ACTUALIZAR USUARIO ACTUAL
  updateCurrentUser(updatedUser: any) {
    this.saveInLocalStorage('user', updatedUser);
  }

  // MOSTRAR FOTO DEL USUARIO ACTUAL
  async showCurrentUserPhoto() {
    const currentUser = this.getCurrentUser();

    if (currentUser && currentUser.photoUrl) {
      const alertOptions: AlertOptions = {
        header: 'Foto de Perfil',
        message: `<img src="${currentUser.photoUrl}" class="profile-photo" />`,
        buttons: ['Cerrar']
      };

      await this.presentAlert(alertOptions);
    } else {
      await this.presentToast({ message: 'No hay foto de perfil disponible.', duration: 2000, position: 'bottom' });
    }
  }

  // OBTENER GRUPO ACTUAL
  getCurrentGroup() {
    const group = this.getFromLocalStorage('group');
    return group ? group : null;
  }

  // ACTUALIZAR GRUPO ACTUAL
  updateCurrentGroup(updatedGroup: any) {
    this.saveInLocalStorage('group', updatedGroup);
  }

  // MOSTRAR FOTO DEL GRUPO ACTUAL
  async showCurrentGroupPhoto() {
    const currentGroup = this.getCurrentGroup();

    if (currentGroup && currentGroup.photoUrl) {
      const alertOptions: AlertOptions = {
        header: 'Foto de Grupo',
        message: `<img src="${currentGroup.photoUrl}" class="group-photo" />`,
        buttons: ['Cerrar']
      };

      await this.presentAlert(alertOptions);
    } else {
      await this.presentToast({ message: 'No hay foto de grupo disponible.', duration: 2000, position: 'bottom' });
    }
  }

}
