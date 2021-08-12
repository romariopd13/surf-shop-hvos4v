import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  wavesPosition: number = 0;
  wavesDifference: number = 80;
  constructor() { }

  ngOnInit() {
  }

  segmentChanged(event) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference
    }
  }
}
