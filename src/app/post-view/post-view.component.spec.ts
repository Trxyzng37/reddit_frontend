import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInfoComponent } from './post-view.component';

describe('PostViewComponent', () => {
  let component: PostInfoComponent;
  let fixture: ComponentFixture<PostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
