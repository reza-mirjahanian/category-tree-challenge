'use strict';
const expect = require('chai').expect;
const _ = require('lodash');
const categoryRepo = require('../../server/repository/category');


const mockedDate1 = [{
    name: 'Programming',
    path: '/0/1/',
    id: 2,
    parent_id: 1
  },
  {
    name: 'Cooking',
    path: '/0/1/',
    id: 3,
    parent_id: 1
  },
  {
    name: 'JavaScript',
    path: '/0/1/2/',
    id: 4,
    parent_id: 2
  },
  {
    name: 'Database',
    path: '/0/1/2/',
    id: 5,
    parent_id: 2
  },
  {
    name: 'Desert',
    path: '/0/1/3/',
    id: 6,
    parent_id: 3
  },
  {
    name: 'Salad',
    path: '/0/1/3/',
    id: 7,
    parent_id: 3
  }
];


suite('Testing Category Repository', () => {
  suite('Category CRUD', () => {
    test('should Crate() removeAll() getAll() work correctly', async () => {
      await categoryRepo.removeAll();
      const result1 = await categoryRepo.getAll();
      expect(result1).to.be.an('array').that.is.empty;

      await categoryRepo.create({
        id: 0,
        name: '/',
        path: null,
        parent_id: -1
      });
      await categoryRepo.create({
        id: 1,
        name: 'Books',
        path: '/0/',
        parent_id: 0
      });
      await categoryRepo.create({
        id: 2,
        name: 'Programming',
        path: '/0/1/',
        parent_id: 1
      });
      const result2 = await categoryRepo.getAll();
      expect(result2).to.be.an('array').that.have.lengthOf(3);

      await categoryRepo.removeAll();
      const result4 = await categoryRepo.getAll();
      expect(result4).to.be.an('array').that.is.empty;
    });

  });

  suite('Category->treeFormatter()', () => {
    test('should return tree-like object', () => {

      const tree = categoryRepo.treeFormatter(mockedDate1);
      expect(tree).to.have.lengthOf(2);
      const programmingChild = tree.find(o => o.name === 'Programming').children;
      const cookingChild = tree.find(o => o.name === 'Cooking').children;

      expect(_.map(tree, 'name')).to.be.deep.equal(['Programming', 'Cooking']);
      expect(_.map(programmingChild, 'name')).to.be.deep.equal(['JavaScript', 'Database'])
      expect(_.map(cookingChild, 'name')).to.be.deep.equal(['Desert', 'Salad'])
    });

    test('should handle empty input', () => {
      const tree = categoryRepo.treeFormatter([]);
      expect(tree).to.be.an('array').that.is.empty;
    });
  });

  suite('Category->treeFormatter()', () => {
    test('should return tree-like object', () => {
      const tree = categoryRepo.treeFormatter(mockedDate1);
      expect(tree).to.have.lengthOf(2);
      const programmingChild = tree.find(o => o.name === 'Programming').children;
      const cookingChild = tree.find(o => o.name === 'Cooking').children;

      expect(_.map(tree, 'name')).to.be.deep.equal(['Programming', 'Cooking']);
      expect(_.map(programmingChild, 'name')).to.be.deep.equal(['JavaScript', 'Database'])
      expect(_.map(cookingChild, 'name')).to.be.deep.equal(['Desert', 'Salad'])
    });

    test('should handle empty input', () => {
      const tree = categoryRepo.treeFormatter([]);
      expect(tree).to.be.an('array').that.is.empty;
    });
  });

  suite('Category->getCategories()', () => {
    test('should return data in Array format', async () => {
      const _insertMockData = async () => {
        //Todo insertMany is beter
        await categoryRepo.create({
          id: 0,
          name: '/',
          path: null,
          parent_id: -1
        });

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
      await categoryRepo.removeAll();
      await _insertMockData();
      // const results = await categoryRepo.getCategories({
      //   parentId: 3
      // });
      // expect(_.map(results, 'name')).to.be.deep.equal(['Desert', 'Salad']);
      // expect(results[0]).to.have.all.keys('name', 'path', 'id', 'parent_id');

      const results2 = await categoryRepo.getCategories({
        parentId: null
      });
      expect(results2).to.have.lengthOf(10);
      expect(results2.find((c) => c.name === "/")).to.have.deep.equal({
        name: '/',
        path: null,
        id: 0,
        parent_id: -1
      });
      expect(results2.find((c) => c.id === 5)).to.have.deep.equal({
        name: 'Database',
        path: '/0/1/2/',
        id: 5,
        parent_id: 2
      });

    });


  });



});