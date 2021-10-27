import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DataService } from '../Servicio/data.service';
import { SocketService } from 'src/app/Servicio/socket.service';

import * as moment from 'moment';
moment.locale('es');
import { AlertController } from '@ionic/angular';

import { Chart, ChartOptions } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-plugin-zoom';
Chart.plugins.register(zoomPlugin);

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: any;
  opciones: ChartOptions;
  data;
  interval;
  listData: any[] = [];

  constructor(
    private screenOrientation: ScreenOrientation,
    private dataService: DataService,
    private serviceSocket: SocketService,
    public alertController: AlertController,
    private cd: ChangeDetectorRef
  ) {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.opciones = {
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              color: 'black',
            },
            scaleLabel: {
              display: true,
              labelString: 'Tiempo',
              fontColor: '#909090',
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: 'black',
              borderDash: [2, 5],
            },
            scaleLabel: {
              display: true,
              labelString: 'FP',
              fontColor: '#909090',
            },
            ticks: {
              beginAtZero: true,
              min: 0,
            },
          },
        ],
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            enabled: true,
            mode: 'xy',
          },
        },
      },
    };
  }

  ngOnInit(): void {
    //  cCAMBIAR ORIENTACION DE PANTALLA
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE); // HORIZONTAL
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT); // VERTICAL
    this.screenOrientation.unlock();

    this.dataService
      .getHistorico(
        new Date(
          moment().startOf('day').toISOString()).getTime(),
        new Date(
          moment().endOf('day').toISOString()).getTime(),
        1
      )
      .toPromise()
      .then((data: any[]) => {
        console.log(data);

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map((x) => moment(x.datetime).format('HH')),
            datasets: [
              {
                label: 'FP',
                data: data.map((x) => x.value),
                fill: true,
                borderColor: '#2556d3',
                backgroundColor: '#233f874f',
                borderWidth: 1,
                lineTension: 0.3,
              },
            ],
          },
          options: this.opciones,
        });
      });

    this.data = this.serviceSocket.connect();
    this.data.next({ action: 'connectLive' });
    this.data.subscribe((data) => {
      console.log(data);

      if (data.Items) {
        clearInterval(this.interval);
        this.listData = data.Items;
        this.cd.detectChanges();

        this.interval = setInterval(() => {
          this.data.next({ action: 'connectLive' });
        }, 5000);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
