import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicPerformanceComponent } from './academic-performance.component';

describe('AcademicPerformanceComponent', () => {
  let component: AcademicPerformanceComponent;
  let fixture: ComponentFixture<AcademicPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
