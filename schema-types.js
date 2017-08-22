// valid schema types:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// Objectid
// Array

const mongoose = require('mongoose');
// we are going to use bluebird for promises
// Use bluebird
mongoose.Promise = require('bluebird');
// be sure to pass options here to avoid dep warning: mogoose >= 4.11
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
let Schema = mongoose.Schema;

let schema = new Schema({
  name:    String,
  binary:  Buffer,
  living:  Boolean,
  updated: { type: Date, default: Date.now },
  age:     { type: Number, min: 18, max: 65 },
  mixed:   Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array:      [],
  ofString:   [String],
  ofNumber:   [Number],
  ofDates:    [Date],
  ofBuffer:   [Buffer],
  // ofBoolean:  [Boolean],
  ofMixed:    [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays:   [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true }
  }
});

let Thing = mongoose.model('Thing', schema);

let m = new Thing;
m.name = 'Statue of Liberty';
m.binary = new Buffer(0);
m.living = false;
m.updated = new Date;
m.age = 40;
m.mixed = { any: { thing: 'i want' } };
m.markModified('mixed');  // mongoose can't detect changes inside...
m._someId = new mongoose.Types.ObjectId;
m.array.push(1);
m.ofString.push("strings!");
m.ofNumber.unshift(1,2,3,4);
m.ofDates.addToSet(new Date);
m.ofBuffer.pop();
// m.ofBoolean
m.ofMixed = [1, [], 'three', { four: 5 }];
m.ofObjectId = new mongoose.Types.ObjectId;
m.ofArrays = [['a'],['b'],['c']];
m.ofArrayOfNumbers = [[1],[2],[3]];
m.nested.stuff = 'good';

m.save()
 .then( (doc) => {
  console.log('Thing m is saved to collection things');
});

// ****************************************************
// Schema-type options
// ALL: required, default, select, validate, get, set, alias
// there are some types that apply for specific schema types

let schema2 = new Schema({
  test: {
    type: String,
    lowercase: true // always convert to lowercase
  }
});

let Lowercase = mongoose.model('Lowercase', schema2);

let n = new Lowercase;
n.test = 'THIS WILL BE ALL LOWERCASE IN DB';

n.save()
 .then( (doc) => {
   console.log('saved all uppercase string to db');
 })
 .then( () => {
   Lowercase.find()
   .then( (docs) => {
     console.log('* => found all the lowercase');
     console.log(docs);
     console.log('* ************************');
   })
   .catch( (err) => {
     console.error(err);
   });
 })
