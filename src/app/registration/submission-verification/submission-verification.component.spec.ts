import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionVerificationComponent } from './submission-verification.component';

describe('SubmissionVerificationComponent', () => {
  let component: SubmissionVerificationComponent;
  let fixture: ComponentFixture<SubmissionVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
