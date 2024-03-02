import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {title: "Inicio" , url: 'home', icon:'home-outline'},
    {title: "Perfil" , url: 'profile', icon:'person-outline'},
    {title: "Acerca de" , url: 'about', icon:'information-circle-outline'},
    {title: "Cooperativas" , url: 'cooperatives', icon:'business-outline'},
    {title: "Lista de usuarios" , url: 'lista-usuarios', icon:'people-outline'},
    {title: "Publicar" , url: 'publicar', icon:'add-circle-outline'},
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath:string = '';

  ngOnInit() {
    this.router.events.subscribe((event:any) =>{
      if(event?.url){
        this.currentPath = event.url;
      }
    })
  }

  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  singOut(){
    this.firebaseSvc.singOut();
  }

}
