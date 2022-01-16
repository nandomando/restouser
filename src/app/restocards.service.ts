import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Restocard } from './restocard.model';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface CardFetch {
  imageUrl: string;
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
        `https://restorestaurant-11270.firebaseio.com/restocards.json?`
      ).subscribe(resData => {
        console.log(resData)
        const restocards = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            console.log(restocards);
            restocards.push(
              new Restocard(
                key,
                resData[key].imageUrl,
                resData[key].name,
                resData[key].address,
                resData[key].userId,
              )
            );
          }
        }
        this._restocards.next(restocards);
        console.log(restocards);
        // return [];
      });
    }
}
