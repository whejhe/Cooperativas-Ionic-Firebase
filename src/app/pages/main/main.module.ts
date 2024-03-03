import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ProfilePage } from './profile/profile.page';
import { PortadaPage } from './portada/portada.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AboutPage } from './about/about.page';
import { CooperativesPage } from './cooperatives/cooperatives.page';
import { ListaUsuariosPage } from './lista-usuarios/lista-usuarios.page';
import { PublicarPage } from './publicar/publicar.page';
import { FiltradoPipe } from 'src/app/pipes/filtrado.pipe';
import { HomePage } from './home/home.page';
import { RegisterGroupPage } from './register-group/register-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    ComponentsModule,
  ],
  exports: [
    MainPage,
    ProfilePage,
    PortadaPage,
    AboutPage,
    CooperativesPage,
    ListaUsuariosPage,
    PublicarPage,
    HomePage,
    RegisterGroupPage
  ],
  declarations: [
    MainPage,
    ProfilePage,
    PortadaPage,
    AboutPage,
    CooperativesPage,
    ListaUsuariosPage,
    PublicarPage,
    FiltradoPipe,
    HomePage,
    RegisterGroupPage
  ]
})
export class MainPageModule {}
