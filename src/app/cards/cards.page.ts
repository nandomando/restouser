import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsercardsService } from '../usercards.service';
import { Usercard } from '../usercard.model';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit, OnDestroy {


  loadedusercard: Usercard[];
  listedLoadedusercard: Usercard[];
  relevantusercard: Usercard[];
  isLoading = false;
  private cardsSub: Subscription;

  constructor(
    private usercardsService: UsercardsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cardsSub = this.usercardsService.usercards.subscribe(cards => {
      this.loadedusercard = cards;
      this.relevantusercard = this.loadedusercard;
      this.listedLoadedusercard = this.relevantusercard.slice(1);
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
