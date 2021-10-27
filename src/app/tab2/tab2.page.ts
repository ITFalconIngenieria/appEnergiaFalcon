import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { DataService } from '../Servicio/data.service';
import * as moment from 'moment';
moment.locale('es');
import { AlertController } from '@ionic/angular';

import { Chart, ChartOptions } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-plugin-zoom';
Chart.plugins.register(zoomPlugin);

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  @ViewChild('lineCanvas') public lineCanvas: ElementRef;
  lineChart: any;
  dataAnual: any[] = [];
  dataMes: any[] = [];
  dataDia: any[] = []; 
  fechaActual: any = moment().subtract(1, 'day');
  opSegment: string = 'dia';
  skeleton: boolean = true;
  constructor(
    private screenOrientation: ScreenOrientation,
    private dataService: DataService,
    public alertController: AlertController
  ) {
  }

  ngOnInit(): void {
    this.skeleton = true;
    this.consultar(
      moment(moment(this.fechaActual).startOf('day')).toISOString(),
      moment(moment(this.fechaActual).endOf('day')).toISOString(),
      1,
      'HH',
      `Grafica diaria del ${moment(this.fechaActual).format('DD MMMM YYYY')}`
    );
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.opSegment = ev.detail.value
    console.log(this.opSegment);
    switch (this.opSegment) {
      case 'dia': {
        this.fechaActual = moment().subtract(1, 'day');

        console.log(
          moment(this.fechaActual).startOf('day').toISOString(),
          moment(this.fechaActual).endOf('day').toISOString()
        );

        this.consultar(
          moment(this.fechaActual).startOf('day').toISOString(),
          moment(this.fechaActual).endOf('day').toISOString(),
          1,
          'HH',
          `Grafica diaria del ${moment(this.fechaActual).format('DD MMMM YYYY')}`
        );
        break;
      }
      case 'mes': {
        this.fechaActual = moment();
        console.log(moment(this.fechaActual).startOf('month').toISOString());
        console.log(moment(this.fechaActual).endOf('month').toISOString());

        this.consultar(
          moment(this.fechaActual).startOf('month').toISOString(),
          moment(this.fechaActual).endOf('month').toISOString(),
          2,
          'DD',
          `Grafica mensual de ${moment(this.fechaActual).format('MMMM')} `
        );
        break;
      }
      case 'anio': {
        this.fechaActual = moment();
        console.log(moment(this.fechaActual).startOf('year').toISOString());
        console.log(moment(this.fechaActual).endOf('year').toISOString());

        this.consultar(
          moment(this.fechaActual).startOf('year').toISOString(),
          moment(this.fechaActual).endOf('year').toISOString(),
          3,
          'MMMM',
          `Grafica anual del ${moment(this.fechaActual).format('YYYY')} `
        );
        break;
      }
      default:
        break;
    }

  }

  crearGrafica(data, formato, titulo) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((x) => moment(x.datetime).format(`${formato}`)),
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
      options: {
        title: {
          display: true,
          text: titulo
        },
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
      }
    });
  }

  consultar(fecha1, fecha2, op, formato, titulo) {
    this.skeleton = true;
    this.dataService.getHistorico(
      new Date(fecha1).getTime(),
      new Date(fecha2).getTime(),
      op
    )
      .toPromise().then((res: any[]) => {
        console.log(res);
        console.log(res.slice(0, res.length - 1));

        this.crearGrafica(res.slice(0, res.length - 1), formato, titulo);
        this.skeleton = false;

      })
  }

  siguiente() {
    switch (this.opSegment) {
      case 'dia': {
        this.fechaActual = moment(this.fechaActual).add(1, 'day');
        console.log(
          moment(this.fechaActual).startOf('day').toISOString(),
          moment(this.fechaActual).endOf('day').toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('day').toISOString(),
          moment(this.fechaActual).endOf('day').toISOString(),
          1,
          'HH',
          `Grafica diaria del ${moment(this.fechaActual).format('DD MMMM YYYY')}`
        );

        break;
      }
      case 'mes': {
        this.fechaActual = moment(this.fechaActual).add(1, 'month');
        console.log(
          moment(this.fechaActual).startOf('month').toISOString(),
          moment(this.fechaActual).endOf('month').toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('month').toISOString(),
          moment(this.fechaActual).endOf('month').toISOString(),
          2,
          'DD',
          `Grafica mensual de ${moment(this.fechaActual).format('MMMM')} `
        );
        break;
      }
      case 'anio': {
        this.fechaActual = moment(this.fechaActual).add(1, 'year');
        console.log(
          moment(this.fechaActual).startOf('year').toISOString(),
          moment(this.fechaActual).endOf('year').toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('year').toISOString(),
          moment(this.fechaActual).endOf('year').toISOString(),
          3,
          'MMMM',
          `Grafica anual del ${moment(this.fechaActual).format('YYYY')} `
        );
        break;
      }
      default:
        break;
    }

    // console.log(moment(this.fechaActual).format('YYYY-MM-DD HH:mm'));

    //   this.crearGrafica(res);
    // })
  }

  anterior() {
    switch (this.opSegment) {
      case 'dia': {
        this.fechaActual = moment(this.fechaActual).subtract(1, 'day');
        console.log(
          moment(moment(this.fechaActual).startOf('day')).toISOString(),
          moment(moment(this.fechaActual).endOf('day')).toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('day').toISOString(),
          moment(this.fechaActual).endOf('day').toISOString(),
          1,
          'HH',
          `Grafica diaria del ${moment(this.fechaActual).format('DD MMMM YYYY')}`
        );
        break;
      }
      case 'mes': {
        this.fechaActual = moment(this.fechaActual).subtract(1, 'month');
        console.log(
          moment(moment(this.fechaActual).startOf('month')).toISOString(),
          moment(moment(this.fechaActual).endOf('month')).toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('month').toISOString(),
          moment(this.fechaActual).endOf('month').toISOString(),
          2,
          'DD',
          `Grafica mensual de ${moment(this.fechaActual).format('MMMM')}`
        );
        break;
      }
      case 'anio': {
        this.fechaActual = moment(this.fechaActual).subtract(1, 'year');
        console.log(
          moment(moment(this.fechaActual).startOf('year')).toISOString(),
          moment(moment(this.fechaActual).endOf('year')).toISOString()
        );
        this.consultar(
          moment(this.fechaActual).startOf('year').toISOString(),
          moment(this.fechaActual).endOf('year').toISOString(),
          3,
          'MMMM',
          `Grafica anual del ${moment(this.fechaActual).format('YYYY')} `
        );
        break;
      }
      default:
        break;
    }
    //   this.dataService.getHistorico(
    //     new Date(
    //       moment(moment(this.fechaActual).subtract(1, 'day').startOf('day')).toISOString()).getTime(),
    //     new Date(
    //       moment(moment(this.fechaActual).subtract(1, 'day').endOf('day')).toISOString()).getTime(),
    //     1
    //   )
    //     .toPromise().then((res) => {
    //       console.log(res);
    //       this.fechaActual = moment(this.fechaActual).subtract(1, 'day');
    //       console.log(
    //         new Date(
    //           moment(moment(this.fechaActual).subtract(1, 'day').startOf('day')).toISOString()).getTime(),
    //         new Date(
    //           moment(moment(this.fechaActual).subtract(1, 'day').endOf('day')).toISOString()).getTime()
    //       );

    //       console.log(moment(this.fechaActual).format('YYYY-MM-DD HH:mm'));

    //       this.crearGrafica(res);
    //     })
  }
}
