import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryPageComponent } from './inquiry-page.component';

describe('InquiryPageComponent', () => {
  let component: InquiryPageComponent;
  let fixture: ComponentFixture<InquiryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
