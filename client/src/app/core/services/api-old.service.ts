import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateEchoInput, Echo} from "../../models/echo.model";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiOldService {

  private readonly baseUrl: string = environment.api.baseUrl;

  constructor(private http: HttpClient) {
  }

  createEcho(echo: CreateEchoInput): Observable<Echo> {
    return this.http.post<Echo>(
      `${this.baseUrl}/echo`,
      echo
    ).pipe(
      catchError((err: any) => {
        console.log('In Service:', err);
        return throwError(err);
      })
    );
  }

  doError(): Observable<Echo> {
    return this.http.post<Echo>(
      `${this.baseUrl}/echo`,
      {}
    ).pipe(
      catchError((err: any) => {
        console.log('In Service:', err);
        return throwError(err);
      })
    );
  }

  getEchos(contains?: string): Observable<Echo[]> {
    return this.http.get<Echo[]>(
      `${this.baseUrl}/echo`,
      {
        params: contains ? {
          contains
        } : undefined
      }
    );
  }
}
