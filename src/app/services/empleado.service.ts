import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly URL_API = `${environment.apiUrl}/api/empleados`;

  private readonly empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  /** Flujo de solo lectura para la vista */
  readonly empleados$: Observable<Empleado[]> = this.empleadosSubject.asObservable();

  selectedEmpleado: Empleado = {
    nombre: '',
    cargo: '',
    departamento: '',
    sueldo: 0,
  };

  constructor(private http: HttpClient) {}

  loadEmpleados(): void {
    this.http.get<ApiResponse<Empleado[]>>(this.URL_API).subscribe({
      next: (res) => this.empleadosSubject.next([...(res.data ?? [])]),
      error: (err) => console.error(err),
    });
  }

  createEmpleado(empleado: Empleado): void {
    this.http.post<ApiResponse<Empleado>>(this.URL_API, empleado).subscribe({
      next: (res) => {
        const current = this.empleadosSubject.getValue();
        this.empleadosSubject.next([...current, res.data]);
        this.resetSelected();
      },
      error: (err) => console.error(err),
    });
  }

  updateEmpleado(id: string, empleado: Empleado): void {
    this.http.put<ApiResponse<Empleado>>(`${this.URL_API}/${id}`, empleado).subscribe({
      next: (res) => {
        const current = this.empleadosSubject.getValue();
        this.empleadosSubject.next(
          current.map((e) => (e._id === id ? { ...res.data } : e))
        );
        this.resetSelected();
      },
      error: (err) => console.error(err),
    });
  }

  deleteEmpleado(id: string): void {
    this.http.delete<ApiResponse<null>>(`${this.URL_API}/${id}`).subscribe({
      next: () => {
        const current = this.empleadosSubject.getValue();
        this.empleadosSubject.next(current.filter((e) => e._id !== id));
        this.resetSelected();
      },
      error: (err) => console.error(err),
    });
  }

  clearEmpleados(): void {
    this.empleadosSubject.next([]);
    this.resetSelected();
  }

  resetSelected(): void {
    this.selectedEmpleado = {
      nombre: '',
      cargo: '',
      departamento: '',
      sueldo: 0,
    };
  }
}
