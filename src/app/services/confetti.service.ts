import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  public canon(): void {
    confetti({
      shapes: ['star', 'circle'],
      angle: 0,
      spread: 360,
      particleCount: 500,
      origin: { y: 0.5 }
    });
  }

  private randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
