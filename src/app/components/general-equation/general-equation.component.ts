import {Component, Input, Renderer2, RendererFactory2} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup} from "@angular/forms";
import {EquationType} from '../../app.component'
import {MathValidators} from "../../math-validators";
import {Options} from 'ngx-slider-v2';
import {ToastService} from "../../services/toast.service"
import {ConfettiService} from "../../services/confetti.service";

/**
 * Primary widget class for equation form/widget handling
 */
@Component({
  selector: 'app-general-equation',
  templateUrl: './general-equation.component.html',
  styleUrls: ['./general-equation.component.css', '../../../css/styles.scss']
})
export class GeneralEquationComponent {

  @Input() equationType: EquationType
  renderer: Renderer2
  maxNumber: number = 10
  maxNumberOptions: Options = {
    floor: 10,
    ceil: 100
  };
  wrongAnswerStyle = 'invalid-answer'
  correctAnswerStyle = 'valid-answer'
  noAnswerStyle = 'no-answer'
  solved: number = 0
  missed: number = 0
  streak: number = 0
  streakCelebrationAmt: number = 5;
  maxStreak: number = 0
  dataSource = new MatTableDataSource()
  answers: any[] = []
  inputStyle = this.noAnswerStyle
  answered = false
  operator: string = '+'
  title: string = 'Addition!'
  canvasId: string = 'add-component-id'
  inputId: string = 'add-input'
  sliderId: string = 'add-max-num-slider'
  form: FormGroup
  validator: any
  initColumns: any[] = [
    {name: 'answer', display: 'Answers'},
  ];
  isSqrt = false
  displayedColumns: any[] = this.initColumns.map((col) => col.name);
  lastInputs: string[] = [];

  constructor(
    rendererFactory: RendererFactory2,
    private confettiService: ConfettiService,
    private toastService: ToastService,
  ) {
    this.dataSource.data = this.answers
    this.maxNumber = 10
    this.renderer = rendererFactory.createRenderer(null, null)
    this.validator = MathValidators.addition('answer', 'numberOne', 'numberTwo')
    this.form = this.initForm()
  }

  ngOnInit() {
    this.form = this.initForm()
  }

  /**
   * Construct a form for this equation type.
   * It holds the formula's values and answer for each displayed general equation widget.
   */
  initForm(): FormGroup {
    let formGroup
    if (this.equationType) {
      this.title = this.equationType.valueOf() + '!'
    }
    switch (this.equationType) {
      case EquationType.ADDITION:
        this.operator = '+'
        this.inputId = 'add-input'
        this.sliderId = 'add-max-num-slider'
        this.canvasId = 'add-component-id'
        let add1 = this.getRandomNumber()
        let add2 = this.getRandomNumber()
        while (this.isRecent(add1, add2)) {
          add1 = this.getRandomNumber()
          add2 = this.getRandomNumber()
        }
        this.addToLastInputs(add1, add2)
        formGroup = new FormGroup({
          numberOne: new FormControl(add1),
          numberTwo: new FormControl(add2),
          answer: new FormControl('')
        }, [MathValidators.addition('answer', 'numberOne', 'numberTwo')])
        break;
      case EquationType.SUBTRACTION:
        this.operator = '-'
        this.inputId = 'sub-input'
        this.sliderId = 'sub-max-num-slider'
        this.canvasId = 'sub-component-id'
        let sub1 = this.getRandomNumber()
        let sub2 = this.getRandomNumber()
        while (this.isRecent(sub1, sub2)) {
          sub1 = this.getRandomNumber()
          sub2 = this.getRandomNumber()
        }
        this.addToLastInputs(sub1, sub2)
        formGroup = new FormGroup({
          numberOne: new FormControl(sub1 >= sub2 ? sub1 : sub2),
          numberTwo: new FormControl(sub1 < sub2 ? sub1 : sub2),
          answer: new FormControl('')
        }, [MathValidators.subtraction('answer', 'numberOne', 'numberTwo')])
        break;
      case EquationType.MULTIPLICATION:
        this.operator = 'x'
        this.inputId = 'multi-input'
        this.sliderId = 'multi-max-num-slider'
        this.canvasId = 'multi-component-id'
        let multi1 = this.getRandomNumber()
        let multi2 = this.getRandomNumber()
        while (this.isRecent(multi1, multi2)) {
          multi1 = this.getRandomNumber()
          multi2 = this.getRandomNumber()
        }
        this.addToLastInputs(multi1, multi2)
        formGroup = new FormGroup({
          numberOne: new FormControl(multi1),
          numberTwo: new FormControl(multi2),
          answer: new FormControl('')
        }, [MathValidators.multiplication('answer', 'numberOne', 'numberTwo')])
        break;
      case EquationType.DIVISION:
        this.operator = '/'
        this.inputId = 'div-input'
        this.sliderId = 'div-max-num-slider'
        this.canvasId = 'div-component-id'
        let div1 = this.getRandomNumber()
        let div2 = this.getRandomNumber()
        while (this.isRecent(div1, div2)) {
          div1 = this.getRandomNumber()
          div2 = this.getRandomNumber()
        }
        this.addToLastInputs(div1, div2)
        let divProduct = div1 * div2
        formGroup = new FormGroup({
          numberOne: new FormControl(divProduct),
          numberTwo: new FormControl(div1),
          answer: new FormControl('')
        }, [MathValidators.division('answer', 'numberOne', 'numberTwo')])
        break;
      case EquationType.SQUARE_ROOT:
        this.isSqrt = true
        this.operator = '&#8730;'
        this.inputId = 'sqrt-input'
        this.sliderId = 'sqrt-max-num-slider'
        this.canvasId = 'sqrt-component-id'
        let sqrt1 = this.getRandomNumber()
        while (this.isRecent(sqrt1, sqrt1)) {
          sqrt1 = this.getRandomNumber()
        }
        this.addToLastInputs(sqrt1, sqrt1)
        let square = sqrt1 * sqrt1
        formGroup = new FormGroup({
          numberOne: new FormControl(square),
          answer: new FormControl('')
        }, [MathValidators.squareroot('answer', 'numberOne')])
        break;
      default:
        this.operator = '+'
        formGroup = new FormGroup({
          numberOne: new FormControl(this.getRandomNumber()),
          numberTwo: new FormControl(this.getRandomNumber()),
          answer: new FormControl('')
        }, [MathValidators.addition('answer', 'numberOne', 'numberTwo')])
        break;
    }
    return formGroup
  }

