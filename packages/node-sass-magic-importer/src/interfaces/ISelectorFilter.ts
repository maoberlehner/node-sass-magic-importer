export interface ISelectorFilter {
  selector: string|RegExp;
  replacement: any;
}

export interface ISelectorFilterRaw extends ISelectorFilter {
  selector: string;
}
