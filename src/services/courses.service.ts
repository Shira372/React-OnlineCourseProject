import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Lesson } from '../models/course';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courseSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  private myCourseSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  allCourses$: Observable<Course[]>;
  myCourses$: Observable<Course[]>;
  constructor(private http: HttpClient) {
    this.allCourses$ = this.courseSubject.asObservable();
    this.myCourses$ = this.myCourseSubject.asObservable();
  }
  getCourses() {
    this.http.get<Course[]>('http://localhost:3000/api/courses').subscribe({
      next: (data) => {
        data.forEach(course => {
          this.getLessonsByCourse(course.id)
        })
        this.courseSubject.next(data);
      },
      error: (error) => {
        console.error('Failed to fetch courses', error);
      }
    })
  }
  getMyCourses() {
    const studentId = this.getUserIdByToken()
    this.http.get<Course[]>(`http://localhost:3000/api/courses/student/${studentId}`).subscribe({
      next: (data) => {
        data.forEach(course => {
          this.getLessonsToMyCourse(course.id)
        })
        this.myCourseSubject.next(data)
      }, error: (e) => {
        console.error('Failed to fetch my courses', e);
      }
    })
  }
  getLessonsByCourse(courseId: number) {
    this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`).subscribe({
      next: (lessons) => {
        const courses = this.courseSubject.getValue();
        const courseToUpdate = courses.find(course => course.id === courseId);
        if (courseToUpdate) {
          courseToUpdate.lessons = lessons;
          this.courseSubject.next([...courses]);
        }
      }
    });
  }
  getLessonsToMyCourse(courseId: number) {
    this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`).subscribe({
      next: (lessons) => {
        const courses = this.myCourseSubject.getValue();
        const courseToUpdate = courses.find(course => course.id === courseId);
        if (courseToUpdate) {
          courseToUpdate.lessons = lessons;
          this.myCourseSubject.next([...courses]);
        }
      }
    });
  }
  addNewCourse(course: Course) {
    this.http.post<any>('http://localhost:3000/api/courses', course).subscribe({
      next: (response) => {
        this.getCourses()
      }, error: (e) => {

      }
    })
  }
  updateCourse(course: Course) {
    this.http.put(`http://localhost:3000/api/courses/${course.id}`, course).subscribe({
      next: (response) => {
        this.getCourses()
      }, error: (e) => {

      }
    })
  }
  deleteCourse(courseId: number) {
    this.http.delete(`http://localhost:3000/api/courses/${courseId}`).subscribe({
      next: (response) => {
        this.getCourses();
      }, error: (e) => {
      }
    })
  }

  deleteLesson(courseId: number, lessonId: number) {
    this.http.delete(`http://localhost:3000/api/courses/${courseId}/lessons/${lessonId}`).subscribe({
      next: response => {
        this.getCourses();
        this.getLessonsByCourse(courseId)
      }, error: (e) => {

      }
    })
  }
  addLesson(lesson: Lesson) {
    this.http.post<Lesson>(`http://localhost:3000/api/courses/${lesson.courseId}/lessons`, lesson).subscribe({
      next: (response) => {
        this.getCourses();
        this.getLessonsByCourse(lesson.courseId)

      }, error: (e) => {

      }
    })
  }
  updateLesson(lesson: Lesson) {
    this.http.put(`http://localhost:3000/api/courses/${lesson.courseId}/lessons/${lesson.id}`, lesson).subscribe({
      next: (response) => {
        this.getCourses();
        this.getLessonsByCourse(lesson.courseId)
      }, error: (e) => {

      }
    })
  }
  addCourseToUser(courseId: number) {
    const userId = this.getUserIdByToken()
    this.http.post(`http://localhost:3000/api/courses/${courseId}/enroll`, { userId }).subscribe({
      next: (response) => {
        this.getCourses();
      }, error: (e) => {

      }
    })
  }
  deleteCurrentCourseForUser(courseId: number) {
    const userId = this.getUserIdByToken()
    this.http.delete(`http://localhost:3000/api/courses/${courseId}/unenroll`, { body: { userId } }).subscribe({
      next: (response) => {
        this.getMyCourses();
      }, error: (e) => {

      }
    })
  }
  getRoleByToken(): string {
    const token = sessionStorage.getItem('token');
    if (!token) return '';
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error)
      return ''
    }
  }
  getUserIdByToken(): number {
    const token = sessionStorage.getItem('token');
    if (!token) return -1;
    try {
      const decodedToken: any = jwtDecode(token)
      return decodedToken.userId;
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error)
      return -1
    }
  }
}