import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';

import { TabsPage } from '../pages/tabs/tabs';
import { CreditsPage } from '../pages/credits/credits';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private inAppPurchase: InAppPurchase2) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.refreshAppProducts();
    });
  }

  private refreshAppProducts() {
    this.inAppPurchase.verbosity = this.inAppPurchase.DEBUG;
    CreditsPage.INAPP_PRODUCTS_IDS.forEach(productId => {
      this.inAppPurchase.register({
        id: productId,
        type: this.inAppPurchase.CONSUMABLE,
        alias: productId
      });
    });
    this.inAppPurchase.refresh();
  }
}
