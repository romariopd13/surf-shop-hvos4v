import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: Product[] = [];
  productsSubscription: Subscription;
  loading: any;
  constructor(
    private productsService: ProductService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    this.productsSubscription = this.productsService.getProducts().subscribe(res => {
      this.products = res;
    })
  }

  ngOnInit() {
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);

    }
  }
  async deleteProduct(id: string) {
    await this.presentLoading();
    try {
      await this.productsService.deleteProduct(id)
      await this.loading.dismiss();
      await this.presentToast("Produto excluído com sucesso!")

    } catch (error) {
      this.presentToast(error.message)
      this.loading.dismiss();
    }
  }
  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
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
