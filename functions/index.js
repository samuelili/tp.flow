const functions = require('firebase-functions');

const accountSid = 'AC843246cfd9557b4ce85123a74f36cda0';
const authToken = 'cec1cd2257f527cddc95c27ba2a5f4dc';
const client = require('twilio')(accountSid, authToken);
const from = '+12029028478';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sendMessage = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    client.messages
      .create({
        body: req.body.message,
        from,
        to: req.body.to
      })
      .then(message => res.send(message.sid))
      .catch(() => {
        res.status(500).send('Something went wrong!');
      });
  }
});

