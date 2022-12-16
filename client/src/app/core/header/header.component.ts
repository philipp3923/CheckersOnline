import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private history: string[];
  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.history = [];

    this.router.events.subscribe(() => {
      if (
        (this.history.length >= 0 &&
          this.router.url === this.history[this.history.length - 1]) ||
        this.router.url === '/404'
      ) {
        return;
      }
      if (
        this.history.length >= 1 &&
        this.router.url === this.history[this.history.length - 2]
      ) {
        this.history.splice(this.history.length - 1);
        return;
      }
      this.history.push(this.router.url);
    });
  }

  async goToLastPage() {
    if (this.history.length <= 2) {
      return;
    }
    await this.router.navigate([this.history[this.history.length - 2]]);
  }

  ngOnInit(): void {}
}
