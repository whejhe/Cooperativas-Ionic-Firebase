import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cooperatives',
  templateUrl: './cooperatives.page.html',
  styleUrls: ['./cooperatives.page.scss'],
})
export class CooperativesPage implements OnInit {

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  groups: Grupo[] = [];
  filtro:string = '';
  currentUser: User;


  doRefresh(event) {
    setTimeout(() => {
      this.loadGroups();
      event.target.complete();
    }, 1000);
  }

  loadGroups() {
    const currentUser = this.utilsSvc.getCurrentUser();
    console.log(currentUser);

    if (currentUser) {
      const path = 'groups';
      const collectionQuery = [];

      this.firebaseSvc.getCollectionData(path, collectionQuery).subscribe(
        (data: Grupo[]) => {
          this.groups = data.filter(group => group.id !== currentUser.uid);
          console.log(this.groups);
        },
        (error) => {
          console.error('Error al obtener la lista de grupos:', error);
        }
      );
    }
  }
  ngOnInit() {
    this.loadGroups();
  }

}
