import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFriendsComponent } from './page-friends.component';

describe('PageFriendsComponent', () => {
  let component: PageFriendsComponent;
  let fixture: ComponentFixture<PageFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageFriendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
