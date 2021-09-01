'use strict';

const
  Schema = require('mongoose').Schema,
  Models = require('./models');

class Category extends Models {
  static schema() {
    return new Schema({
      id: {
        type: Number,
        required: true,
        index: true,
        unique: true
      },
      parent_id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true,
        index: true
      },
      path: {
        type: String,
        index: 'text'
      },
      deleteAt: {
        type: Date,
        default: null,
        index: true
      }

    }, {
      timestamps: true
    });
  }

  static collectionName() {
    return 'category';
  }

  static connection() {
    return 'default';
  }
}

module.exports = Category;
