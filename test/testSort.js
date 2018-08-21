var array=[],obj={
    caffeineoverdose:'2517',
    workhardplayhard:'761277',
    familia:'4633452'
};
for(a in obj){
    array.push([a,obj[a]])
}
array.sort(function(a,b){return a[1] - b[1]});
array.reverse();

console.log(JSON.stringify(obj));