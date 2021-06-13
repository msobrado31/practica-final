import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from 'src/interfaces/person';

const httpOptions = {
  headers : new HttpHeaders ({
    'Content-Type': 'application/json',
    'Authorization' : 'my-auth-token',
    'Access-Control-Allow-Origin' : '*'
  })
};

const api = "http://localhost:5000"

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  constructor(private http : HttpClient) {}

  getUsers() : any {                   //coger usuarios del servidor
    this.http.get<Person[]>(api+"/users").subscribe((res) => {
      return res as Person[];
    });
  }

  addUser(user : Person) : Observable<Person> {        //añadir un usuario al servidor
    return this.http.post<Person>(api+"/users", user, httpOptions).pipe(
      catchError(this.handleError('addUser', user))
    );
  }

  updateUser(user : Person) : Observable<Person> {      //actualiza un usuario en el servidor
    return this.http.put<Person>(api+"/users/"+user._id, user, httpOptions).pipe(
      catchError(this.handleError('updateUser', user))
    );
  }

  deleteUser(user : Person) : Observable<Person> {       //borra un usuario en el servidor
    return this.http.delete<Person>(api+"/user/"+user._id, httpOptions).pipe(
      catchError(this.handleError('deleteUser', user))
    );
  }

  private handleError<T> (operation = 'operation', result? : T){
    return (error : any) : Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }

}
