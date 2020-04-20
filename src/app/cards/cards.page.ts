import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsercardsService } from '../usercards.service';
import { Usercard } from '../usercard.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit, OnDestroy {


  loadedusercard: Usercard[];
  isLoading = false;
  private cardsSub: Subscription;

  constructor(
    private usercardsService: UsercardsService,
  ) {}

  ngOnInit() {
    this.cardsSub = this.usercardsService.usercards.subscribe(cards => {
      this.loadedusercard = cards;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.usercardsService.fetchUserCards().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.cardsSub) {
      this.cardsSub.unsubscribe();
    }
  }

}
