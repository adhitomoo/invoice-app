import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Injectable({ providedIn: 'root' })

export class AppService {

  constructor(
    private responsive: BreakpointObserver
  ) {

  }

  public checkResponsive(): Observable<'phone' | 'tablet' | 'desktop'> {
    return new Observable(obj => {
      this.responsive.observe([
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web
      ]).subscribe((result: any) => {
        const breakpoints = result.breakpoints;

        if(breakpoints[Breakpoints.HandsetLandscape] || breakpoints[Breakpoints.HandsetPortrait]) {
          obj.next('phone')
        }

        if(breakpoints[Breakpoints.TabletLandscape] || breakpoints[Breakpoints.TabletPortrait]) {
          obj.next('tablet')
        }

        if(breakpoints[Breakpoints.WebLandscape] || breakpoints[Breakpoints.WebPortrait]) {
          obj.next('desktop')
        }
      })
    })
  }

  public getData() {
    return JSON.parse(localStorage?.getItem('data') || '[]');
  }

  public setData(data: any) {
    localStorage.setItem('data', JSON.stringify(data));
  }
}
