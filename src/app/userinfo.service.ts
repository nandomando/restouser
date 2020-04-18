import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Userinfo } from './userinfo.model';


@Injectable({
  providedIn: 'root'
})
export class UserinfoService {


  private _usersInfo = new BehaviorSubject<Userinfo[]>([]);

  get usersinfo() {
    return this._usersInfo.asObservable();
  }

  constructor() { }


}
