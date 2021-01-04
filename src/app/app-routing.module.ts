import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInGuard } from './logged-in-guard.guard';
import { LoggedOutGuard } from './logged-out-guard.guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SubmitComponent } from './submit/submit.component';

const routes: Routes = [
  { path:'login', component: LoginComponent, canActivate: [ LoggedOutGuard ] },
  { path:'authenticate', component: AuthenticateComponent},
  { path:'logout', component: LogoutComponent, canActivate: [ LoggedInGuard ]  },
  { path:'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path:'r/:subreddit', component: DashboardComponent},
  { path:'r/:subreddit/post', component: SubmitComponent},
  { path:'r/:subreddit/:postid', component: DashboardComponent},
  { path:'r/:subreddit/comments/:postid/:postname', component: DashboardComponent, pathMatch: 'full' },//copy reddit's exact syntax for users who copypaste
  { path:'post', component: SubmitComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ scrollOffset: [0, 0], scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
