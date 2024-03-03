import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FiltradoPipe } from 'src/app/pipes/filtrado.pipe';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  users: User[] = [];
  filtro:string = '';

  currentUser: User;

  doRefresh(event) {
    setTimeout(() => {
      this.loadUsers();
      event.target.complete();
    }, 1000);
  }

  loadUsers() {
    this.currentUser = this.utilsSvc.getFromLocalStorage('user');
    if (this.currentUser) {
      const path = 'users';
      const collectionQuery = [];

      this.firebaseSvc.getCollectionData(path, collectionQuery).subscribe(
        (data: User[]) => {
          this.users = data.filter(user => user.uid !== this.currentUser.uid);
        },
        (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      );
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

}
