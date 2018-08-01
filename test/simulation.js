const n = 100;
const m = parseInt(n / 5);
const l = parseInt(n / m);
console.log('Using m:' + m + ' l:'+l);

const iter = 10000;
const output = new Array(n);

for(var i = 0; i<iter; i++){
  var r = Math.random().toString().substr(2);
  var a = r.substr(10,14) % l;
  var b = r.substr(5,9) % m;
  var c = r.substr(0,4) % n;

  var o = a*b + c;
  var rs = o-n;

  if(rs>=0) {
    // console.log('Residual: ' + rs)

    o = n-1-(rs%n);
    // console.log('o: ' + o)
  }
  output[o] = output[o] ? (output[o] + 1) : 1;
  // console.log('a:' +a+'  b:'+b+'  c:'+c+ '   o:'+ o);
}
console.log('Ratio: ' + (output[n-1]/output[0]).toFixed(2));
// console.log("Probabilities:")
// for (var el in output){
//   var prob = (output[el]/iter) * 100;
//   console.log(el + ':   ' +  prob.toFixed(2) + '%');
// }
// console.log('0:   ' +  ((output[0]/iter) * 100).toFixed(2) + '%');
// console.log((n-1) + ':   ' +  ((output[n-1]/iter) * 100).toFixed(2) + '%');
