import { AppController } from './app.controller';

describe('AppController', () => {
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(AppController.getRoot()).toBe('Hello World!');
    });
  });
});
