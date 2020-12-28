import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { LoggedInGuard } from './logged-in-guard.guard';
import { LoggedOutGuard } from './logged-out-guard.guard';

const routes: Routes = [
  { path:'login', component: LoginComponent, canActivate: [ LoggedOutGuard ] },
  { path:'authenticate', component: AuthenticateComponent},
  { path:'logout', component: LogoutComponent, canActivate: [ LoggedInGuard ]  },
  { path:'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
