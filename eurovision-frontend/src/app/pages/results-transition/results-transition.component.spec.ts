import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsTransitionComponent } from './results-transition.component';

describe('ResultsTransitionComponent', () => {
  let component: ResultsTransitionComponent;
  let fixture: ComponentFixture<ResultsTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsTransitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
