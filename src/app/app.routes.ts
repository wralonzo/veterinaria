import { Routes } from '@angular/router';
import { HomeComponent } from './layers/home/home.component';
import { ClientComponent } from './layers/client/client.component';
import { UsersComponent } from './layers/users/users.component';
import { LoginComponent } from './layers/login/login.component';
import { AuthGuard } from './layers/shared/guard';
import { PetComponent } from './layers/client/pet/pet.component';

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
        children: [
          {
            path: 'pet/:id',
            title: 'Mascotas-Cliente',
            component: PetComponent,
            canActivate: [AuthGuard],
            data: { rols: ['admin', 'vendor'] },
          },
        ],
      },
      {
        path: 'user',
        title: 'Usuario',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin'] },
      },
      {
        path: 'pet',
        title: 'Mascotas',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor', 'client'] },
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
