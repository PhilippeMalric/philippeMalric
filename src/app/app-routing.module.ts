import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'mppm',
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
    path: 'epicerie',
    loadChildren: () =>
      import('./epicerie/epicerie.module').then(m => m.EpicerieModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'reve',
    loadChildren: () =>
      import('./reve/reve.module').then(m => m.ReveModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./forms_example/forms_example.module').then(m => m.FormsExampleModule)
  },
  {
    path: 'depenses',
    loadChildren: () =>
      import('./depenses/depenses.module').then(m => m.DepensesModule)
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
