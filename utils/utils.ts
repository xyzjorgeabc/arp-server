import { isArray } from "util";

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