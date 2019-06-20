import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CreditsPage } from '../credits/credits';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CreditsPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
