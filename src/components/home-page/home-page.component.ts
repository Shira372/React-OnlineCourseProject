import { Component,OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CoursesComponent } from "../courses/courses.component";

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, RouterOutlet,CoursesComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
