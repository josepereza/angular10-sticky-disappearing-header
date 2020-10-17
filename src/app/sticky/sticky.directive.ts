import { Directive, ElementRef, Inject, Renderer2 } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  takeUntil
} from "rxjs/operators";
import { DestroyService } from "./destroy.service";
import { WINDOW } from "@ng-web-apis/common";

const THRESHOLD = 200;

@Directive({
  selector: "[sticky]",
  providers: [DestroyService]
})
export class StickyDirective {
  constructor(
    @Inject(DestroyService) destroy$: Observable<void>,
    @Inject(WINDOW) windowRef: Window,
    public renderer: Renderer2,private elRef: ElementRef,
    { nativeElement }: ElementRef<HTMLElement>
  ) {
    fromEvent(windowRef, "scroll")
      .pipe(
        map(() => windowRef.scrollY),
        pairwise(),
        map(([prev, next]) => next < THRESHOLD || prev > next),
        distinctUntilChanged(),
        startWith(true),
        takeUntil(destroy$)
      )
      .subscribe(stuck => {
        if (!stuck){
           this.renderer.addClass(this.elRef.nativeElement, 'cambio');
        }else {
          this.renderer.removeClass(this.elRef.nativeElement,'cambio')
        }
         
      });
  }
}
