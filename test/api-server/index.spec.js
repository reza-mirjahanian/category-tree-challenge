'use strict';
const expect = require('chai').expect;
require('../../server/api-server'); //@todo maybe cleanup

const constants = require('../../server/constants');
const categoryRepo = require('../../server/repository/category');
const axios = require('axios');
const _ = require('lodash');

const SERVER_URL = `http://localhost:${constants.EXPRESS_PORT}/`;
const _insertMockData = async () => {
  //Todo insertMany is beter

  await categoryRepo.create({
    id: 1,
    name: 'Books',
    path: '/0/',
    parent_id: 0
  });

  //Books/Programming
  await categoryRepo.create({
    id: 2,
    name: 'Programming',
    path: '/0/1/',
    parent_id: 1
  });

  //Books/Cooking
  await categoryRepo.create({
    id: 3,
    name: 'Cooking',
    path: '/0/1/',
    parent_id: 1
  });

  //Books/Programming/JavaScript
  await categoryRepo.create({
    id: 4,
    name: 'JavaScript',
    path: '/0/1/2/',
    parent_id: 2
  });

  //Books/Programming/Database
  await categoryRepo.create({
    id: 5,
    name: 'Database',
    path: '/0/1/2/',
    parent_id: 2
  });

  //Books/Cooking/Desert
  await categoryRepo.create({
    id: 6,
    name: 'Desert',
    path: '/0/1/3/',
    parent_id: 3
  });

  //Books/Cooking/Salad
  await categoryRepo.create({
    id: 7,
    name: 'Salad',
    path: '/0/1/3/',
    parent_id: 3
  });

  //Movies
  await categoryRepo.create({
    id: 8,
    name: 'Movies',
    path: '/0/',
    parent_id: 0
  });

  //Movies/Horror
  await categoryRepo.create({
    id: 9,
    name: 'Horror',
    path: '/0/8/',
    parent_id: 8
  });


};


suite('Testing Express API routes', () => {
  setup(async () => {
    await categoryRepo.removeAll();
  });
  suite('GET /', () => {
    test('should respond with "Server is running" ', async () => {
      const {
        data: response
      } = await axios.get(SERVER_URL);
      expect(response).to.equal("Server is running")
    });
  });

  suite('GET /api/categories', () => {
    test('should return full category tree" ', async () => {
      await _insertMockData();
      const {
        data: response
      } = await axios.get(SERVER_URL + 'api/categories');
      expect(response).to.be.an('array').that.have.lengthOf(2);
      expect(response[0]).to.have.all.keys('name', 'path', 'id', 'parent_id', 'children');
      expect(response.find((c) => c.name === "Movies").children).to.have.deep.equal([{
        children: [],
        id: 9,
        name: "Horror",
        parent_id: 8,
        path: "/0/8/"
      }]);
    });
  });

  suite('GET /api/categories?id=1', () => {
    test('should return full category tree" ', async () => {
      await _insertMockData();
      const testId1 = 1;
      const {
        data: response
      } = await axios.get(SERVER_URL + 'api/categories?id=' + testId1);
      expect(response).to.be.an('array').that.have.lengthOf(2);
      expect(response[0]).to.have.all.keys('name', 'path', 'id', 'parent_id', 'children');
      expect(response[0].parent_id).to.equal(1);
      expect(_.map(response, 'name')).to.be.deep.equal(['Programming', 'Cooking']);
      const cookingChild = response.find(o => o.name === 'Cooking').children;
      expect(_.map(cookingChild, 'name')).to.be.deep.equal(['Desert', 'Salad'])
    });
  });

});
