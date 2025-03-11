import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { Course, Lesson } from '../../models/course';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { Observable, take } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-courses',
  imports: [AsyncPipe, ReactiveFormsModule, MatListModule, MatButtonModule, NgTemplateOutlet, MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule, MatExpansionModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courseForm!: FormGroup;
  lessonForm!: FormGroup;
  lessonUpdate!: Lesson;
  lessonAdd!: Lesson;
  idCurrentLesson: number = -1;
  isUpdate: boolean = false;
  idCurrentCourse: number = -1;
  courseUpdate!: Course;
  isUpdateLesson: Boolean = false;
  isAddLesson: Boolean = false;
  courseIsLessonUpdate: number = -1;
  isAddCourse: boolean = false;
  allCourses$: Observable<Course[]>;

  setIsAddCourse() {
    this.isAddCourse = !this.isAddCourse
  }

  setIsUpdate(course: Course) {
    this.isUpdate = !this.isUpdate;
    this.idCurrentCourse = course.id;
    this.courseForm.setValue({
      title: course.title,
      description: course.description,
    });
  }
  setIsUpdateLesson(lesson: Lesson) {
    this.isUpdateLesson = !this.isUpdateLesson;
    this.idCurrentLesson = lesson.id;
    this.courseIsLessonUpdate = lesson.courseId;
    this.lessonForm.setValue({
      title: lesson.title,
      content: lesson.content,
    })
  }

  setIsAddLesson(courseId: number) {
    this.isAddLesson = !this.isAddLesson;
    this.idCurrentCourse = courseId;
  }

  constructor(private coursesService: CoursesService, private fb: FormBuilder) {
    this.allCourses$ = this.coursesService.allCourses$;
    this.coursesService.getCourses();
  }

  ngOnInit(): void {
    this.coursesService.getUserIdByToken();
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(15)]],
    })
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      content: ['', [Validators.required, Validators.minLength(15)]],
    })
  }

  get course(): { [key: string]: AbstractControl } {
    return this.courseForm.controls;
  }

  get lesson(): { [key: string]: AbstractControl } {
    return this.lessonForm.controls;
  }

  deleteCourse(courseId: number) {
    this.coursesService.deleteCourse(courseId);
  }

  onSubmitLesonUpdate() {
    this.isUpdateLesson = !this.isUpdateLesson;
    this.lessonUpdate = this.lessonForm.value;
    this.lessonUpdate.id = this.idCurrentLesson;
    this.lessonUpdate.courseId = this.courseIsLessonUpdate;
    this.coursesService.updateLesson(this.lessonUpdate);
  }

  onSubmitCourseUpdate() {
    this.updateCourse();
    this.isUpdate = !this.isUpdate;
  }

  updateCourse() {
    this.courseUpdate = this.courseForm.value;
    this.courseUpdate.teacherId = this.coursesService.getUserIdByToken();
    this.courseUpdate.id = this.idCurrentCourse;
    this.coursesService.updateCourse(this.courseUpdate);
  }

  onSubmitAddLesson() {
    this.isAddLesson = !this.isAddLesson;
    this.lessonAdd = this.lessonForm.value;
    this.lessonAdd.courseId = this.idCurrentCourse;
    this.coursesService.addLesson(this.lessonAdd);
  }

  deleteLesson(courseId: number, lessonId: number) {
    this.coursesService.deleteLesson(courseId, lessonId);
  }

  onSubmitAddCourse() {
    this.courseUpdate = this.courseForm.value;
    this.courseUpdate.teacherId = this.coursesService.getUserIdByToken();
    this.coursesService.addNewCourse(this.courseUpdate);
    this.isAddCourse = !this.isAddCourse;
  }
}