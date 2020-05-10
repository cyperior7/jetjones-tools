import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionSorterComponent } from './division-sorter.component';

describe('DivisionSorterComponent', () => {
  let component: DivisionSorterComponent;
  let fixture: ComponentFixture<DivisionSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
