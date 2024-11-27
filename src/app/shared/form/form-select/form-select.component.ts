import {Component, ElementRef, forwardRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {map, startWith} from "rxjs";

@Component({
  selector: 'form-select',
  standalone: true,
  imports: [
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    },
  ],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss'
})
export class FormSelectComponent implements OnInit, ControlValueAccessor {
  @ViewChild('menuSelect') menu!: ElementRef;
  @ViewChild('selected') select!: ElementRef;

  private _items!: any[];

  @Input() title!: string;
  @Input()
  get items(): any[] {
    return this._items;
  }

  @Input() loading: boolean = false;
  @Input() disable: boolean = false;

  set items(items: any[]) {
    this._items = items;
    this.filteredItems = this._items;
  }

  @Input() itemName!: string;
  @Input() itemValue!: string;

  @Input() withAutoComplete!: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };
  value: any;
  showOption!: boolean;
  filteredItems: any[] = [];

  constructor( private renderer: Renderer2 ) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if(e.target !== this.select?.nativeElement && e.target!==this.menu?.nativeElement){
        this.showOption = false;
      }
    });
  }

  ngOnInit() {

  }


  onShowOption() {
    this.showOption = !this.showOption;
    console.log('testing')
  }

  onSelect(item: any) {
    this.value = item[this.itemName];
    this.onChange(item[this.itemValue]);
  }

  _filter(str: string) {
    const filterValue = str.toLowerCase();
    return this.items.filter((item: any) => item[this.itemName]?.toLowerCase().includes(filterValue));
  }


  change(event: any) {
    this.value = event;
    this.filteredItems = this._filter(event as string)

    console.log(this.filteredItems);
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
