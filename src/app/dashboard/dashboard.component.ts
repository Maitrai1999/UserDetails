import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  userEmail: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
  }

ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail'); // Retrieve email
    if (!this.userEmail) {
      alert('User email not found! Please log in again.');
      this.router.navigate(['/login']);
    }
  }
  deleteUser() {
    if (!this.userEmail) {
      alert('User email not found!');
      return;
    }

    this.authService.deleteUser(this.userEmail).subscribe({
      next: () => {
        alert('User deleted successfully!');

        localStorage.clear();  // Remove user session
        
        window.location.reload();
      },
      error: (err) => {
        alert('Failed to delete user: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login'; 
  }
}