import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLeagueComponent } from './page-league.component';

describe('PageLeagueComponent', () => {
  let component: PageLeagueComponent;
  let fixture: ComponentFixture<PageLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageLeagueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
