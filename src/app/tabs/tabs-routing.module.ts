import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tab',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/tab/home',
        pathMatch: 'full'
      },
      { path: 'home',
      loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
    },
    {
      path: 'qrcode',
      loadChildren: () => import('../qrcode/qrcode.module').then( m => m.QrcodePageModule)
    },
    {
      path: 'profile',
      loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
    },
    {
      path: 'cards',
      loadChildren: () => import('../cards/cards.module').then( m => m.CardsPageModule)
    },
    {
      path: 'test',
      loadChildren: () => import('../test/test.module').then( m => m.TestPageModule)
    },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
