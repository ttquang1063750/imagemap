import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DraggingDirective } from '../dragging.directive';
import { DataPoint, PointType } from './image-map.model';

@Component({
  selector: 'app-image-map',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatButtonModule,
    DraggingDirective,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.scss'],
})
export class ImageMapComponent implements OnInit {
  @ViewChild('svgRef') svgRef: ElementRef<SVGSVGElement>;
  @ViewChild('formDialogRef') formDialogRef: TemplateRef<DataPoint>;
  @ViewChild('chooseShapeTrigger') chooseShapeTrigger: CdkContextMenuTrigger;
  @ViewChild('editShapeTrigger') editShapeTrigger: CdkContextMenuTrigger;
  @Input({ required: true }) src!: string;
  @Input() points: DataPoint[] = [];
  @Output() changed = new EventEmitter<DataPoint[]>();

  protected imageWidth = 0;
  protected imageHeight = 0;
  protected imageSrc: string;
  private matDialogRef: MatDialogRef<DataPoint, DataPoint>;

  constructor(private matDialog: MatDialog) {}

  ngOnInit() {
    const image = new Image();
    image.onload = (): void => {
      this.imageWidth = image.width;
      this.imageHeight = image.height;
      this.imageSrc = image.src;
    };
    image.src = this.src;
  }

  onDragEnd(event: { x: number; y: number }, pointIndex: number) {
    const point = this.points.at(pointIndex)!;
    point.x = event.x;
    point.y = event.y;
    this.changed.emit(this.points);
  }

  createCircle(event: MouseEvent) {
    const position = this.getPosition(event);
    const point = new DataPoint(PointType.CIRCLE, position.x, position.y);
    this.addPoint(point);
  }

  createRectangle(event: MouseEvent) {
    const position = this.getPosition(event);
    const point = new DataPoint(PointType.RECTANGLE, position.x, position.y);
    this.addPoint(point);
  }

  createLabel(event: MouseEvent) {
    const position = this.getPosition(event);
    const point = new DataPoint(PointType.LABEL, position.x, position.y);
    point.data = 'dummy';
    this.addPoint(point);
  }

  getPosition(event: MouseEvent) {
    const point = this.svgRef.nativeElement.createSVGPoint();
    point.x = event!.clientX;
    point.y = event!.clientY;

    const ctm = this.svgRef.nativeElement.getScreenCTM()!;
    const inverse = ctm.inverse();
    return point.matrixTransform(inverse);
  }

  addPoint(point: DataPoint) {
    this.points.push(point);
    this.chooseShapeTrigger.close();
    this.changed.emit(this.points);
  }

  editProperties(index: number) {
    this.editShapeTrigger.close();

    const point = this.points.at(index)!;
    this.matDialogRef = this.matDialog.open(this.formDialogRef, {
      width: '450px',
      data: { ...point },
    });
    this.matDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.points[index] = data;
        this.changed.emit(this.points);
      }
    });
  }

  save(point: DataPoint) {
    this.matDialogRef.close(point);
  }

  cancel() {
    this.matDialogRef.close();
  }

  duplicatePoint(index: number) {
    const point = window.structuredClone(this.points.at(index)!);
    point.x += 20;
    point.y += 20;
    this.points.push(point);
    this.editShapeTrigger.close();
    this.changed.emit(this.points);
  }

  deletePoint(index: number) {
    this.points.splice(index, 1);
    this.changed.emit(this.points);
  }

  get viewBox(): string {
    return `0 0 ${this.imageWidth} ${this.imageHeight}`;
  }
}
