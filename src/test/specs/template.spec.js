/*
 * SUT:
 */

var properties;

const controller = require('../../routes/mainController'),
      service = require('../../services/mainService');


describe('Template', () => {

  describe('The first behaviour to test', () => {

    spyOn(require, 'node-properties').and.returnValue({
      prop1: 'colacao'
    });

    var stringTest;
    beforeEach(() => {
      stringTest = ' Hola mundo ';
    });

    var expectedTest;
    it('The first test function', () => {
      expectedTest = ' ';

      properties = require('properties');
      console.log(properties);
      
      var trimedString = stringTest.substring(0, 1);

      expect(trimedString).toBe(expectedTest);
    });

  });

});
