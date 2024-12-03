import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAccountComponent } from './upload-account.component';

describe('UploadAccountComponent', () => {
  let component: UploadAccountComponent;
  let fixture: ComponentFixture<UploadAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
