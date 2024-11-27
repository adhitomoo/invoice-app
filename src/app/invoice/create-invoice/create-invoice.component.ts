import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormInputTextComponent} from "../../shared/form/form-input-text/form-input-text.component";
import {FormDatepickerComponent} from "../../shared/form/form-datepicker/form-datepicker.component";
import {MatIcon} from "@angular/material/icon";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormSelectComponent} from "../../shared/form/form-select/form-select.component";
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import {FormCurrencyComponent} from "../../shared/form/form-currency/form-currency.component";
import {InvoiceService} from "../invoice.service";
import {Subject, takeUntil} from "rxjs";
import {AppService} from "../../app.service";
import {ValidationService} from "../../shared/validation/validation.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    MatDialogModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    FormInputTextComponent,
    FormDatepickerComponent,
    MatIcon,
    ReactiveFormsModule,
    JsonPipe,
    FormSelectComponent,
    NgForOf,
    FormCurrencyComponent,
    NgIf
  ],
  providers: [
    ValidationService
  ],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss'
})
export class CreateInvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

  public title!: string;
  public buttonLabel!: string
  public formInvoice!: FormGroup;

  public _invoice: any;
  public _type: 'new' | 'edit' = 'new';

  public paymentTerm = [
    {
      name: 'Net 1 Days',
      num: 1
    },
    {
      name: 'Net 7 Days',
      num: 7
    },
    {
      name: 'Net 14 Days',
      num: 14
    },
    {
      name: 'Net 30 Days',
      num: 30
    }
  ];
  private currentData!: any;

  private unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  public process = {
    town: false,
    country: false,
    postcode: false
  }

  public layout: 'phone' | 'tablet' | 'desktop' = 'desktop';

  @Input()

  @Input()
    get type(): any {
      return this._type;
    }

    set type(type: 'new' | 'edit') {
      this._type = type;
      if(type === 'edit') {
        this.buttonLabel = 'Save Changes'
      }

      if(type === 'new') {
        this.buttonLabel = 'Save and Send'
      }
    }

  @Input()
    get invoice(): any {
      return this._invoice;
    }

    set invoice(invoice: any) {
      this._invoice = invoice;
      if(invoice) {
        this.formInvoice.patchValue({
          billFrom: {
            street_address: this._invoice.senderAddress.street,
            city: this.invoice.senderAddress.city,
            post_code: this.invoice.senderAddress.postCode,
            country: this.invoice.senderAddress.country
          },
          billTo: {
            clients_name: this._invoice.clientName,
            clients_email: this._invoice.clientEmail,
            street_address: this._invoice.clientAddress.street,
            city: this.invoice.clientAddress.city,
            post_code: this.invoice.clientAddress.postCode,
            country: this.invoice.clientAddress.country,
            invoice_date: this.invoice.paymentDue,
            payment_terms: this.invoice.paymentTerms,
            project_description: this.invoice.description
          },
        })
        this.invoice.items.forEach((val: any) => {
          const item: FormGroup = this.fb.group({
            item  : new FormControl(val.name, [Validators.required]),
            qty   : new FormControl(val.quantity, [Validators.required, this._validateService.ValidateNumber]),
            price : new FormControl(val.price, [Validators.required, this._validateService.ValidateNumber]),
            total : new FormControl(val.total, [Validators.required, this._validateService.ValidateNumber]),
          })

          this.formArray.push(item);
        })
      }
    }


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<CreateInvoiceComponent>,
    private _AppService: AppService,
    private _invoiceService: InvoiceService,
    private _validateService: ValidationService,
    private _snackbar: MatSnackBar
  ) {
    this.formInvoice = this.fb.group({
      billFrom: new FormGroup({
        street_address: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, this._validateService.ValidateCharacter]),
        post_code: new FormControl('', [Validators.required, this._validateService.ValidateCharacter]),
        country: new FormControl('', [Validators.required, this._validateService.ValidateCharacter])
      }),
      billTo: new FormGroup({
        clients_name: new FormControl('', [Validators.required, this._validateService.ValidateString]),
        clients_email: new FormControl('', [Validators.required, Validators.email]),
        street_address: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, this._validateService.ValidateCharacter]),
        post_code: new FormControl('', [Validators.required, this._validateService.ValidateCharacter]),
        country: new FormControl('', [Validators.required, this._validateService.ValidateCharacter]),
        invoice_date: new FormControl(moment(), [Validators.required]),
        payment_terms: new FormControl('', [Validators.required]),
        project_description: new FormControl('', [Validators.required]),
      }),
      items: new FormArray([])
    });

    this._AppService.checkResponsive().subscribe({
      next: (result: 'phone' | 'tablet' | 'desktop') => {
        this.layout = result;
      }
    })
  }

  ngOnInit() {
    if(this.type === 'new') {
      this.addArray();
    }
    this.formArray?.valueChanges.subscribe((val) => {
      // Modify the value of 'items' here
      const modifiedData = val.map((item: any) => {
        // Modify each item as needed
        return { ...item, total: item.price * parseInt(item.qty) }
      });

      this.formInvoice.get('items')?.patchValue(modifiedData, { emitEvent: false });
    })
    // this.fetchCountry();
    // this.fetchPostCode();
    this.currentData = this._AppService.getData();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  get formArray() {
    return this.formInvoice.get('items') as FormArray;
  }

  public addArray() {
    const item: FormGroup = this.fb.group({
      item  : new FormControl('', [Validators.required]),
      qty   : new FormControl(0, [Validators.required, this._validateService.ValidateNumber]),
      price : new FormControl(0, [Validators.required, this._validateService.ValidateNumber]),
      total : new FormControl(0, [Validators.required, this._validateService.ValidateNumber]),
    })

    this.formArray.push(item);
  }

  public deleteItem(index: any) {
    this.formArray.controls.splice(index, 1);
  }


  public onSave(): void {
    if(this.type === 'new') {
      this.create();
    }

    if(this.type === 'edit') {
      this.update();
    }
    this._snackbar.open('Success create invoice', 'OK');
    this.dialog.close(true);
  }

  public create() {
    const formValue = this.formInvoice.value;
    const date = moment(new Date, 'yyyy-mm-dd HH:mm:ss').valueOf();

    const invoice = {
      id: this.generateId(date, formValue.items.length),
      createdAt: moment(new Date(), 'YYYY-MM-DD'),
      paymentDue: this.addDays(new Date(), formValue?.billTo?.payment_terms),
      description: formValue?.billTo?.project_description,
      payment_terms: formValue?.billTo?.payment_terms,
      clientName: formValue?.billTo?.clients_name,
      clientEmail: formValue?.billTo?.clients_email,
      status: 'pending',
      senderAddress: {
        street: formValue?.billFrom?.street_address,
        city: formValue?.billFrom?.city,
        postCode: formValue?.billFrom?.post_code,
        country: formValue?.billFrom?.country,
      },
      clientAddress: {
        street: formValue?.billTo?.street_address,
        city: formValue?.billTo?.city,
        postCode: formValue?.billTo?.post_code,
        country: formValue?.billTo?.country,
      },
      items: formValue.items,
      total: this.totalItems(formValue.items)
    }

    const result = this.currentData.concat([invoice]);
    this._AppService.setData(result);
  }

  public update() {
    const formValue = this.formInvoice.value;
    const result = this.currentData.map((elmnt: any) => {
      if(elmnt.id === this.invoice.id) {
        elmnt = {
          id: this.invoice.id,
          createdAt: this.invoice.createdAt,
          paymentDue: this.addDays(new Date(this.invoice.createdAt), formValue?.billTo?.payment_terms),
          description: formValue?.billTo?.project_description,
          payment_terms: formValue?.billTo?.payment_terms,
          clientName: formValue?.billTo?.clients_name,
          clientEmail: formValue?.billTo?.clients_email,
          status: this.invoice.status,
          senderAddress: {
            street: formValue?.billFrom?.street_address,
            city: formValue?.billFrom?.city,
            postCode: formValue?.billFrom?.post_code,
            country: formValue?.billFrom?.country,
          },
          clientAddress: {
            street: formValue?.billTo?.street_address,
            city: formValue?.billTo?.city,
            postCode: formValue?.billTo?.post_code,
            country: formValue?.billTo?.country,
          },
          items: formValue.items,
          total: this.invoice.total
        }
        return elmnt
      }

      return elmnt
    })

    this._AppService.setData(result);
  }

  public addDays(date: any, days: number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  public generateId(date: any, id: string): string {
    const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let randomString = '';
    let counter = 0;
    while (counter < 2) {
      randomString += character.charAt(Math.floor(Math.random() * 2));
      counter += 1;
    }

    const suffix = date.toString().substr(date.length - 2, 2);
    const prefix = id?.length > 1 ? id : '0' + id

    return randomString + prefix + suffix;
  }

  public totalItems(items: any[]): number {
    let total = 0;
    items.forEach(item => {
      total += item.total;
    })

    return total
  }

  public onBack() {
    this.dialog.close();
  }

// {
//   "id": "RT3080",
//   "createdAt": "2021-08-18",
//   "paymentDue": "2021-08-19",
//   "description": "Re-branding",
//   "paymentTerms": 1,
//   "clientName": "Jensen Huang",
//   "clientEmail": "jensenh@mail.com",
//   "status": "paid",
//   "senderAddress": {
//     "street": "19 Union Terrace",
//     "city": "London",
//     "postCode": "E1 3EZ",
//     "country": "United Kingdom"
//   },
//   "clientAddress": {
//     "street": "106 Kendell Street",
//     "city": "Sharrington",
//     "postCode": "NR24 5WQ",
//     "country": "United Kingdom"
//   },
//   "items": [
//     {
//       "name": "Brand Guidelines",
//       "quantity": 1,
//       "price": 1800.90,
//       "total": 1800.90
//     }
//   ],
//   "total": 1800.90
// },

}
