export enum PointType {
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE',
  LABEL = 'LABEL',
}

export class DataPoint {
  constructor(
    public type = PointType.CIRCLE,
    public x = 100,
    public y = 100,
    public data: any = null
  ) {}
}
