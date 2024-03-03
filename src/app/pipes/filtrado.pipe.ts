//front/src/app/pipes/filtrado.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Publicacion } from '../models/publicacion.model';

@Pipe({
  name: 'filtrado'
})
export class FiltradoPipe implements PipeTransform {

  transform(items: any[], filtro:string, campoFiltrado:string =''): any[] {
    if(!items || (!filtro && !campoFiltrado)){
      return items;
    }
    filtro = filtro.toLowerCase();
    return items.filter(item => {
      if (campoFiltrado && item[campoFiltrado]) {
        return item[campoFiltrado].toLowerCase().includes(filtro);
      } else {
        for (const key in item) {
          if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
            if (item[key].toLowerCase().includes(filtro)) {
              return true;
            }
          }
        }
        return false;
      }
    });
  }
}
