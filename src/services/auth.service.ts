import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin, UserRegister } from '../models/user';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // רישום משתמש חדש
  register(user: UserRegister): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/register', user);
  }

  // כניסת משתמש למערכת
  login(user: UserLogin): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/login', user);
  }

  // שמירת טוקן ב-sessionStorage
  saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  // שליפת טוקן מ-sessionStorage
  getToken() {
    return sessionStorage.getItem('token');
  }

  // התנתקות
  logout() {
    sessionStorage.removeItem('token');
  }

  // שליפת שם המשתמש מתוך ה-token
  getUserNameFromToken(): string {
    const token = this.getToken()
    if (!token) return '';
    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken.userName;
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error);
      return '';
    }
  }

  // שליפת כל המשתמשים - רק למנהל מערכת
  getUsers(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/users');
  }

  // שליפת פרטי משתמש לפי ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/users/${id}`);
  }

  // עדכון פרטי משתמש לפי ID
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/api/users/${id}`, userData);
  }

  // מחיקת משתמש לפי ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/api/users/${id}`);
  }
}
