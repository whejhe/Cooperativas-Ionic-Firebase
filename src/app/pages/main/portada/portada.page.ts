//app/pages/main/portada/portada.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NuevaPublicacionComponent } from 'src/app/components/nuevaPublicacion/nuevaPublicacion.component';
import { orderBy, where } from 'firebase/firestore'
import { FiltradoPipe } from 'src/app/pipes/filtrado.pipe';
import { Publicacion } from 'src/app/models/publicacion.model';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  publicacion: Publicacion[] = [];
  loading: boolean = false;
  filtro:string = '';

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  doRefresh(event) {
    setTimeout(()=>{
      this.getPublicaciones();
      event.target.complete();
    },1000);
  }


  ionViewWillEnter() {
    this.getPublicaciones();
  }

  getPublicaciones() {
    let path = `users/${this.user().uid}/publicaciones`;

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

  //CONFIRMAR ELIMINAR
  async confirmDeletePublicacion(publicacion: Publicacion) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Publicacion',
      message: '¿Desea eliminar la publicacion?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, Eliminar',
          handler: () => this.deletePublicacion(publicacion)
        }
      ]
    });
  }

  //ELIMINAR PRODUCTO
  async deletePublicacion(publicacion: Publicacion) {

    let path = `users/${this.user().uid}/publicaciones/${publicacion.title}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(publicacion.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.publicacion = this.publicacion.filter(p => p.title !== publicacion.title);

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.utilsSvc.presentToast({
        message: 'Publicacion Eliminada correctamente',
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
