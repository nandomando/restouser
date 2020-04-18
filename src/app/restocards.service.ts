import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Restocard } from './restocard.model';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface CardFetch {
  photo: string;
  name: string;
  address: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestocardsService {

  restocardsservice = null;

  private _restocards = new BehaviorSubject<Restocard[]>([]);

  get restocards() {
    return this._restocards.asObservable();
  }

  constructor(
    private http: HttpClient,
    ) { }

    fetchRestocartas() {
      return this.http.get<{ [key: string]: CardFetch }>(
        `https://restorestaurant-5f11f.firebaseio.com/restocards.json?`
      ).subscribe(resData => {
        const restocards = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            restocards.push(
              new Restocard(
                key,
                resData[key].photo,
                resData[key].name,
                resData[key].address,
                resData[key].userId,
              )
            );
          }
        }
        this._restocards.next(restocards);
        // return [];
      });
      // tap(places => {
      //   this._restocards.next(places);
      // });
    }
}
