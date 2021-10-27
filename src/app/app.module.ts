import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FusionChartsModule } from "angular-fusioncharts";
import * as FusionCharts from "fusioncharts";

import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import * as zoomline from "fusioncharts/fusioncharts.zoomline";

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, zoomline);

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { HttpClientModule } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FusionChartsModule, 
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}) ],
  providers: [ScreenOrientation,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
