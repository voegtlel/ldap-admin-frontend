import {Pipe, PipeTransform} from '@angular/core';
import {ViewListValue} from '../_models';

@Pipe({
    name: 'filterModel',
    pure: false
})
export class FilterModelPipe implements PipeTransform {
    transform(items: ViewListValue, term: string): any {
        if (!term) {
            return items;
        }
        return items.filter(item =>
            Object.values(item).some((val) => val.toString().indexOf(term) !== -1)
        );
    }
}
