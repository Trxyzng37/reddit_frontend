import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostViewComponent } from './post-view.component';

describe('PostViewComponent', () => {
  let component: ModPostViewComponent;
  let fixture: ComponentFixture<PostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
