import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLinkListComponent } from './post-link-list.component';

describe('PostLinkListComponent', () => {
  let component: PostLinkListComponent;
  let fixture: ComponentFixture<PostLinkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLinkListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
