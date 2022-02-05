import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'philippe',
    loadChildren: () => import('./mppm/mppm.module').then(m => m.MppmModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'kanban',
    loadChildren: () =>
      import('./kanban/kanban.module').then(m => m.KanbanModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'communication',
    loadChildren: () =>
      import('./communication/communication.module').then(m => m.CommunicationModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'sondage',
    loadChildren: () =>
      import('./sondage/sondage.module').then(m => m.SondageModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'apitest',
    loadChildren: () =>
      import('./apiTest/apiTest.module').then(m => m.ApiTestModule),
      //canActivate: [AuthGuard]
  },
  {
    path: 'depenses2',
    loadChildren: () =>
      import('./depenses2/depenses2.module').then(m => m.Depenses2Module)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
