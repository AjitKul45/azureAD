import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _distroy = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuradConfig: MsalGuardConfiguration,
    private msalbrodcastsevice: MsalBroadcastService,
    private authServie: MsalService
  ) {}

  ngOnInit(): void {
    this.msalbrodcastsevice.inProgress$
      .pipe(
        filter(
          (interactionStatus: InteractionStatus) =>
            interactionStatus == InteractionStatus.None
        ),
        takeUntil(this._distroy)
      )
      .subscribe((x) => {
        this.flag = this.authServie.instance.getAllAccounts().length > 0;
      });
  }

  ngOnDestroy(): void {
    this._distroy.next(undefined);
    this._distroy.complete();
  }

  title = 'azure_AD_authentication';
  flag: boolean = false;

  login() {
    console.log('in login');
    if (this.msalGuradConfig.authRequest) {
      this.authServie.loginRedirect({
        ...this.msalGuradConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authServie.loginRedirect();
    }
  }
  logout() {
    this.authServie.logoutRedirect();
  }
}
