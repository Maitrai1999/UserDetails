import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
user = {
  name: '',
  email: '',
  password: '',
  companyName: '',
  age: 0,
  dob: '',
  profileImage: '',
  phoneNumber: ''
};
message = '';
  router: any;

constructor(private authService: AuthService) {}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
      this.user.profileImage = reader.result; // Convert image to base64
      }
    };
  }
}

register() {
  this.authService.register(this.user).subscribe({
    next: () => {
      this.message = 'Registration successful!';
    },
    error: (err) => {
      this.message = 'Registration failed. ' + (err.error?.message || 'Unknown error');
    }
  });
}
goToLogin() {
  this.router.navigate(['/login']);
}
}
