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


app.use(express.json());
function appErrorHandler(err, req, res, next) {
  res.status(500).send('Something broke!')
  res.status(404).json({
    status: 404,
    error: 'Nie znaleziono'
  })
}
app.use(appErrorHandler);
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

const badNews = (req, response) => {
  console.log('req')
  const updatedJson2 = JSON.stringify({ brak: "password lub/i email" });
  console.log("jest ok")
  return response.json(updatedJson2);
}
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

  function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

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

      if ('Imię i nazwisko' in b) {

        renameKey(b, 'Imię i nazwisko', 'beforeSplit')
        const nameLastname = b.beforeSplit
        const afterSplit = nameLastname.split(' ');
        const resultSplit = afterSplit.filter(e => e);
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
      } catch (e) {
        console.log("blad password.trim")
      }
      try {
        pojedynczyUser.email.trim()
      } catch (e) {
        console.log("blad email.trim")
      }

      //tutaj robisz jeszcze jakieś inne rzeczy na zmiennej pojedynczyUser
      return pojedynczyUser // Musisz to zwrócić żeby te operacje się gdzieś zapisały
    })
  });
  
  const afterCheck = newVictory.every((e) => {
    if (
      e.every((b) => {
        if ('password' in b && 'email' in b) {
          console.log("password ok")
          return true
        }
        else {

          console.log("no password")
          return false

        }

      }) == true) {
        return true

    }
    else {
      return false
    }

  })
  console.log(afterCheck);

  if (afterCheck == true) {
    console.log("password is ok")
    const updatedJson = JSON.stringify(newVictory);

    console.log(updatedJson);

    return response.json(updatedJson);
  }
  else {
    badNews(req, response)

  }

});
