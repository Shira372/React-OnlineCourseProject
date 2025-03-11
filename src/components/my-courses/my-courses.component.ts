import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list'; 


@Component({
  selector: 'app-my-courses',
  imports: [AsyncPipe, MatExpansionModule, MatListModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})

export class MyCoursesComponent implements OnInit {
  courseId: number = -1;
  myCourse$!: Observable<Course[]>;
  constructor(private courseService: CoursesService, private route: ActivatedRoute) {
    this.myCourse$ = this.courseService.myCourses$;
    this.courseService.getMyCourses();
  }
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.courseId = id ? Number(id) : -1;
      })
    }

  deleteCurrentCourse(courseId: number) {
    this.courseService.deleteCurrentCourseForUser(courseId)
  }
}



