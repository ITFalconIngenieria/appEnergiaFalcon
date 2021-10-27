import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getHistorico(fechai, fechaf, intervalo) {
    return this.http.get(
      `https://8yjpszk4l7.execute-api.us-east-1.amazonaws.com/api/histdata?fechai=${fechai}&fechaf=${fechaf}&intervalo=${intervalo}&variable=motor1/factorPotencia/`
    );
  }

  dataHistorica(fechai, fechaf): Observable<any> {
    return forkJoin(
      this.http.get(
        `https://8yjpszk4l7.execute-api.us-east-1.amazonaws.com/api/histdata?fechai=${fechai}&fechaf=${fechaf}&intervalo=1&variable=motor1/factorPotencia/`
      ),
      this.http.get(
        `https://8yjpszk4l7.execute-api.us-east-1.amazonaws.com/api/histdata?fechai=${fechai}&fechaf=${fechaf}&intervalo=2&variable=motor1/factorPotencia/`
      ),
      this.http.get(
        `https://8yjpszk4l7.execute-api.us-east-1.amazonaws.com/api/histdata?fechai=${fechai}&fechaf=${fechaf}&intervalo=1&variable=motor1/factorPotencia/`
      )
    );
  }
}
