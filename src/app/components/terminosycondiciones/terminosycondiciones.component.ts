import { Component, OnInit } from '@angular/core';
import { CheckboxCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-terminosycondiciones',
  templateUrl: './terminosycondiciones.component.html',
  styleUrls: ['./terminosycondiciones.component.scss'],
})
export class TerminosycondicionesComponent  implements OnInit {

  canDismiss = false;

  presentingElement = null;

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  onTermsChanged(event: Event) {
    const ev = event as CheckboxCustomEvent;
    this.canDismiss = ev.detail.checked;
  }

}
