import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentProceduresComponent } from './enrollment-procedures.component';

describe('EnrollmentProceduresComponent', () => {
  let component: EnrollmentProceduresComponent;
  let fixture: ComponentFixture<EnrollmentProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentProceduresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
