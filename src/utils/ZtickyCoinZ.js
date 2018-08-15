export function toZCZ(r){
  if (typeof r.toNumber == 'function') r = r.toNumber();
  return r / 1000000000000000000;
}

export function fromZCZ(r){
  if (typeof r.toNumber == 'function') r = r.toNumber();
  return r * 1000000000000000000;
}
