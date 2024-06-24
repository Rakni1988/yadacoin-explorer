// replace-comma.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceComma'
})
export class ReplaceCommaPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value === 'string') {
      return value.replace(/,/g, ' ');
    }
    return value.toString().replace(/,/g, ' ');
  }
}
