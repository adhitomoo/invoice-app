import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MomentDateAdapter, provideMomentDateAdapter} from "@angular/material-moment-adapter";

export const MY_FORMATS = {
  parse: {
    dateInput: ['DD MMM YYYY']
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'form-datepicker',
  standalone: true,
  imports: [
    MatDatepickerModule,
    FormsModule
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerComponent),
      multi: true
    },
    DatePipe
  ],
  templateUrl: './form-datepicker.component.html',
  styleUrl: './form-datepicker.component.scss'
})
export class FormDatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() title!: string;
  @Output() onChangeValue = new EventEmitter();

  onChange: any = () => { };
  onTouched: any = () => { };
  value: any;

  constructor(
  ) {
  }

  ngOnInit() {}

  change(event: any) {
    this.value = event
    this.onChange(this.value);
    this.onChangeValue.emit(this.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
