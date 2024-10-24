import { Routes } from '@angular/router';
import { HomeComponent } from './layers/home/home.component';
import { ClientComponent } from './layers/client/client.component';
import { PetComponent } from './layers/client/pet/pet.component';
import { UsersComponent } from './layers/users/users.component';
import { LoginComponent } from './layers/login/login.component';
import { AuthGuard } from './layers/shared/guard';
import { ConsultComponent } from './layers/consult/consult.component';
import { ServiceComponent } from './layers/service/service.component';
import { ExamenComponent } from './layers/examen/examen.component';
import { ReservationComponent } from './layers/reservation/reservation.component';
import { ConstancyComponent } from './layers/constancy/constancy.component';
import { PetTrackingComponent } from './layers/client/tracking-pet/pet.tracking.component';
import { ProfileComponent } from './layers/profile/profile.component';
import { MedicamentosComponent } from './layers/medicamentos/medicamentos';
import { TimeComponent } from './layers/time/time.component';

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
        component: ServiceComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'vaccine',
        title: 'Vacunas',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'examen',
        title: 'Examenes',
        component: ExamenComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'reservation',
        title: 'Reservaciones',
        component: ReservationComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'constancy',
        title: 'Constancias',
        component: ConstancyComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'medicamentos',
        title: 'Medicamentos',
        component: MedicamentosComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'tracking/:id',
        title: 'Historial',
        component: PetTrackingComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'profile',
        title: 'Historial',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
      {
        path: 'time',
        title: 'Tiempo',
        component: TimeComponent,
        canActivate: [AuthGuard],
        data: { rols: ['admin', 'vendor'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'admin/time',
  },
];
