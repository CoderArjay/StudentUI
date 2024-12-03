import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollLoginComponent } from './enroll-login.component';

describe('EnrollLoginComponent', () => {
  let component: EnrollLoginComponent;
  let fixture: ComponentFixture<EnrollLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
