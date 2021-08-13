import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  wavesPosition: number = 0;
  wavesDifference: number = 80;
  userLogin: User = {}
  userRegister: User = {}
  loading: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

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
  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin)
    } catch (error) {
      console.error(error);
      let message: string;
      switch (error.code) {
        case 'auth/wrong-password': message = "A senha é inválida ou o usuário não possui uma senha."
          break;

        case 'auth/user-not-found': message = "O endereço de e-mail está formatado incorretamente."
          break;
      }
      this.presentToast(message)
    } finally {
      this.loading.dismiss();
    }
  }
  async register() {
    await this.presentLoading();
    try {
      await this.authService.register(this.userRegister)
    } catch (error) {
      console.error(error);
      let message: string;
      switch (error.code) {
        case 'auth/email-already-in-use': message = "O endereço de e-mail já está sendo usado por outra conta."
          break;

        case 'auth/invalid-email': message = "O endereço de e-mail está formatado incorretamente."
          break;
      }
      this.presentToast(message)
    } finally {
      this.loading.dismiss();
    }
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
