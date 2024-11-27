import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  baseUrl: string = 'https://towns.online-tech.co.uk/api/v1'

  constructor(private _http: HttpClient) { }

  public getRegion() : Observable<any> {
    return new Observable(observer => {
      this._http.get(`${this.baseUrl}/regions`).subscribe((res) => {
        try {
          observer.next(res);
        } catch (e) {
          observer.error(e);
        }
      })
    })
  }

  public getCountry() : Observable<any> {
    return new Observable(observer => {
      this._http.get(`${this.baseUrl}/countries`).subscribe((res) => {
        try {
          observer.next(res);
        } catch (e) {
          observer.error(e);
        }
      })
    })
  }

  public getTown(postcode: string) : Observable<any> {
    return new Observable(observer => {
      this._http.get(`${this.baseUrl}/towns/postcode-district/${postcode}`).subscribe((res) => {
        observer.next(res);
        observer.error('Error when fetching data');
      })
    })
  }

  public getPostCode() : Observable<any> {
    return new Observable(observer => {
      this._http.get(`${this.baseUrl}/postcode-districts`).subscribe((res) => {
        observer.next(res);
        observer.error('Error when fetching data');
      })
    })
  }

}
