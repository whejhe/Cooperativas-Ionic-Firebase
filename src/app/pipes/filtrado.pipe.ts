//front/src/app/pipes/filtrado.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Publicacion } from '../models/publicacion.model';

@Pipe({
  name: 'filtrado'
})
export class FiltradoPipe implements PipeTransform {

  transform(items: Publicacion[], filtro:string): Publicacion[] {
    if(!items || !filtro){
      return items;
    }
    filtro = filtro.toLowerCase();
    return items.filter(item => item.title.toLowerCase().includes(filtro));
  }
}
