import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentVisitedPostComponent } from './recent-visited-post.component';

describe('RecentVisitedPostComponent', () => {
  let component: RecentVisitedPostComponent;
  let fixture: ComponentFixture<RecentVisitedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentVisitedPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentVisitedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
