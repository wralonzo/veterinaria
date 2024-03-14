import { Routes } from '@angular/router';
import { HomeComponent } from './layers/home/home.component';
import { ClientComponent } from './layers/client/client.component';
import { PetComponent } from './layers/client/pet/pet.component';
import { UsersComponent } from './layers/users/users.component';
import { LoginComponent } from './layers/login/login.component';
import { AuthGuard } from './layers/shared/guard';
import { ConsultComponent } from './layers/consult/consult.component';

export const routes: Routes = [
  { path: 'login', title: 'Inicio de sesion', component: LoginComponent },
  {
    path: 'admin',
    title: 'Home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { login: ['true'] },
    children: [
      {
        path: 'client',
        title: 'Clientes',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'user',
        title: 'Usuario',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin'] },
      },
      {
        path: 'pet/:id/:clienteName',
        title: 'Mascotas-Cliente',
        component: PetComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'consult',
        title: 'Consultas',
        component: ConsultComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'services',
        title: 'Servicios',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin'] },
      },
      {
        path: 'vaccine',
        title: 'Vacunas',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'admin',
  },
];
