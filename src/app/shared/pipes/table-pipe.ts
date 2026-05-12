import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'table',
})
export class TablePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
