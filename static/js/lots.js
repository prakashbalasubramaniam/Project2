bar_url = "/downloadolympicdata"
d3.json(function(bar_url){
for (i = 0; i < bar_url.length; i += 1) {
    var count = [];
    var ount = d3.count(bar_url,d=>d.Name);
    // if (count > 12 || count != 0){
        count.push(ount); 
// }

};
});
// data.sort(function compareFunction(lapel,nam) {

//     return lapel-nam;
// });
// medals_won = [];
// function penisbreathe(data) {
//     data = d3.csv("athlete_noc.csv")
//     for (i = 0; i < data.length; i += 1) {
//       var count = d3.count(data, d=> d.name);
//       if (count > 0){
//           return medals_won.push(count); 
//       }
  
//   };
// };
// d3.csv("athlete_noc.csv", function(error,data){
    // if (error) return console.warn(error);
    // console.log(data);
    // var nam = [];
    // var count = [];
    // data.forEach(function(data){
        // console.log(data.Name)
        // var medals_won=d3.count(data, d=>d.Name)
        // count.push(medals_won);
    // })
    // console.log(count)
// });