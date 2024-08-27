import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComhubComponent } from './comhub.component';

describe('ComhubComponent', () => {
  let component: ComhubComponent;
  let fixture: ComponentFixture<ComhubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComhubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
