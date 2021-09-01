'use strict';

const logger = require('../utils/logger'),
  constants = require('../constants'),
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
    parentId = 1,
  }) {
    try {
      let pattern = parentId > 0 ? {
        path: new RegExp(`/${parentId}/`, 'i')
      } : null;

      const searchObject = {
        deleteAt: null,
        ...pattern
      };

      return await Model.find(searchObject).limit(constants.QUERIES_MAX_LIMIT).lean();

    } catch (e) {
      logger.error("Category:getCategories()", e);
      return null;
    }
  }



}

module.exports = Category;
