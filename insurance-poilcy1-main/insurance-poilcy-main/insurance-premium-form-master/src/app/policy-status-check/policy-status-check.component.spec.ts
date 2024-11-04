import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyStatusCheckComponent } from './policy-status-check.component';

describe('PolicyStatusCheckComponent', () => {
  let component: PolicyStatusCheckComponent;
  let fixture: ComponentFixture<PolicyStatusCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyStatusCheckComponent]
    });
    fixture = TestBed.createComponent(PolicyStatusCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
