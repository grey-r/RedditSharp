import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortPipe"
})
export class SortPipePipe implements PipeTransform {
  transform(items: any[], sortMember: string): any {
    if (!items || !sortMember) {
      return items;
    }
    items.sort((a, b) => a[sortMember].localeCompare(b[sortMember]));
    return items;
  }
}
