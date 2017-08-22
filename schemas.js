const mongoose = require('mongoose');
// we are going to use bluebird for promises
// Use bluebird
mongoose.Promise = require('bluebird');
// be sure to pass options here to avoid dep warning: mogoose >= 4.11
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
let Schema = mongoose.Schema;


// everything starts with defining your schema
// each schema maps to a MongoDB collection
let blogSchema = new Schema( {
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

// create a model from the schema
let Blog = mongoose.model('Blog', blogSchema);
// now we are ready to use Blog

// *********************************************************************

// instance methods: some are built-in and we can create custom
let animalSchema = new Schema( {name: String, type: String });

// creating our own instance method for finding animals of the same
// type in the db
// REMEMBER: cannot use arrow functions here because they do not
// bind this, arguments, super, or new.target
animalSchema.methods.findSimilarTypes = function (cb) {
  // this will return all the documents in the collection of
  // animals that are of the same type as the object this
  // method was called on.
  return this.model('Animal').find({ type: this.type }, cb);
};

// now all the animal instances will have a findSimilarTypes method

// we can also add static methods to our model
animalSchema.statics.findByName = function(name, cb) {
  return this.find({name: new RegExp(name, 'i') }, cb);
};

// we can also add query helpers that extend mongoose's chainable
// query builder API
animalSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};

// create some animals...
let Animal = mongoose.model( 'Animal', animalSchema );
let dog1 = new Animal( {name: 'Dog1', type: 'dog'});
let dog2 = new Animal( {name: 'Dog2', type: 'dog'});
let dog3 = new Animal( {name: 'fido', type: 'dog'});
let cat1 = new Animal( {name: 'Cat1', type: 'cat'});

dog1.save()
  .then( (doc) => {
    console.log('dog1 saved');
  })

dog2.save()
  .then( (doc) => {
    console.log('dog2 saved');
  })
dog3.save()
  .then( (doc) => {
    console.log('dog3 saved');
  })

cat1.save()
  .then( (doc) => {
    console.log('cat1 saved');
  })

// now we can use the findSimilarTypes() to query the database
// for us.

dog1.findSimilarTypes( (err, dogs) => {
  console.log('Find by similar types on dog1:');
  console.log(dogs);
  console.log('******************************');
});

cat1.findSimilarTypes( (err, cats) => {
  console.log('Find by similar types on cat1:');
  console.log(cats);
  console.log('******************************');
});

// and we can also use our static method
Animal.findByName('fido', (err, animals) => {
  console.log('=> *****************************');
  console.log('=> Animals matching fido');
  console.log(animals);
});

// and we can use the query helper we defined
Animal.find().byName('fido').exec( (err, animals) => {
  console.log('=> using chainable queries we defined');
  console.log('=> Animals with name fido');
  console.log(animals);
});

// *********************************************************************
// Indexes

animalSchema.index({name: 1, type: -1}); // schema level index

// *********************************************************************
// Virtuals - doc props you can get and set but do not persist in db
let personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

personSchema.virtual('fullName').
  get( function () { return this.name.first + ' ' + this.name.last; }).
  set( function (v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

let Person = mongoose.model('Person', personSchema);

let axl = new Person({
  name: {first: 'Axl', last: 'Rose'}
});

// you could print their name this way...
console.log('Print the normal way:');
console.log(axl.name.first + ' ' + axl.name.last);

// now we can call the getter function any time we need full name
console.log('Print using a virtual:');
console.log(axl.fullName);

// and we can also set the first and last name from fullName
axl.fullName = 'William Rose';
console.log('Set using a virtual:');
console.log(axl.name.first + ' ' + axl.name.last);

// *********************************************************************
// Aliases - convert a short name prop in db into longer name for readability
// does this really help save network bandwidth???
let personSchema2 = new Schema({
  n: {
    type: String,
    alias: 'name'
  }
});

let Person2 = mongoose.model('Person2', personSchema2);

let person2 = new Person2({ name: 'Val' });
console.log('Using Aliases (short in db, longer in code for readability)');
console.log(person2);
console.log(person2.toObject({ virtuals: true }));
console.log(person2.name);
