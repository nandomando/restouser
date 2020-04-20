import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserinfoService } from '../userinfo.service';
import { Userinfo } from '../userinfo.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  loadeduserinfo: Userinfo[];
  isLoading = false;
  private infosSub: Subscription;

  constructor(
    private userinfoService: UserinfoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.infosSub = this.userinfoService.usersinfo.subscribe(card => {
      this.loadeduserinfo = card;
    });
  }

  test() {
    // // this.userinfoService.fetchUserinfos();
    // this.userinfoService.getUserInfo();

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.userinfoService.fetchUserInfo().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.infosSub) {
      this.infosSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

}
