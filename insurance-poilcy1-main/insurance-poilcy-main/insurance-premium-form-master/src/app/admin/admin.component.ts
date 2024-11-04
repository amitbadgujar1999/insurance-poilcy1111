import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Your login logic here
    if (this.username === 'admin' && this.password === 'admin') {
      // Successful login
      console.log('Login successful');
      this.router.navigate(['/data-table']); // Navigate to data table upon successful login
    } else {
      // Invalid credentials
      alert('Invalid credentials');
    }
  }
}
