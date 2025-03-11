import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,RouterModule,MatToolbarModule,MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'CourseOnlineClient';
  token:any='';
  userName!:string;
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.token=this.authService.getToken();
    this.userName=this.authService.getUserNameFromToken();
  }
}




