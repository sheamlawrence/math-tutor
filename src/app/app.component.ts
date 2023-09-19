import { Component } from '@angular/core';

export enum EquationType {
  ADDITION = 'Addition',
  SUBTRACTION = 'Subtraction',
  MULTIPLICATION = 'Multiplication',
  DIVISION = 'Division',
  SQUARE_ROOT = 'Square Root'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  equationType = EquationType
  title = 'math-game';
}
