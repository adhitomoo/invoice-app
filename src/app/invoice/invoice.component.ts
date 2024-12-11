import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CurrencyPipe, DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {invoice} from "./invoice.constant";
import {invoiceStatusPipe} from "../shared/status.pipe";
import {MatDialog, MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {CreateInvoiceComponent} from "./create-invoice/create-invoice.component";
import {AppService} from "../app.service";
import {InvoiceService} from "./invoice.service";
import {FilterMenuComponent} from "../shared/components/filter-menu/filter-menu.component";

@Component({
  selector: 'invoice',
  standalone: true,
  imports: [NgOptimizedImage, invoiceStatusPipe, DatePipe, CurrencyPipe, MatDialogModule, FilterMenuComponent],
  providers: [invoiceStatusPipe, DatePipe, AppService, InvoiceService],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit{
  readonly dialog = inject(MatDialog);

  title = 'invoice-app';
  invoices: any[] = [];
  filteredInvoice: any[] = [];

  layout: 'phone' | 'tablet' | 'desktop' = 'desktop';

  constructor(
    private _router: Router,
    private _datePipe: DatePipe,
    private _appService: AppService,
    private _invoiceService: InvoiceService,
    ) {
    this._appService.checkResponsive().subscribe({
      next: (result: 'phone' | 'tablet' | 'desktop') => {
        this.layout = result;
      }
    })
  }

  ngOnInit() {
    this.fetchInvoice();
  }

  public onCreateInvoice() {
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

    const modelRef = this.dialog.open(CreateInvoiceComponent, dialogConfig);

    modelRef.componentInstance.type = 'new';
    modelRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result) {
          this.fetchInvoice();
        }
      }
    })

  }


  private fetchInvoice() {
    this.invoices = this._appService.getData();
    this.filteredInvoice = this.invoices.reverse();
  }

  public onFilter(status: any) {
    const statusKey = Object.keys(status);
    const statusValue = Object.values(status);
    this.filteredInvoice = [];

    statusKey.forEach(item => {
      if(status[item]) {
        this.filteredInvoice = this.filteredInvoice.concat(this.invoices.filter(elmnt => elmnt.status === item));
      }
    })

    if(statusValue.every(value => value === false)) {
      this.filteredInvoice = this.invoices;
    }
  }

  public toDetail(id: string) {
    this._router.navigate(['./' + id]);
  }

}
