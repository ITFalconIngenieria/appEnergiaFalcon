import { IonicModule } from '@ionic/angular';
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';

// Import angular-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';

import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as zoomline from "fusioncharts/fusioncharts.zoomline";

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme, zoomline);
import 'hammerjs';
import 'chartjs-plugin-zoom';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FusionChartsModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class Tab1PageModule {}
