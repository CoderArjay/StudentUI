import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentContractComponent } from './student-contract.component';

describe('StudentContractComponent', () => {
  let component: StudentContractComponent;
  let fixture: ComponentFixture<StudentContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
