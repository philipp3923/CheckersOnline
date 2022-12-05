import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {BoardComponent} from "./pages/game/board/board.component";
import {PlayComponent} from "./pages/play/play/play.component";
import {GameComponent} from "./pages/game/game/game.component";
import {ProfileComponent} from "./pages/profile/profile/profile.component";
import {AuthComponent} from "./pages/profile/auth/auth.component";
import {DisconnectedComponent} from "./pages/disconnected/disconnected/disconnected.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'game/:key',
    component: GameComponent
  },
  {
    path: 'play',
    component: PlayComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register',
    component: AuthComponent
  },
  {
    path: 'disconnected',
    component: DisconnectedComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
