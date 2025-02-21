import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { email: '', password: '',phoneNumber: ''  };
  message = '';
  showOtpField = false;
  otp = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log("🔹 Login Response:", res);
        if (res.requiresOtp) {
          this.credentials.phoneNumber = res.phoneNumber; // ✅ Store phone number
          this.showOtpField = true;
          this.message = 'OTP sent to your phone number. Please enter it below.';
        } else {
          this.authService.storeUserData(res.token, this.credentials.email);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error("🔴 Login Error:", err);
        this.message = 'Login failed. ' + (err.error?.message || 'Unknown error');
      }
    });
  }
  
  verifyOtp() {
    if (!this.credentials.email) {
      this.message = 'Email is missing. Please log in again.';
      return;
    }
  
    this.authService.verifyOtp({ email: this.credentials.email, otp: this.otp }).subscribe({
      next: (res) => {
        console.log("🔹 OTP Verification Response:", res);
        this.authService.storeUserData(res.token, this.credentials.email);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("🔴 OTP Verification Error:", err);
        this.message = 'OTP verification failed. ' + (err.error?.message || err.message || 'Unknown error.');
      }
    });
  }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
