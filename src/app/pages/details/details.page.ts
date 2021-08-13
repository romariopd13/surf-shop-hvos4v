import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  product: Product = {}
  productId: string = null
  loading: any;
  productsSubscription: Subscription;
  constructor(
    private productsService: ProductService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];
    if (this.productId) this.loadProduct();
  }

  ngOnInit() {
  }

  async saveProduct() {
    await this.presentLoading();

    this.product.userId = (await this.authService.getAuth().currentUser).uid
    if (this.productId) {
      try {
        await this.productsService.updateProduct(this.productId, this.product)
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home')
      } catch (error) {
        console.error(error);

        this.presentToast(error.message)
        this.loading.dismiss();
      }

    } else {
      this.product.createdAt = new Date().getTime();
      try {
        await this.productsService.addProduct(this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home')
      } catch (error) {
        console.error(error);

        this.presentToast(error.message)
        this.loading.dismiss();
      }
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
  loadProduct() {
    this.productsSubscription = this.productsService.getProduct(this.productId).subscribe(res => {
      this.product = res
    })
  }
}
