import { CanActivateFn,Router} from '@angular/router';
import { inject } from '@angular/core';
import { CoursesService } from '../services/courses.service';

export const courseManagerGuard: CanActivateFn = (route, state) => {
  const isLogin=sessionStorage.getItem('token');
  const router=inject(Router);
  const service=inject(CoursesService);
  const status=service.getRoleByToken();
  console.log(status);
  
  if(status==='admin'||status==='teacher'){
    return true;
  }
    return false;
};


