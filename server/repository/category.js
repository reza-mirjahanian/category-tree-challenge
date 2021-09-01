'use strict';

const logger = require('../utils/logger'),
  constants = require('../constants'),
  _ = require('lodash'),
  Model = require('../utils/mongoDB').getModel('Category');


class Category {

  /**
   * Clean table
   * @return {Promise<boolean>}
   */
  static async removeAll() {
    try {
      await Model.deleteMany();
      logger.log("All Categories is cleaned at: " + new Date());
      return true;
    } catch (e) {
      logger.error("Category:removeAll()", e);
      return false;
    }
  }

  /**
   * Return all Data
   * @return {Promise< {Object[]}|null>}
   */
  static async getAll() {
    try {
      return await Model.find({}).limit(constants.QUERIES_MAX_LIMIT).select('name path id parent_id -_id').lean();
    } catch (e) {
      logger.error("Category:getAll()", e);
      return null;
    }
  }

  /**
   * Create new category
   * @param  {Object}
   * @return {Promise<Boolean>}
   */
  static async create({
    name,
    path = '',
    id,
    deleteAt = null,
    parent_id
  }) {

    try {
      //@todo validation
      //@todo ancestor exist and duplication
      await Model.create({
        name,
        path,
        id,
        parent_id,
        deleteAt
      });
      logger.log("New category is created at: " + new Date());
      return true;

    } catch (e) {
      logger.error("Category:create()", e);
      return false;
    }
  }


  /**
   * Return categories based on parentId
   * @return {Promise< {Object[]}|null>}
   */
  static async getCategories({
    parentId = 0,
  }) {
    try {
      let pattern = parentId > 0 ? {
        path: new RegExp(`/${parentId}/`, 'i')
      } : null;

      const searchObject = {
        deleteAt: null,
        ...pattern
      };

      return await Model.find(searchObject).limit(constants.QUERIES_MAX_LIMIT).select('name path id parent_id -_id').lean();

    } catch (e) {
      logger.error("Category:getCategories()", e);
      return null;
    }
  }

  // We assume input data is not corrupted!
  static treeFormatter(categories = []) {
    const tree = [];
    try {
      const catTable = {};
      categories.forEach(category => {
        const categoryId = category['id'];
        const categoryParentId = category['parent_id'];

        catTable[categoryId] = {
          ['children']: [],
          ...category,
          ...catTable[categoryId] // replace
        };

        catTable[categoryParentId] = catTable[categoryParentId] || {
          ['children']: []
        }; // init

        catTable[categoryParentId]['children'].push(catTable[categoryId]);
      });

      //Creating tree
      for (let key in catTable) {
        let category = catTable[key];
        if (!category['id']) { // Only insert top level category from catTable
          tree.push(...category['children']);
        }
      }
      return tree;

    } catch (e) {
      logger.error("Category:treeFormatter()", e);
      return null;
    }
  }



}

module.exports = Category;
