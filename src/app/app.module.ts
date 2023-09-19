import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from "@angular/material/table";
import { GeneralEquationComponent } from './components/general-equation/general-equation.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import { NgxSliderModule } from 'ngx-slider-v2';
import {ConfettiService} from './services/confetti.service'
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    GeneralEquationComponent
  ],
  imports: [
    MatTableModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatSnackBarModule,
  ],
  providers: [ConfettiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
