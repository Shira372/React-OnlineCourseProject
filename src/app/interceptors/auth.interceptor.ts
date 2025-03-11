import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

//כל פעם שתעשה בקשת HTTP, אם יש טוקן, הוא יתווסף לבקשה, אחרת לא יתבצע שום שינוי.

//כל פעם שאני עושה בקשה ל API זה עובר דרך ה-Interceptor-כי יבאתי אותו ב provideHttpClient
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
 console.log('in interceptor');
 
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
   const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedRequest);
  }
  return next(req);
};