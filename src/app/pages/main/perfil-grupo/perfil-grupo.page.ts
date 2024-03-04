import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil-grupo',
  templateUrl: './perfil-grupo.page.html',
  styleUrls: ['./perfil-grupo.page.scss'],
})
export class PerfilGrupoPage implements OnInit {

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }


  ngOnInit() {
  }

  //TOMAR O SELECCIONAR UNA IMAGEN
  async takeImage() {
    let grupo = this.grupo();
    let path = `groups/${grupo.id}/profile-group}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `groups/${grupo.id}/profile-group}`;
    grupo.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, { image: grupo.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('group', grupo);

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

  grupo(): Grupo {
    return this.utilsSvc.getFromLocalStorage('group');
  }

}
