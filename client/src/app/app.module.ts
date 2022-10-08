import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { PagePlayComponent } from './page-play/page-play.component';
import { PageProfileComponent } from './page-profile/page-profile.component';
import { PageFriendsComponent } from './page-friends/page-friends.component';
import { PageLeagueComponent } from './page-league/page-league.component';
import { PagePopularComponent } from './page-popular/page-popular.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagePlayComponent,
    PageProfileComponent,
    PageFriendsComponent,
    PageLeagueComponent,
    PagePopularComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
