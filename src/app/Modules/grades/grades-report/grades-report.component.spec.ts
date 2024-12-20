import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesReportComponent } from './grades-report.component';

describe('GradesReportComponent', () => {
  let component: GradesReportComponent;
  let fixture: ComponentFixture<GradesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
