import {Component, Input, Renderer2, RendererFactory2} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup} from "@angular/forms";
import {EquationType} from '../../app.component'
import {MathValidators} from "../../math-validators";
import {Options} from 'ngx-slider-v2';
import {ToastService} from "../../services/toast.service"
import {ConfettiService} from "../../services/confetti.service";

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
    this.validator = MathValidators.addition('answer', 'a', 'b')
    this.form = this.initForm()
  }

  ngOnInit() {
    this.form = this.initForm()
  }

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
          a: new FormControl(add1),
          b: new FormControl(add2),
          answer: new FormControl('')
        }, [MathValidators.addition('answer', 'a', 'b')])
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
          a: new FormControl(sub1 >= sub2 ? sub1 : sub2),
          b: new FormControl(sub1 < sub2 ? sub1 : sub2),
          answer: new FormControl('')
        }, [MathValidators.subtraction('answer', 'a', 'b')])
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
          a: new FormControl(multi1),
          b: new FormControl(multi2),
          answer: new FormControl('')
        }, [MathValidators.multiplication('answer', 'a', 'b')])
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
          a: new FormControl(divProduct),
          b: new FormControl(div1),
          answer: new FormControl('')
        }, [MathValidators.division('answer', 'a', 'b')])
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
          a: new FormControl(square),
          answer: new FormControl('')
        }, [MathValidators.squareroot('answer', 'a')])
        break;
      default:
        this.operator = '+'
        formGroup = new FormGroup({
          a: new FormControl(this.getRandomNumber()),
          b: new FormControl(this.getRandomNumber()),
          answer: new FormControl('')
        }, [MathValidators.addition('answer', 'a', 'b')])
        break;
    }
    return formGroup
  }

  isRecent(num1: number, num2: number): boolean {
    const key1 = num1 + '-' + num2
    const key2 = num2 + '-' + num1
    return this.lastInputs.includes(key1) || this.lastInputs.includes(key2)
  }

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

  incrementSolved(): void {
    this.solved = this.solved + 1
  }

  incrementMissed(): void {
    this.missed = this.missed + 1
  }

  incrementStreak(): void {
    this.streak++
    this.maxStreak = Math.max(this.maxStreak, this.streak)
    if (this.streak % this.streakCelebrationAmt === 0) {
      this.doConfetti()
    }
  }

  get a() {
    return this.form.value.a
  }

  get b() {
    return this.form.value.b
  }

  getRandomNumber() {
    return Math.floor(Math.random() * this.maxNumber) + 1
  }

  addAnswer(a: number, b: number, ans: string, correct: boolean) {
    if (this.isSqrt) {
      this.answers.unshift({answer: ans + ' x ' + ans + ' = ' + a, correct: correct})
    } else {
      this.answers.unshift({answer: a + ' ' + this.operator + ' ' + b + ' = ' + ans, correct: correct})
    }
    this.dataSource.data = this.answers
  }

  resetForm(style?: string) {
    this.answered = false
    this.inputStyle = style ? style : this.noAnswerStyle
    this.form = this.initForm()
    this.focusInput()
  }

  getAnswerClass(row: any): string {
    if (row.correct) {
      return this.correctAnswerStyle
    }
    return this.wrongAnswerStyle
  }

  focusInput() {
    this.renderer.selectRootElement('#' + this.inputId).focus()
  }

  updateMaxNumber(event: any) {
    this.maxNumber = event.value
    this.resetForm()
  }

  doConfetti() {
    this.toastService.showCongratsToast(this.streak, this.maxStreak)
    this.confettiService.canon()
  }

  onSubmit() {
    const numA = this.form.value.a
    const numB = this.form.value.b
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
        this.streak = 0;
        this.toastService.showWhoopsToast(answer)
      }
      this.focusInput()
    }
  }
}
