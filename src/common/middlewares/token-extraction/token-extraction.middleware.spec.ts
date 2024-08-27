import { TokenExtractionMiddleware } from './token-extraction.middleware';

describe('TokenExtractionMiddleware', () => {
  it('should be defined', () => {
    expect(new TokenExtractionMiddleware()).toBeDefined();
  });
});
