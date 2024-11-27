import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {AppService} from "../app.service";

@Component({
  selector: 'layout-default',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, NgIf],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  public darkMode!: boolean;
  public darkIcon : string = '/assets/icon-moon.svg';
  public buttonDarkMode!: string;

  public layout: 'phone' | 'tablet' | 'desktop' = 'desktop';

  constructor(private _appService: AppService) {
    this._appService.checkResponsive().subscribe({
      next: (result: 'phone' | 'tablet' | 'desktop') => {
        this.layout = result;
        if(this.layout !== 'desktop') {
          this.buttonDarkMode = 'toggleDarkModeResponsive';
        } else {
          this.buttonDarkMode = 'toggleDarkMode';
        }
      }
    })
  }

  public switchDark() {
    this.darkMode = !this.darkMode;
    if(this.darkMode) {
      document.getElementById(this.buttonDarkMode)?.classList.add('switch-parabola-sun');
      document.getElementById(this.buttonDarkMode)?.classList.remove('switch-parabola-dark');
      setTimeout(() => {
        this.darkIcon = '/assets/icon-sun.svg'
      }, 200)
    } else {
      document.getElementById(this.buttonDarkMode)?.classList.add('switch-parabola-dark');
      document.getElementById(this.buttonDarkMode)?.classList.remove('switch-parabola-sun');
      setTimeout(() => {
        this.darkIcon = '/assets/icon-moon.svg'
      }, 200)
    }

    document.documentElement.classList.toggle('dark');
  }

}
