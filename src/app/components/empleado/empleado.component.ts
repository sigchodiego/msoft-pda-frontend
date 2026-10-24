import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { AuthService } from '../../services/auth.service';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
})
export class EmpleadoComponent implements OnInit {
  empleados$: Observable<Empleado[]>;

  constructor(
    public empleadoService: EmpleadoService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.empleados$ = this.empleadoService.empleados$;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.empleadoService.loadEmpleados();
    }
  }

  onSave(empleado: Empleado): void {
    if (empleado._id) {
      this.empleadoService.updateEmpleado(empleado._id, empleado);
      return;
    }
    this.empleadoService.createEmpleado(empleado);
  }

  onEdit(empleado: Empleado): void {
    this.empleadoService.selectedEmpleado = { ...empleado };
  }

  onRemove(id: string): void {
    this.empleadoService.deleteEmpleado(id);
  }

  onClear(): void {
    this.empleadoService.resetSelected();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
