const mongoose = require('mongoose');
// we are going to use bluebird for promises
// Use bluebird
mongoose.Promise = require('bluebird');

// be sure to pass options here to avoid dep warning: mogoose >= 4.11
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });

let Schema = mongoose.Schema;

// everything starts with a schema definition
let kittySchema = Schema({ name: String });

// we can add functions to our documents
// but this is done *before* creating the model!
kittySchema.methods.speak = function () {
  let greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
    console.log(' => called greeting(): ' + greeting);
}

// a model is a class with which we construct documents
let Kitten = mongoose.model('Kitten', kittySchema);

// now we can create a kitten document
// and call the speak() method to have this kitten speak its name
let silence = new Kitten({ name: 'Silence' });
silence.speak();

// and another kitten document and speak()
let fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak();

// and now we can save our kittens to the db
// be careful here. we can't use callback (as in the tutorial)
// and mpromises get a dep warning telling us to plug in our
// own promise library instead -> using bluebird
silence.save()
  .then( (doc) => {
    console.log('* => saved silence');
    console.log(doc); // this will the document we just saved
    console.log('* ***************');
  })
  .catch( (err) => {
    console.error(err);
  });

fluffy.save()
  .then( (doc) => {
    console.log('* => saved fluffy');
    console.log(doc); // this will the document we just saved
    console.log('* ***************');
  })
  .catch( (err) => {
    console.error(err);
  });

// we can access all the kittens through the Kitten model
Kitten.find()
  .then( (docs) => {
    console.log('* => found all the kittens');
    console.log(docs);
    console.log('* ************************');
  })
  .catch( (err) => {
    console.error(err);
  });

// suppose we want to find a speecific kitten
Kitten.find({ name: /^fluff/ }) // we can use regex for the search
  .then( (docs) => {
    console.log('* => found kittens whose name starts with fluff');
    console.log(docs);
    console.log('* ************************');
  })
  .catch( (err) => {
    console.error(err);
  })
