import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentViewListComponent } from './comment-view-list.component';

describe('CommentViewListComponent', () => {
  let component: CommentViewListComponent;
  let fixture: ComponentFixture<CommentViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentViewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
