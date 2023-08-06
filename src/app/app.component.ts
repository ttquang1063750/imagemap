import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImageMapComponent } from './image-map/image-map.component';
import { DataPoint, PointType } from './image-map/image-map.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ImageMapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  points: DataPoint[] = [
    {
      type: PointType.CIRCLE,
      x: 187.2554473876953,
      y: 112.97693634033203,
      data: null,
    },
    {
      type: PointType.LABEL,
      x: 297.2554473876953,
      y: 142.97693634033203,
      data: 'dummy',
    },
  ];
  onChanged(points: DataPoint[]) {
    console.log(points);
  }
}
