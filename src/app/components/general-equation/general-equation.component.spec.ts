import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralEquationComponent } from './general-equation.component';
import {MatTableDataSource} from "@angular/material/table";
import {MatSliderModule} from '@angular/material/slider';

describe('GeneralEquationComponent', () => {
  let component: GeneralEquationComponent;
  let fixture: ComponentFixture<GeneralEquationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralEquationComponent]
    });
    fixture = TestBed.createComponent(GeneralEquationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
