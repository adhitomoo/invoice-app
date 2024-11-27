import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss'
})
export class FilterMenuComponent {

  @Input() title!: string;
  @Output() onChangeValue = new EventEmitter();


  filterStatus = {
    draft: false,
    pending: false,
    paid: false
  };

  menuActive: boolean = false;

  public openMenu() {
    this.menuActive = !this.menuActive;
  }

  public onFilter(): void {
    this.onChangeValue.emit(this.filterStatus);
  }

}
