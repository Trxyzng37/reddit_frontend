import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPostComponent } from './control-post.component';

describe('ControlPostComponent', () => {
  let component: ControlPostComponent;
  let fixture: ComponentFixture<ControlPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