  /**
   * Check if the same formula has already been displayed recently
   * @param num1
   * @param num2
   */
  isRecent(num1: number, num2: number): boolean {
    const key1 = num1 + '-' + num2
    const key2 = num2 + '-' + num1
    return this.lastInputs.includes(key1) || this.lastInputs.includes(key2)
  }

  /**
   * Track recent inputs to help prevent  the presentation of the same formula in succession
   * @param num1
   * @param num2
   */
  addToLastInputs(num1: number, num2: number): void {
    const key1 = num1 + '-' + num2
    const key2 = num2 + '-' + num1
    this.lastInputs.push(key1);
    if (key1 !== key2) {
      this.lastInputs.push(key2)
    }
    if (this.lastInputs.length > 8) {
      this.lastInputs.shift();
    }
  }

  /**
   * Increment our solved counter
   */
  incrementSolved(): void {
    this.solved = this.solved + 1
  }

  /**
   * Increment our missed counter
   */
  incrementMissed(): void {
    this.missed = this.missed + 1
  }

  /**
   * Increment our streak counter
   */
  incrementStreak(isReset: boolean = false): void {
    if (isReset) {
      this.streak = 0
    } else {
      this.streak++
      this.maxStreak = Math.max(this.maxStreak, this.streak)
      if (this.streak % this.streakCelebrationAmt === 0) {
        this.doCongratulations()
      }
    }
  }

  /**
   * Getter for first formula value.  This will be used in our validator.
   */
  get numberOne() {
    return this.form.value.numberOne
  }

  /**
   * Getter for second formula value.  This will be used in our validator.
   */
  get numberTwo() {
    return this.form.value.numberTwo
  }

  /**
   * Helper method to get a random number in line with our Max Number value
   */
  getRandomNumber() {
    return Math.floor(Math.random() * this.maxNumber) + 1
  }

  /**
   * Add an answer to our answers list which acts as a datasource for the Answers table in each equation widget
   * @param numberOne
   * @param numberTwo
   * @param ans
   * @param correct
   */
  addAnswer(numberOne: number, numberTwo: number, ans: string, correct: boolean) {
    if (this.isSqrt) {
      this.answers.unshift({answer: ans + ' x ' + ans + ' = ' + numberOne, correct: correct})
    } else {
      this.answers.unshift({answer: numberOne + ' ' + this.operator + ' ' + numberTwo + ' = ' + ans, correct: correct})
    }
    this.dataSource.data = this.answers
  }

  /**
   * Reset the formula form and re-focus input
   * @param style
   */
  resetForm(style?: string) {
    this.answered = false
    this.inputStyle = style ? style : this.noAnswerStyle
    this.form = this.initForm()
    this.focusInput()
  }

  /**
   * Return correct answer CSS for given row
   * @param row
   */
  getAnswerClass(row: any): string {
    if (row.correct) {
      return this.correctAnswerStyle
    }
    return this.wrongAnswerStyle
  }

  /**
   * Focus the cursor in the user input number box
   */
  focusInput() {
    this.renderer.selectRootElement('#' + this.inputId).focus()
  }

  /**
   * Update our max number and reset our form.  This is called by the Max Number slider UI component
   * @param event
   */
  updateMaxNumber(event: any) {
    this.maxNumber = event.value
    this.resetForm()
  }

  /**
   * Fire the confetti cannon and display an encouraging message
   */
  doCongratulations() {
    this.toastService.showCongratsToast(this.streak, this.maxStreak)
    this.confettiService.canon()
  }

  /**
   * Equation form submit handler.
   * Handle correct answer and handle incorrect answer.
   * Track counter value changes.
   */
  onSubmit() {
    const numA = this.form.value.numberOne
    const numB = this.form.value.numberTwo
    const ans = this.form.value.answer
    if (this.form.valid) {
      this.answered = true
      this.incrementSolved()
      this.inputStyle = this.correctAnswerStyle
      this.incrementStreak()
      this.addAnswer(numA, numB, ans, true)
    } else {
      const answer = this.form.value.answer
      if (answer !== '') {
        this.inputStyle = this.wrongAnswerStyle
        this.incrementMissed()
        this.addAnswer(numA, numB, ans, false)
        this.inputStyle = this.wrongAnswerStyle
        this.form.value.answer = ''
        this.maxStreak = Math.max(this.maxStreak, this.streak)
        this.incrementStreak(true)
        this.toastService.showWhoopsToast(answer)
      }
      this.focusInput()
    }
  }
}
