import { Component } from '@angular/core';
import { NavController,AlertController,Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

      constructor(public navCtrl: NavController,
    private platform: Platform,
    public alertCtrl: AlertController,
    public localNotifications: LocalNotifications ) {

    this.platform.ready()
    .then(()=>{
    console.log(this.platform.is('android'))
    this.localNotifications.schedule({
          id: 1,
          text: 'Single LocalNotification',
          sound: this.setSound(),
          data: { secret: 'hellloo' }
        });
       });
    }
    setSound()
    {
if (this.platform.is('android')) {
return 'https://notificationsounds.com/notification-sounds/cheerful-527'
    } else {
    return 'https://notificationsounds.com/message-tones/jingle-bells-sms-523'
    }
  }

   }
    
    
