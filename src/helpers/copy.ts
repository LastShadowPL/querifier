import { ObjectLit } from "..";
import { isArray, isObject } from "../checkers";

export interface RONArr<T> extends ReadonlyArray<T | RONArr<T>> {}
interface nArr<T> extends Array<T | Array<T>> {}
export function copyArray<T = any>(arr: nArr<T>): nArr<T> {
  const out: nArr<T> = []
  for(const x of arr) {
    if(isArray(x)) {
      // @ts-ignore
      out.push(copyArray(x))
    } else if(typeof x === "object") {
      out.push(copyObj(x))
    } else {
      out.push(x)
    }
  }
  return out
}

export function copyObj<T = ObjectLit>(obj: T): T {
  let out: T
  if(obj instanceof Map) {
    out = new Map(obj.entries()) as unknown as T
  } else if (obj instanceof Set) {
    out = new Set(obj.values()) as unknown as T
  } else { 
    out = {} as T
    for(const prop in obj) {
      const x = obj[prop]
      if(isArray(obj[prop])) {
        // @ts-ignore
        out[prop] = copyArray(x)
      } else if(isObject(x)) {
        out[prop] = copyObj(obj[prop])
      } else {
        out[prop] = obj[prop]
      }
    }
  }
  // @ts-ignore
  return out
}