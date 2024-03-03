import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Grupo } from 'src/app/models/grupo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register-group',
  templateUrl: './register-group.page.html',
  styleUrls: ['./register-group.page.scss'],
})
export class RegisterGroupPage implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image : new FormControl(''),
    description: new FormControl('', [Validators.required]),
    members: new FormControl([]),
    sector: new FormControl('', [Validators.required]),
    role: new FormControl('admin' || 'usuario'),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      const currentUser: User = this.utilsSvc.getCurrentUser();
      this.form.controls.members.setValue([currentUser.uid]);

      this.firebaseSvc.createGroup(this.form.value as Grupo, currentUser).then((res: any) => {
        const groupId = res?.id;
        if(groupId){
          this.form.patchValue({ id: groupId });
          this.setGroupInfo(groupId);
        }else{
          console.error('Error al obtener el id del grupo');
        }
      }).catch((error: any) => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async setGroupInfo(groupId: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      const path = `groups/${groupId}`;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        this.utilsSvc.saveInLocalStorage('group', this.form.value);
        this.utilsSvc.routerLink('/main/profile');
        this.form.reset();
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async takePicture() {
    const promptLabelHeader = 'Seleccione una imagen para el grupo';
    const result = await this.utilsSvc.takePicture(promptLabelHeader);

    if (result && result.dataUrl) {
      this.form.controls.image.setValue(result.dataUrl);
    }
  }


  ngOnInit() {
  }

}
