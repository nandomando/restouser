import { Component, OnInit, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestocardsService } from '../restocards.service';
import { Subscription } from 'rxjs';
import { Restocard } from '../restocard.model';
import { UsercardsService } from '../usercards.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

import { Usercard } from '../usercard.model';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  isLoading = false;
  loadedrestocards: Restocard[];
  loadedusercards: Usercard[];
  filterseachedRestocards: Restocard[];
  private restocardsSub: Subscription;
  private usercardSub: Subscription;
  private filterrestocardsub: Restocard[];

  constructor(
    private http: HttpClient,
    private restocardsService: RestocardsService,
    private usercardsService: UsercardsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) {
     }

    ngOnInit() {
      this.restocardsSub = this.restocardsService.restocards.subscribe(places => {
        this.loadedrestocards = places;
      });
      this.usercardSub = this.usercardsService.usercards.subscribe(cards => {
        this.loadedusercards = cards;
      });
    }

    ionViewWillEnter() {
      this.isLoading = true;
      this.restocardsService.fetchRestocartas();
      this.usercardsService.fetchUserCards().subscribe(() => {
        this.isLoading = false;
      });
    }

    ngOnDestroy() {
      if (this.restocardsSub) {
        this.restocardsSub.unsubscribe();
      }
      if (this.usercardSub) {
        this.usercardSub.unsubscribe();
      }
    }

    test() {
    }

    search(a) {
      this.filterseachedRestocards = this.loadedrestocards.filter(element =>
        element.name.toLocaleLowerCase().includes(a.target.value) || element.address.toLocaleLowerCase().includes(a.target.value));
      console.log(this.filterseachedRestocards);
    }



createusercard(photo, name, address, restoId) {
      for (const element of this.loadedusercards) {
        if (restoId === element.restoId) {
          this.alertCtrl
          .create({
            header: 'You have already this card',
            message: 'Please try another one',
            buttons: ['Okay']
          })
          .then(alertEl => alertEl.present());
          return;
        }
      }
      this.loadingCtrl.create({
        message: 'Adding Card...'
      }).then(loadingEl => {
        loadingEl.present();
        this.usercardsService.addUsercard(
          photo,
          name,
          address,
          restoId
        ).subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/', 'tabs', 'tab', 'cards']);
        });
      });
    }



}
