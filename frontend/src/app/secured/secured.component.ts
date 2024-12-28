import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './secured.component.html'
})
export class SecuredComponent {
  
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
