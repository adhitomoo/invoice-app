import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-invoice',
  standalone: true,
  imports: [],
  templateUrl: './delete-invoice.component.html',
  styleUrl: './delete-invoice.component.scss'
})
export class DeleteInvoiceComponent {

  @Input() id!: string;

  constructor(
    private _dialogRef: MatDialogRef<DeleteInvoiceComponent>,
  ) {
  }

  onBack() {
    this._dialogRef.close();
  }

  onDelete() {
    this._dialogRef.close(true);
  }

}
