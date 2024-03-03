import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuevaPublicacionComponent } from './nuevaPublicacion/nuevaPublicacion.component';
import { TerminosycondicionesComponent } from './terminosycondiciones/terminosycondiciones.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    NuevaPublicacionComponent,
    TerminosycondicionesComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    NuevaPublicacionComponent,
    TerminosycondicionesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ComponentsModule { }
