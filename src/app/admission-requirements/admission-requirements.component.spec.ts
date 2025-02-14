import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionRequirementsComponent } from './admission-requirements.component';

describe('AdmissionRequirementsComponent', () => {
  let component: AdmissionRequirementsComponent;
  let fixture: ComponentFixture<AdmissionRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
