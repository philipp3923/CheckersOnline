import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlayComponent } from './page-play.component';

describe('PagePlayComponent', () => {
  let component: PagePlayComponent;
  let fixture: ComponentFixture<PagePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagePlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
