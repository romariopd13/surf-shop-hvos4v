import { Component, OnInit } from '@angular/core';
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
  constructor(
    private productsService: ProductService,
    private authService: AuthService
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
  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
