import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Plugins } from '@capacitor/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  createdCode = null;
  uId = null;

  userId = this.authService.userId.subscribe(data => {
    this.uId = data;
  });



  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.createCode();
  }

  createCode() {
    this.createdCode = this.uId;
    console.log(this.createdCode);
  }

}