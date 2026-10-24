import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
})
export class EmpleadoFormComponent {
  @Input() empleado: Empleado = {
    nombre: '',
    cargo: '',
    departamento: '',
    sueldo: 0,
  };

  @Output() save = new EventEmitter<Empleado>();
  @Output() clear = new EventEmitter<void>();

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    this.save.emit({ ...this.empleado });
  }

  onClear(form: NgForm): void {
    form.resetForm({
      nombre: '',
      cargo: '',
      departamento: '',
      sueldo: 0,
    });
    this.clear.emit();
  }
}
