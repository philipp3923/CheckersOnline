import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {FooterComponent} from './core/footer/footer.component';
import {HeaderComponent} from './core/header/header.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { BoardComponent } from './pages/game/board/board.component';
import { PlayComponent } from './pages/play/play/play.component';
import { ActiveGamesOverviewComponent } from './pages/play/active-games-overview/active-games-overview.component';
import { GameComponent } from './pages/game/game/game.component';
import { TimerComponent } from './pages/game/timer/timer.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { AuthComponent } from './pages/profile/auth/auth.component';
import { DisconnectedComponent } from './pages/disconnected/disconnected/disconnected.component';
import { UserPropertyComponent } from './pages/profile/user-property/user-property.component';
import { UserDeleteComponent } from './pages/profile/user-delete/user-delete.component';
import { PlayerComponent } from './pages/player/player/player.component';
import { PlayerSearchComponent } from './pages/player/player-search/player-search.component';
import { PlayerDetailComponent } from './pages/player/player-detail/player-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    FooterComponent,
    HeaderComponent,
    BoardComponent,
    PlayComponent,
    ActiveGamesOverviewComponent,
    GameComponent,
    TimerComponent,
    ProfileComponent,
    AuthComponent,
    DisconnectedComponent,
    UserPropertyComponent,
    UserDeleteComponent,
    PlayerComponent,
    PlayerSearchComponent,
    PlayerDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
