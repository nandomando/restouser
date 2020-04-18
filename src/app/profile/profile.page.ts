import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsercardsService } from '../usercards.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private authService: AuthService,
    private usercardsService: UsercardsService
    ) { }

  ngOnInit() {
  }



  onLogout() {
    this.authService.logout();
  }

}
