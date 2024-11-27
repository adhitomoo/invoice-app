import { Routes } from '@angular/router';
import {InvoiceComponent} from "./invoice.component";
import {ViewInvoiceComponent} from "./view-invoice/view-invoice.component";

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: InvoiceComponent
      },
      {
        path: ':id',
        component: ViewInvoiceComponent,
      }
    ]
  }
] as Routes;

