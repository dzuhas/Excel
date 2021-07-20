const express = require('express');
const multer = require('multer');
//var upload = multer({ dest: 'upload/' })
const uuid = require('uuid')
const path = require('path');
const app = express();
var xlsx = require('xlsx');
const Trim = require('trim');
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
  console.log(sheet_name_list)
  const victory = []
  sheet_name_list.forEach((sheetName) => {
    victory.push(xlsx.utils.sheet_to_json(wb.Sheets[sheetName]))
  })
  //var victory = xlsx.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]])
  console.log(victory)
  function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  //const arr = JSON.parse(victory);
  victory.forEach((e) => {
    e.forEach((b) => {

      if ('Imię' in b) {
        renameKey(b, 'Imię', 'name')
      }

      if ('Nazwisko' in b) {
        renameKey(b, 'Nazwisko', 'lastname')
      }

      if ('Adres e-mail' in b) {
        renameKey(b, 'Adres e-mail', 'email')
      }

      if ('RegId' in b) {
        renameKey(b, 'RegId', 'password')
      }

      if ('Firma' in b) {
        renameKey(b, 'Firma', 'company')
      }

      if ('Hasło' in b) {
        renameKey(b, 'Hasło', 'password')
      }

      if ('Hasło' in b) {
        renameKey(b, 'Hasło', 'password')
      }

      if ('Imię i nazwisko' in b) {
       
        renameKey(b, 'Imię i nazwisko', 'beforeSplit')
        const nameLastname = b.beforeSplit 
        const afterSplit = nameLastname.split(' ');
        const resultSplit =  afterSplit.filter(e =>  e);
       // b.name = resultSplit[0]
        const firstName = resultSplit.shift()
        b.name = firstName
        b.lastname = resultSplit.join()
        delete b.beforeSplit;
       

    }
    })
      
    console.log(victory)

  })
  const newVictory = victory.map(sheet => {
    return sheet.map(pojedynczyUser => {
      try {
        pojedynczyUser.password.trim()
      }  catch(e){
        console.log("blad gupi2")
      }
      try {
        pojedynczyUser.email.trim()
      }  catch(e){
        console.log("blad gupi")
      }
      
      //tutaj robisz jeszcze jakieś inne rzeczy na zmiennej pojedynczyUser
      return pojedynczyUser // Musisz to zwrócić żeby te operacje się gdzieś zapisały
    })
  });
  console.log(newVictory);


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