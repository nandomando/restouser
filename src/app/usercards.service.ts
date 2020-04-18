import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usercard } from './usercard.model';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';


interface UserCardFetch {
  id: string;
  photo: string;
  name: string;
  address: string;
  points: number;
  freemeal: number;
  restoId: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsercardsService {

  private _usercards = new BehaviorSubject<Usercard[]>([]);

  get usercards() {
    return this._usercards.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  fetchUserCards() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(switchMap(userId => {
      if (!userId) {
        throw new Error('User not found!');
      }
      fetchedUserId = userId;
      return this.authService.token;
    }),
    take(1),
    switchMap(token => {
      return this.http
      .get<{[key: string]: UserCardFetch}>(
        `https://resto-57119.firebaseio.com/usercards.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
      );
    }),
    map(resData => {
      const Usercardarr = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          Usercardarr.push(new Usercard(
            key,
            resData[key].photo,
            resData[key].name,
            resData[key].address,
            resData[key].points,
            resData[key].freemeal,
            resData[key].restoId,
            resData[key].userId,
            )
          );
        }
      }
      return Usercardarr;
    }),
    tap(usercards => {
      this._usercards.next(usercards);
    })
    );
  }



  addUsercard(
    photo: string,
    name: string,
    address: string,
    restoId: string,
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newUsercard: Usercard;
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
      newUsercard = new Usercard(
        Math.random().toString(),
        photo,
        name,
        address,
        0,
        0,
        restoId,
        fetchedUserId
      );
      return this.http
      .post<{name: string}>(`https://resto-57119.firebaseio.com/usercards.json?auth=${token}`,
        { ...newUsercard, id: null});
    }),
      switchMap( resData => {
        generatedId = resData.name;
        return this.usercards;
      }),
      take(1),
      tap(usercards => {
        newUsercard.id = generatedId;
        this._usercards.next(usercards.concat(newUsercard));
      })
      );
  }
}
