import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { HomePage } from './home/home.page';
import { ProfilePage } from './profile/profile.page';
import { AboutPage } from './about/about.page';
import { CooperativesPage } from './cooperatives/cooperatives.page';
import { ListaUsuariosPage } from './lista-usuarios/lista-usuarios.page';
import { PublicarPage } from './publicar/publicar.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children:[
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'profile',
        component: ProfilePage
      },
      {
        path: 'about',
        component: AboutPage
      },
      {
        path: 'cooperatives',
        component:CooperativesPage
      },
      {
        path: 'lista-usuarios',
        component: ListaUsuariosPage
      },
      {
        path: 'publicar',
        component: PublicarPage
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
