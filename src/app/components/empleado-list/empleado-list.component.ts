import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
})
export class EmpleadoListComponent {
  @Input() empleados: Empleado[] = [];

  @Output() edit = new EventEmitter<Empleado>();
  @Output() remove = new EventEmitter<string>();

  onEdit(empleado: Empleado): void {
    this.edit.emit({ ...empleado });
  }

  onRemove(id?: string): void {
    if (!id) return;
    this.remove.emit(id);
  }
}
