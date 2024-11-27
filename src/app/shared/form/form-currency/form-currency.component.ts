import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'form-currency',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe
  ],
  providers: [
    CurrencyPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCurrencyComponent),
      multi: true
    },
  ],
  templateUrl: './form-currency.component.html',
  styleUrl: './form-currency.component.scss'
})
export class FormCurrencyComponent implements OnInit, ControlValueAccessor {
  @Input() title!: string;
  @Input() withCurrency: boolean = false;
  @Input() disable: boolean = false;
  @Output() onChangeValue = new EventEmitter();

  private _value!: number;

  displayValue: string | null = '';

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private _currency: CurrencyPipe,
  ) {
  }

  ngOnInit() {}

  change(event: any) {
    this.displayValue = this.formatCurrency(event);
    this.value = parseFloat(this.displayValue.replace(/[^0-9.-]+/g,''))
    // this.value = event;
  }

  writeValue(value: number): void {
    this._value = value
    this.displayValue = this.formatCurrency(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  formatCurrency(numb: any) {
    const numericValue = isNaN(numb) ? parseFloat(numb.replace(/[^0-9.-]+/g,'')) : numb;
    return new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'GBP',
      notation: 'standard'
    }).format(numericValue);
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const numericValue = parseFloat(input.replace(/[^0-9.-]+/g, ''));
    // if (!isNaN(numericValue)) {
    //   this.value = this.formatCurrency(numericValue.toString()) || '';
    // }
  }
}
