import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
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
        // tslint:disable-next-line: max-line-length
        'https://firebasestorage.googleapis.com/v0/b/resto-57119.appspot.com/o/images%2F29e16426-cd74-4d7d-9282-e0dbf12916e2-icon.jpg?alt=media&token=29e16426-cd74-4d7d-9282-e0dbf12916e2',
        'Your Name',
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

  getUserinfo(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<UserData>(
          `https://resto-57119.firebaseio.com/usersinfo/${id}.json?auth=${token}`
        );
      }),
      map(infoData => {
        return new Userinfo(
          id,
          infoData.photo,
          infoData.name,
          infoData.email,
          infoData.userId,
        );
      })
    );
  }

  updateUserInfo(userInfoId: string, name: string, photo: string) {

    let updatedUserInfo: Userinfo[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.usersinfo;
      }),
      take(1),
      switchMap(userinfo => {
        if (!userinfo || userinfo.length <= 0) {
          return this.fetchUserInfo();
        } else {
          return of(userinfo);
        }
      }),
      switchMap(userinfo => {
        const updatedInfouserIndex = userinfo.findIndex(user => user.id === userInfoId);
        updatedUserInfo = [...userinfo];
        const oldUserinfo = updatedUserInfo[updatedInfouserIndex];
        updatedUserInfo[updatedInfouserIndex] = new Userinfo(
          oldUserinfo.id,
          photo,
          name,
          oldUserinfo.email,
          oldUserinfo.userId,
        );
        return this.http.put(
          `https://resto-57119.firebaseio.com/usersinfo/${userInfoId}.json?auth=${fetchedToken}`,
          { ...updatedUserInfo[updatedInfouserIndex], id: null }
        );
      }),
      tap(() => {
        this._usersInfo.next(updatedUserInfo);
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-resto-57119.cloudfunctions.net/storeImage',
          uploadData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }



}
