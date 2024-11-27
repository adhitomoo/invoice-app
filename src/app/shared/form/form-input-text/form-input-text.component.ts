import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'form-input-text',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe
  ],
  providers: [
    CurrencyPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputTextComponent),
      multi: true
    },
  ],
  templateUrl: './form-input-text.component.html',
  styleUrl: './form-input-text.component.scss'
})
export class FormInputTextComponent implements OnInit, ControlValueAccessor {
  @Input() title!: string;
  @Input() withCurrency: boolean = false;

  @Input() disable: boolean = false;
  @Output() onChangeValue = new EventEmitter();

  private _value: string | null = '';

  get value(): string | null {
    return this._value;
  }

  set value(val: string | null) {
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
    this.value = event;
    // this.onChange(this.value);
    // this.onChangeValue.emit(this.value);
  }

  writeValue(value: string): void {
    this._value = value
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  formatCurrency(str: string) {
    const numericValue = parseFloat(str);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
      }).format(numericValue);
    }

    return null
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const numericValue = parseFloat(input.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      this.value = this.formatCurrency(numericValue.toString()) || '';
    }
  }
}
