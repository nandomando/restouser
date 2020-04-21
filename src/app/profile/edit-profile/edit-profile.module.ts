import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
// import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    // RouterModule.forChild(routes),
    EditProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
