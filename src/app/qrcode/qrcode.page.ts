import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  createdCode = null;
  uId = null;
  isLoading = false;

  userId = this.authService.userId.subscribe(data => {
    this.uId = data;
  });



  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.createCode();
    this.isLoading = false;
  }

  createCode() {
    this.createdCode = this.uId;
    console.log(this.createdCode);
  }

}
