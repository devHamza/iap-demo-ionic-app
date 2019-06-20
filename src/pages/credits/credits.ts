import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IAPQueryCallback, IAPProduct, IAPError, InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { CreditType } from '../../core/models/credits/CreditType';
import { CreditsProvider } from '../../core/providers/credits/credits.provider';

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html'
})
export class CreditsPage {
  public static INAPP_PRODUCTS_IDS = ['credits_10', 'credits_50', 'credits_100'];

  onProductApproved: IAPQueryCallback = function (product: IAPProduct) {
    console.log('onProductApproved', product);
    this.purchaseProduct(product);
  }.bind(this);
  onProductCancelled: IAPQueryCallback = function (product: IAPProduct) {
    console.log('onProductCancelled', product);
    this.showCanceledPurchaseMessage();
  }.bind(this);
  onProductError: IAPQueryCallback = function (error: IAPError) {
    console.log('onProductError', error);
    this.showUnexpectedErrorMessage();
  }.bind(this);
  onProductUpdated: IAPQueryCallback = function (product: IAPProduct) {
    console.log('onProductUpdated', product);
    this.refreshProduct(product);
  }.bind(this);

  displayedPrices = {};


  constructor(public navCtrl: NavController, 
    private inAppPurchase: InAppPurchase2, 
    private zone: NgZone,
    private creditsProvider: CreditsProvider) {
    //init product prices 
    CreditsPage.INAPP_PRODUCTS_IDS.forEach(productId => {
      this.displayedPrices[productId] = '--<sup class="currency">--</sup>';
    });
  }

  ionViewDidEnter() {
    this.showLoader();
    this.inAppPurchase.ready(() => {
      this.initProductListeners();
      this.hideLoader();
    });
  }

  ionViewDidLeave() {
    this.inAppPurchase.off(this.onProductApproved);
    this.inAppPurchase.off(this.onProductCancelled);
    this.inAppPurchase.off(this.onProductError);
    this.inAppPurchase.off(this.onProductUpdated);
  }

  private initProductListeners() {
    this.inAppPurchase.validator = function (product: IAPProduct, callback) {

      //Verify the transaction data 
      const transactionType: CreditType = this.platform.is('ios') ? CreditType.IOS : CreditType.ANDROID;
      const transactionReceipt: string = this.platform.is('ios') ? product.transaction.appStoreReceipt : product.transaction.receipt;
      this.showLoader();
      this.creditsProvider.purchase(transactionType, transactionReceipt)
        .subscribe(response => {
          this.hideLoader();
          if (response.status === 'success') {
            callback(true, product.transaction);
            this.showSuccessPurchaseMessage();
            product.finish();
          } else {
            this.showPurchaseErrorMessage();
          }
          callback(false, 'validation-fails');

        }, err => {
          this.hideLoader();
          this.showPurchaseErrorMessage();
          callback(false, 'validation-fails');
        });
      console.log('inAppPurchase.validator', JSON.stringify(product));
    }.bind(this);

    CreditsPage.INAPP_PRODUCTS_IDS.forEach(productId => {
      this.inAppPurchase.when(productId).approved(this.onProductApproved);

      this.inAppPurchase.when(productId).cancelled(this.onProductCancelled);

      this.inAppPurchase.when(productId).error(this.onProductError);

      this.inAppPurchase.when(productId).updated(this.onProductUpdated);

      this.refreshProduct(this.inAppPurchase.get(productId));
    });
  }


  private refreshProduct(product: any) {
    console.log('refreshProduct', JSON.stringify(product));

    if (!!product.id && !!product.priceMicros) {
      this.zone.run(() => {
        this.displayedPrices[product.id] = (product.priceMicros / 1000000).toFixed(2) + '<sup class="currency" >' + product.currency + '</sup>';
      });
    }
  }

  private showUnexpectedErrorMessage() {
    // TODO : Show error dialog 
  }

  private showPurchaseErrorMessage() {
    // TODO : Show error dialog 
  }

  private showCanceledPurchaseMessage() {
    // TODO : Show error dialog 
  }

  private showSuccessPurchaseMessage() {
    // TODO : Show success dialog
  }

  private hideLoader() {
    // TODO : Hide loader spinner
  }

  private showLoader() {
    // TODO : Show loader spinner
  }




}
