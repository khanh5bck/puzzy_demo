// var fs = require('fs');
// fs.readFile('./config.json', (err, data) => {
//     if (err)
//       console.log(err);
//     else {
//       var json = JSON.parse(data);
//       console.log(json);
//     //your code using json object
//     }
// })

const fs = require('fs');
 
// json data
var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';
 
// parse json
var jsonObj = JSON.parse(jsonData);
console.log(jsonObj);
 
// stringify JSON Object
var jsonContent = JSON.stringify(jsonObj);
console.log(jsonContent);
 
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});