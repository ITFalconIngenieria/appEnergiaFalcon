import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PushService {
    headers_object;
    audioAlerta = new Audio('assets/audio/audio.mp3');
    interval: any;
    userID: string;
    appID: string;

    constructor(private oneSignal: OneSignal, private http: HttpClient) {
        this.headers_object = new HttpHeaders().set(
            'Authorization',
            'Basic OTljMjczOWYtYjM2ZC00MWZhLTk0NTMtYTg1M2FiZjg3MGRi'
        );
        this.audioAlerta = new Audio('assets/audio/audio.mp3');
        this.appID = '25ddcd06-0d5e-4cfb-add3-324282cc167f';
    }

    configuracion() {
        this.oneSignal.startInit(
            '25ddcd06-0d5e-4cfb-add3-324282cc167f',
            '115333608485'
        );

        this.oneSignal.inFocusDisplaying(
            this.oneSignal.OSInFocusDisplayOption.InAppAlert
        );

        this.oneSignal.handleNotificationReceived().subscribe(() => {
            // do something when notification is received
            this.audioAlerta.play();
            this.interval = setInterval(() => {
                this.audioAlerta.play();
            }, 3000);
        });

        this.oneSignal.handleNotificationOpened().subscribe((noti) => {
            // do something when a notification is opened
            clearInterval(this.interval);
        });

        this.oneSignal.getIds().then((info) => {
            this.userID = info.userId;
        });

        this.oneSignal.endInit();
    }

    enviarNoti() {
        let dataMessage = {
            app_id: this.appID,
            included_segments: ['Active Users', 'Inactive Users'],
            contents: {
                es: 'Alarma',
                en: 'Alarm from app',
            },
            headings: {
                es: 'Alarm',
                en: 'Alarm motor',
            },
            large_icon: 'assets/imagenes/warning.png',
        };

        return this.http.post(
            'https://onesignal.com/api/v1/notifications',
            dataMessage,
            { headers: this.headers_object }
        );
    }

    viewNotifications() {
        return this.http.get(
            'https://onesignal.com/api/v1/notifications/?app_id=dc4674d5-e24f-4dfc-b1f3-45e5fa8ccbcc',
            { headers: this.headers_object }
        );
    }
}
