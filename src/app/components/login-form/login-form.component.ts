import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output() submitLogin = new EventEmitter<{ email: string; password: string }>();
  @Output() submitRegister = new EventEmitter<{ email: string; password: string }>();

  formModel = { email: '', password: '' };

  onSubmit(): void {
    if (!this.formModel.email || !this.formModel.password) return;
    this.submitLogin.emit({ ...this.formModel });
  }

  onRegister(): void {
    if (!this.formModel.email || !this.formModel.password) return;
    this.submitRegister.emit({ ...this.formModel });
  }
}
