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
animalSchema.methods.findSimilarTypes = function (cb) {
  return this.model('Animal').find({ type: this.type }, cb);
};

// now all the animal instances will have a findSimilarTypes method

let Animal = mongoose.model( 'Animal', animalSchema );
let dog1 = new Animal( {name: 'Dog1', type: 'dog'});
let dog2 = new Animal( {name: 'Dog2', type: 'dog'});
let cat1 = new Animal( {name: 'Cat1', type: 'cat'});

dog1.save()
  .then( (doc) => {
    console.log('dog1 saved');
  })

dog2.save()
  .then( (doc) => {
    console.log('dog2 saved');
  })

cat1.save()
  .then( (doc) => {
    console.log('cat1 saved');
  })


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
