import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDPhotoComponent } from './id-photo.component';

describe('IDPhotoComponent', () => {
  let component: IDPhotoComponent;
  let fixture: ComponentFixture<IDPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IDPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
