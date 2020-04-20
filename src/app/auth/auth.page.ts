import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { UserinfoService } from '../userinfo.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;
  emailstring: string;
  currentuseremailinfo: string;


  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userinfoService: UserinfoService
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            this.currentuseremailinfo = resData.email;
            this.isLoading = false;
            loadingEl.dismiss();
            if (resData.registered) {
              this.router.navigateByUrl('/tabs/tab/home');
            } else {
              this.userinfoService.createuserinfo(this.currentuseremailinfo);
              this.router.navigateByUrl('/tabs/tab/home');
            }
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }


  emailgetter(ev) {
    this.emailstring = ev.target.value;
  }

  resetPassword() {
    if (!this.emailstring) {
      this.alertCtrl
      .create({
        header: 'To Reset Password',
        message: 'Please enter an E-mail',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
    } else {
      this.alertCtrl.create({
        header: 'Reset Password',
        message: 'Are you sure you want to reset your password?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.authService.resetpassword(this.emailstring);
            }
          }
        ]
      }).
      then(alertEl => alertEl.present());
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
