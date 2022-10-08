import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePopularComponent } from './page-popular.component';

describe('PagePopularComponent', () => {
  let component: PagePopularComponent;
  let fixture: ComponentFixture<PagePopularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagePopularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
