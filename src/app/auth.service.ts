import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';  
  currentUser: any;

  constructor(private http: HttpClient) {}

  // Register user
  register(userData: any): Observable<any> {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("companyName", userData.companyName);
    formData.append("age", userData.age.toString());  // Convert number to string
    formData.append("dob", userData.dob);
    formData.append("phoneNumber", userData.phoneNumber);
  
    // If there's a profile image, append it
    if (userData.profileImage) {
      formData.append("image", userData.profileImage);
    }
  
    return this.http.post(`${this.apiUrl}/register`, formData);
  }
  
  
  getUserDetails(name: string, email: string) {
    return this.http.get(`${this.apiUrl}/userDetails`, { params: { name, email } });
  }
  // Login user
  login(credentials: { email: string; password: string }): Observable<any> {
    const body = new URLSearchParams();
    body.set('email', credentials.email);
    body.set('password', credentials.password);
  
    return this.http.post(`${this.apiUrl}/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // ✅ Set correct content type
    });
  }
  

  // OTP Verification
  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }
  

  // Store token
  storeUserData(token: string, email: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email); // Store email
  }
  

  // Get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getUser(): any {
    return this.currentUser || JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  deleteUser(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { params: { email } });
  }
}
