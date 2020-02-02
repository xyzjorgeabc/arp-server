import { isArray } from "util";
import { RegistroAlbaranCompra, RegistroAlbaranVenta, UkObject } from '../utils/interfaces';


export function keysToLC( arrOrObj: Array<{[key:string]: any}> | {[key:string]: any}): Array<any> | any {
  if (isArray(arrOrObj)) {
    const arr = [];

    for(let i = 0; i < arrOrObj.length; i++){
      arr.push(_keysToLC(arrOrObj[i]));
    }
    return arr;
  } else {
    return _keysToLC(arrOrObj);
  }
};

function _keysToLC(o: {[key:string]: any}): {} {
  return Object.keys(o).reduce((c: {[key:string]: any}, k: string) => {
    const key: string = k.toLowerCase();
    c[key] = o[k];
    return c;
  }, {});
}
 
export function getMes(strFecha: string): number {
  const tmp = strFecha.split('');
  return +(tmp[3] + tmp[4]);
}

enum SEQUENCE_STATES {
  READY,
  STARTED,
  DONE
};

export function get_imp(registros: RegistroAlbaranCompra[] | RegistroAlbaranVenta[] ): UkObject {

  const impuestos: UkObject = {};

  for (let i = 0; i < registros.length; i++) {
    const reg = registros[i];
    const imp_porc = reg.iva + '';
    if ( !(imp_porc in impuestos) ) {
      impuestos[imp_porc] = 0;
    }
    impuestos[imp_porc] += reg.precio_coste * reg.cantidad * (1 - (reg.descuento / 100)) * (reg.iva / 100);
  }

  return impuestos;
}

export function get_base(registros: RegistroAlbaranCompra[] | RegistroAlbaranVenta[] ): number {

  let base: number = 0;

  for (let i = 0; i < registros.length; i++) {
    const reg = registros[i];
    base += reg.precio_coste * reg.cantidad * (1 - reg.descuento / 100);
  }

  return base;
}

export function get_total(registros: RegistroAlbaranCompra[] | RegistroAlbaranVenta[] , desc_general: number): number {

  const total_base: number = get_base(registros) * ( 1 - desc_general / 100 );
  const impuestos:UkObject = get_imp(registros);
  let total_impuestos: number = 0;

  for (let imp in impuestos) {
    total_impuestos += impuestos[imp] * (1 - desc_general / 100);
  } 

  return total_base + total_impuestos;
}

export class Sequence {

  private state: SEQUENCE_STATES;
  private data: Array<any> | Object;
  private steps: Array<any>;
  constructor ( data: Array<any> | Object ){
    this.data = data;
    this.steps = [];
    this.state = SEQUENCE_STATES.READY;
  }
  private _next() {
    if (this.steps.length) {
      this.steps.shift()(this._next.bind(this));
    } else {
      this.state = SEQUENCE_STATES.DONE;
    }
  }
  public do(fun: Function): void {
    if (!this.steps.length && this.state === SEQUENCE_STATES.READY) {
      this.state = SEQUENCE_STATES.STARTED;
      this.steps.push(fun.bind(null, this.data));
      this._next();
    } else {
      this.steps.push(fun.bind(null, this.data));
    }
  }
}
