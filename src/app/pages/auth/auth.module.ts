import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    ComponentsModule
  ],
  exports: [
    AuthPage,
    RegisterPage,
    ForgotPasswordPage
  ],
  declarations: [
    AuthPage,
    RegisterPage,
    ForgotPasswordPage
  ]
})
export class AuthPageModule {}
