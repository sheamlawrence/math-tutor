import {Injectable, NgZone} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {
  }

  getCongratsMessage(streak: number, maxStreak: number) {
    console.log('streak:',streak)
    const messages = ["Great Job!!! Keep it up!",
      "You're on a roll!",
      "Wow, you have a streak of " + streak + "! Let's try to get up to " + (streak + 5),
      "Wow! " + (maxStreak > streak ? "You can beat your Max Streak of " + maxStreak + " I bet!" : "You're maxStreak is going up!"),
      "If it's too easy for someone as smart as you, try adjusting the Max Number setting :)",
      "You're great at this!",
      "You're on a great streak!",
      "You've been practicing!"]
    return messages[Math.floor(Math.random() * messages.length)];
  }

  public showCongratsToast(streak: number, maxStreak: number) {
    const message = this.getCongratsMessage(streak, maxStreak)
    this.zone.run(() => {
      this.snackBar.open(message, '', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }

  public showWhoopsToast(invalidAnswer: number) {
    const message = 'Close, but ' + invalidAnswer + ' is not correct.  Try again, you got this!'
    this.zone.run(() => {
      this.snackBar.open(message, '', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }
}
