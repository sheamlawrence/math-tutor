import {AbstractControl} from '@angular/forms';

export class MathValidators {

  static addition(target: string, sourceOne: string, sourceTwo: string) {
    return (form: AbstractControl) => {
      let sum = form.value[target];
      let num1 = form.value[sourceOne];
      let num2 = form.value[sourceTwo];
      if (num1 + num2 === parseInt(sum)) {
        return null;
      }
      return {"valid": true}
    }
  }

  static subtraction(target: string, sourceOne: string, sourceTwo: string) {
    return (form: AbstractControl) => {
      let difference = form.value[target];
      let num1 = form.value[sourceOne];
      let num2 = form.value[sourceTwo];

      if (num1 - num2 === parseInt(difference)) {
        return null;
      }

      return {"valid": true}
    }
  }

  static multiplication(target: string, sourceOne: string, sourceTwo: string) {
    return (form: AbstractControl) => {
      let product = form.value[target];
      let num1 = form.value[sourceOne];
      let num2 = form.value[sourceTwo];
      if (num1 * num2 === parseInt(product)) {
        return null;
      }
      return {"valid": true}
    }
  }

  static division(target: string, sourceOne: string, sourceTwo: string) {
    return (form: AbstractControl) => {
      let dividend = form.value[target];
      let num1 = form.value[sourceOne];
      let num2 = form.value[sourceTwo];
      if (num1 / num2 === parseInt(dividend)) {
        return null;
      }
      return {"valid": true}
    }
  }

  static squareroot(target: string, sourceOne: string) {
    return (form: AbstractControl) => {
      let sqrt = form.value[target];
      let num1 = form.value[sourceOne];
      if (sqrt * sqrt === parseInt(num1)) {
        return null;
      }
      return {"valid": true}
    }
  }
}
