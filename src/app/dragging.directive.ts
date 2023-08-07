import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { DataPoint, PointType } from './image-map/image-map.model';

@Directive({
  selector: '[appDragging]',
  standalone: true,
})
export class DraggingDirective implements AfterViewInit {
  @Input() point: DataPoint;
  @Output() changed = new EventEmitter<{ x: number; y: number }>();

  private dragging = false;
  private svg: SVGSVGElement;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.svg = this.elementRef.nativeElement.closest('svg');
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.dragging = event.buttons === 1;

    this.svg.addEventListener('mousemove', this.onMousemove.bind(this), false);
    this.svg.addEventListener('mouseup', this.onMouseup.bind(this), false);
    this.child.classList.add('selected');
  }

  onMousemove(event: MouseEvent) {
    if (this.dragging) {
      switch (this.point.type) {
        case PointType.CIRCLE:
          this.moveCircle(event);
          break;
        default:
          this.moveShape(event);
          break;
      }
    }
  }

  onMouseup(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.svg.removeEventListener('mousemove', this.onMousemove.bind(this), false);
      this.svg.removeEventListener('mouseup', this.onMouseup.bind(this), false);
      this.child.classList.remove('selected');
      this.changed.emit(this.getPosition(event));
    }
  }

  private moveCircle(event: MouseEvent) {
    const position = this.getPosition(event);
    const child = this.child as SVGCircleElement;

    child.setAttribute('cx', `${position.x}`);
    child.setAttribute('cy', `${position.y}`);
  }

  private moveShape(event: MouseEvent) {
    const position = this.getPosition(event);
    const child = this.child as SVGRectElement;

    child.setAttribute('x', `${position.x}`);
    child.setAttribute('y', `${position.y}`);
  }

  private getPosition(event: MouseEvent): DOMPoint {
    const point = this.svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const ctm = this.child.getScreenCTM()!;
    const inverse = ctm.inverse();
    return point.matrixTransform(inverse);
  }

  private get child(): SVGCircleElement | SVGRectElement | SVGTextElement {
    return this.elementRef.nativeElement.children[0];
  }
}
