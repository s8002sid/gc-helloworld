const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function initialize() {
    const docRef = db.collection('users').doc('alovelace');
    await docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });
    docRef = db.collection('users').doc('aturing');

    await docRef.set({
        'first': 'Alan',
        'middle': 'Mathison',
        'last': 'Turing',
        'born': 1912
    });
}
module.exports = {
    initialize: initialize
}