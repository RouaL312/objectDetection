import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBillComponent } from './check-bill.component';

describe('CheckBillComponent', () => {
  let component: CheckBillComponent;
  let fixture: ComponentFixture<CheckBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
