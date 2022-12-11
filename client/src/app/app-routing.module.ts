import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {PlayComponent} from "./pages/play/play/play.component";
import {GameComponent} from "./pages/game/game/game.component";
import {ProfileComponent} from "./pages/profile/profile/profile.component";
import {AuthComponent} from "./pages/profile/auth/auth.component";
import {DisconnectedComponent} from "./pages/disconnected/disconnected/disconnected.component";
import {PlayerDetailComponent} from "./pages/player/player-detail/player-detail.component";
import {PlayerSearchComponent} from "./pages/player/player-search/player-search.component";
import {FriendsComponent} from "./pages/friends/friends/friends.component";
import {ViewGameComponent} from "./pages/game/view-game/view-game.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: "play",
    pathMatch: "full"
  },
  {
    path: 'play/:key',
    component: GameComponent
  },
  {
    path: 'game/:id',
    component: ViewGameComponent
  },
  {
    path: 'play',
    component: PlayComponent
  },
  {
    path: 'player/:id',
    component: PlayerDetailComponent
  },
  {
    path: 'player',
    component: PlayerSearchComponent
  },
  {
    path: 'friends',
    component: FriendsComponent
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
  },
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
