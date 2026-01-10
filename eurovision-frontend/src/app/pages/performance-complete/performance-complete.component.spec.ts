import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceCompleteComponent } from './performance-complete.component';

describe('PerformanceCompleteComponent', () => {
  let component: PerformanceCompleteComponent;
  let fixture: ComponentFixture<PerformanceCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
