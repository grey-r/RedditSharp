import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  SortModes = SortModes;
  FilterModes = FilterModes;
  
  private _sortMode:SortModes = SortModes.best;
  private _filterMode:FilterModes = FilterModes.all;

  public get sortMode():SortModes {
    return this._sortMode;
  }

  public get filterMode():FilterModes {
    return this._filterMode;
  }

  public set sortMode(mode:SortModes) {
    this._sortMode=mode;
    localStorage.setItem("sortMode",mode);
  }

  public set filterMode(mode:FilterModes) {
    this._filterMode=mode;
    localStorage.setItem("filterMode",mode);
  }

  constructor() {
    let sm = localStorage.getItem("sortMode");
    let fm = localStorage.getItem("filterMode");
    if (sm && sm in SortModes) {
      this._sortMode = <SortModes>sm;
    }
    if (fm && fm in FilterModes) {
      this._filterMode = <FilterModes>sm;
    }
  }

  setSortMode(sortMode: SortModes, filterMode: FilterModes | null = null):void {
    this.sortMode = sortMode;
    if (filterMode) {
      this.filterMode = filterMode;
    }
  }
}

export enum SortModes {
  best="best",
  hot="hot",
  new="new",
  top="top",
  rising="rising"
}

export enum FilterModes {
  hour="hour",
  day="day",
  week="week",
  month="month",
  year="year",
  all="all"
}