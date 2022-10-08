import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagePlayComponent} from "./page-play/page-play.component";
import {PageProfileComponent} from "./page-profile/page-profile.component";
import {PageFriendsComponent} from "./page-friends/page-friends.component";
import {PagePopularComponent} from "./page-popular/page-popular.component";
import {PageLeagueComponent} from "./page-league/page-league.component"; // CLI imports router

const routes: Routes = [
  {path: "popular", component: PagePopularComponent},
  {path: "league", component: PageLeagueComponent},
  {path: "play", component: PagePlayComponent},
  {path: "friends", component: PageFriendsComponent},
  {path: "profile", component: PageProfileComponent},
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
