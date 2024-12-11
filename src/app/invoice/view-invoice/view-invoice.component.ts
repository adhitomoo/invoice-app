import {Component, inject, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, JsonPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {invoiceStatusPipe} from "../../shared/status.pipe";
import {AppService} from "../../app.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CreateInvoiceComponent} from "../create-invoice/create-invoice.component";
import {DeleteInvoiceComponent} from "../delete-invoice/delete-invoice.component";

@Component({
  selector: 'view-invoice',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe, CurrencyPipe, invoiceStatusPipe, NgIf, JsonPipe],
  providers: [DatePipe],
  templateUrl: 'view-invoice.component.html',
})

export class ViewInvoiceComponent implements OnInit {
  private router = inject(Router)

  layout: 'phone' | 'tablet' | 'desktop' = 'desktop'

  invoices!: any[];
  invoiceDetail: any | null = null;
  process = {
    load: false,
    delete: false
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private _appService: AppService,
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog
  ) {
    this._appService.checkResponsive().subscribe({
      next: (result: 'phone' | 'tablet' | 'desktop') => {
        this.layout = result;
      }
    })
  }
  ngOnInit() {
    this.fetchDetailInvoice();
  }

  fetchDetailInvoice() {
    this.invoices = this._appService.getData();
    this.invoiceDetail = this.invoices.find((invoice) => invoice.id == this.activeRoute.snapshot.paramMap.get('id'));
    console.log(this.invoiceDetail);
  }

  onPaid() {
    this.process.load = true;
    setTimeout(() => {
      this.process.load = false;
      this.invoiceDetail.status = 'paid';

      const invoices = this._appService.getData();
      const reSubmit = invoices.map((invoice: any) => {
        if(invoice.id == this.invoiceDetail.id){
          invoice.status = this.invoiceDetail.status;
        }

        return invoice;
      });

      this._appService.setData(reSubmit);
      this._snackbar.open('Success edit invoice', 'OK')
    }, 2000)
  }

  onEdit() {
    const configDesktop: MatDialogConfig = {
      panelClass: 'desktop-dialog',
    }

    const configTablet: MatDialogConfig = {
      panelClass: 'tablet-dialog',
    }

    const configPhone: MatDialogConfig = {
      panelClass: 'phone-dialog',
    }

    const dialogConfig = this.layout === 'desktop' ? configDesktop :
        this.layout === 'tablet' ? configTablet :
        configPhone;

    const modelRef = this._dialog.open(CreateInvoiceComponent, dialogConfig);

    modelRef.componentInstance.type = 'edit';
    modelRef.componentInstance.invoice = this.invoiceDetail;
    modelRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.toBack();
          // this.fetchInvoice();
        }
      }
    })
  }

  onDelete() {
    const modalref: MatDialogRef<DeleteInvoiceComponent> = this._dialog.open(DeleteInvoiceComponent, {
      minWidth: 640,
      minHeight: 120
    });

    modalref.componentInstance.id = this.invoiceDetail.id;
    modalref.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.process.delete = true;
          const invoices = this._appService.getData();
          const currentIndex = invoices.findIndex((invoice: any) => invoice.id == this.invoiceDetail.id);
          if(currentIndex > -1) {
            invoices.splice(currentIndex, 1);
          }
          this._appService.setData(invoices);
          setTimeout(() => {
            this.process.delete = false;
            this._snackbar.open('Success delete invoice', 'OK', { panelClass: 'bg-green-500', duration: 2000 });

            this.toBack();
          }, 2000)
        }
      }
    })
  }

  toBack() {
    this.router.navigate(['/']);
  }
}
