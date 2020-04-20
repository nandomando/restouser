import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Userinfo } from './userinfo.model';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { LoadingController } from '@ionic/angular';

interface UserData {
  id: string;
  photo: string;
  name: string;
  email: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {



  private _usersInfo = new BehaviorSubject<Userinfo[]>([]);

  get usersinfo() {
    return this._usersInfo.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) { }


  fetchUserInfo() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
      if (!userId) {
        throw new Error('User not found!');
      }
      fetchedUserId = userId;
      return this.authService.token;
    }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: UserData}>(
          `https://resto-57119.firebaseio.com/usersinfo.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
       map(resData => {
         const userinfoarr = [];
         for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          userinfoarr.push(new Userinfo(
            key,
            resData[key].photo,
            resData[key].name,
            resData[key].email,
            resData[key].userId,
            )
          );
        }
      }
         console.log(userinfoarr);
         return userinfoarr;
    }),
    tap(userinfos => {
      this._usersInfo.next(userinfos);
    }));
  }


  addUserinfo(
    email: string,
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newUserinfo: Userinfo;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
    switchMap(token => {
      if (!fetchedUserId) {
        throw new Error('No user found');
      }
      newUserinfo = new Userinfo(
        Math.random().toString(),
        'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        'Name',
        email,
        fetchedUserId
      );
      return this.http
      .post<{name: string}>(`https://resto-57119.firebaseio.com/usersinfo.json?auth=${token}`,
        { ...newUserinfo, id: null });
    }),
      switchMap( resData => {
        generatedId = resData.name;
        return this.usersinfo;
      }),
      take(1),
      tap(userinfo => {
        newUserinfo.id = generatedId;
        this._usersInfo.next(userinfo.concat(newUserinfo));
      })
      );
  }


  createuserinfo(email) {
    this.loadingCtrl.create({
      // message: 'Creating...'
    }).then(loadingEl => {
      // loadingEl.present();
      this.addUserinfo(email)
      .subscribe(() => {
        // loadingEl.dismiss();
      });
    });
  }


}
