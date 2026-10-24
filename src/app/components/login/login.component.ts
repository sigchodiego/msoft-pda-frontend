import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loading = false;
  errorMessage: string | null = null;
  infoMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onExecuteLogin(credentials: { email: string; password: string }): void {
    this.loading = true;
    this.errorMessage = null;
    this.infoMessage = null;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/empleados']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || err.message || 'Error de infraestructura al validar credenciales.';
      },
    });
  }

  onExecuteRegister(credentials: { email: string; password: string }): void {
    this.loading = true;
    this.errorMessage = null;
    this.infoMessage = null;

    this.authService.register(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.infoMessage = 'Usuario creado. Ahora inicia sesión.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || err.message || 'No se pudo registrar el usuario.';
      },
    });
  }
}
