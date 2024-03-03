import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { PortadaPage } from './portada/portada.page';
import { ProfilePage } from './profile/profile.page';
import { AboutPage } from './about/about.page';
import { CooperativesPage } from './cooperatives/cooperatives.page';
import { ListaUsuariosPage } from './lista-usuarios/lista-usuarios.page';
import { PublicarPage } from './publicar/publicar.page';
import { HomePage } from './home/home.page';
import { RegisterGroupPage } from './register-group/register-group.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children:[
      {
        path: 'portada',
        component: PortadaPage
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
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'register-group',
        component: RegisterGroupPage
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
