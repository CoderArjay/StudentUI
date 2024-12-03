import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, searchText: any): any {
    if(!value) return null;
    if(!searchText) return value;

    searchText = searchText.toLowerCase();

    return value.filter(function(item: any){
      return JSON.stringify(item)
      .toLowerCase()
      .includes(searchText);
    })
  }
}