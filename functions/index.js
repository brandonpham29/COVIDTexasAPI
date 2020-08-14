const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firestoretest-3538c.firebaseio.com"
});
const db = admin.firestore();




app.get('/api/read/:item_id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('Counties').doc(req.params.item_id);
          let item = await document.get();
          let response = item.data();
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send("Error: County not in Database/Check spelling and capitilization");
      }
      })();
  });

exports.app = functions.https.onRequest(app);

app.get('/api/read', (req, res) => {
  (async () => {
      try {
          let response = [];
          let texasQuery = db.collection('TexasTotal').doc('Texas');
          let texasData = await texasQuery.get();
          const TexasObj = {
            Name: texasData.data().Name,
            Cases: texasData.data().Cases,
            Deaths: texasData.data().Deaths,
          };
          response.push(TexasObj);
          let query = db.collection('Counties');
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
              const selectedItem = {
                  Name: doc.data().Name,
                  Cases: doc.data().Cases,
                  Deaths: doc.data().Deaths,
              };
              response.push(selectedItem);
          }
          return null;
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });