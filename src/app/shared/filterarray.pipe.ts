import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  //Filter array for ngFor
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
        return items;
    }
    return items.filter(item => item.name.toLowerCase().startsWith(filter.toLowerCase()));
}

}