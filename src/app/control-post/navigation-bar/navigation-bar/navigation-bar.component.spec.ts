import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModNavigationBarComponent } from './navigation-bar.component';

describe('ModNavigationBarComponent', () => {
  let component: ModNavigationBarComponent;
  let fixture: ComponentFixture<ModNavigationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModNavigationBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
