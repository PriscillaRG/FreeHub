import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AdminComponent } from './components/admin/admin';
import { ProjetsComponent } from './components/projets/projets';
import { ClientsComponent } from './components/clients/clients';
import { FacturesComponent } from './components/factures/factures';
import { MessagerieComponent } from './components/messagerie/messagerie';
import { ParametresComponent } from './components/parametres/parametres';
import { AideComponent } from './components/aide/aide';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },                                           // page d'accueil
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'projets', component: ProjetsComponent, canActivate: [AuthGuard] },      // projets (parent de prestations)
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'factures', component: FacturesComponent, canActivate: [AuthGuard] },
  { path: 'messagerie', component: MessagerieComponent, canActivate: [AuthGuard] },
  { path: 'aide', component: AideComponent, canActivate: [AuthGuard] },            // aide et ressources
  { path: 'parametres', component: ParametresComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }                                                    // fallback
];
