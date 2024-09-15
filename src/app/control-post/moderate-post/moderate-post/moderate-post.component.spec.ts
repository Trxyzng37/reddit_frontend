import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratePostComponent } from './moderate-post.component';

describe('ModeratePostComponent', () => {
  let component: ModeratePostComponent;
  let fixture: ComponentFixture<ModeratePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
