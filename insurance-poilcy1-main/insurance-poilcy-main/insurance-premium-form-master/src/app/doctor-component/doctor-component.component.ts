import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-component',
  templateUrl: './doctor-component.component.html',
  styleUrls: ['./doctor-component.component.css']
})
export class DoctorComponentComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Your login logic here
    if (this.username === 'doctor' && this.password === 'doctor') {
      // Successful login
      console.log('Login successful');
      this.router.navigate(['/dataclaim']); // Navigate to data table upon successful login
    } else {
      // Invalid credentials
      alert('Invalid credentials');
    }
  }
}

