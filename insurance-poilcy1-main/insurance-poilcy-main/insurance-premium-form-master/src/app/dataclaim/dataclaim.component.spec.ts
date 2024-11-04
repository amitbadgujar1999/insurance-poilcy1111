import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataclaimComponent } from './dataclaim.component';

describe('DataclaimComponent', () => {
  let component: DataclaimComponent;
  let fixture: ComponentFixture<DataclaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataclaimComponent]
    });
    fixture = TestBed.createComponent(DataclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
