const express = require('express');
const multer = require('multer');
//var upload = multer({ dest: 'upload/' })
const uuid = require('uuid')
const path = require('path');
const app = express();
var xlsx = require('xlsx')
app.listen(3001, () => console.log("App is listening..."));
app.use(express.static(
  path.join(__dirname, 'public')));
console.log("opijajej");
//app.use(
//  express.urlencoded({
//  extended: true
//})
//);
//proba gita
app.use(express.json());
// Okreslenie nazwy zapisywanego pliku
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  }
});
const upload = multer({ storage: storage })

app.post('/upload', upload.single('excel.xlsx'), (req, response) => {

  console.log(req.file);
  var wb = xlsx.readFile("./upload/excel.xlsx")

  var sheet_name_list = wb.SheetNames;
  var victory = xlsx.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]])
  console.log(victory)
  function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  //const arr = JSON.parse(victory);
  victory.forEach(obj => renameKey(obj, 'Imię', 'name'));
  victory.forEach(obj => renameKey(obj, 'Nazwisko', 'lastname'));
  victory.forEach(obj => renameKey(obj, 'Adres e-mail', 'email'));
  victory.forEach(obj => renameKey(obj, 'RegId', 'password'));
  victory.forEach(obj => renameKey(obj, 'Firma', 'company'));

  const updatedJson = JSON.stringify(victory);

  console.log(updatedJson);
  //const myJSON = JSON.stringify(victory);
  //console.log(myJSON)

  //var ws = wb.Sheets["SUBTOTAL"]
  //var dat = xlsx.utils.sheet_to_json(ws)
  return response.json(updatedJson);

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});