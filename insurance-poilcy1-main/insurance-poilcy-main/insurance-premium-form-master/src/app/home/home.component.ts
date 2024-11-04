import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private router: Router) {}
   
    // Method to check if the current route is home
    isHomeRoute(): boolean {
      return this.router.url === '/home'; // Change '/home' if your route structure is different
    }
  }
