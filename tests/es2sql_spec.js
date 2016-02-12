import * as Es2Sql from '../src/modules/es2sql.js';
let Lib = Es2Sql.privates;

describe('Test es2Sql module load', () => {
  it('Module should be an object', () => {
    expect(typeof Es2Sql).toBe('object');
  });

  it('Privates should be an object', () => {
    expect(typeof Lib).toBe('object');
  });

  it('Test _urlEncode Method', () => {
    let encoded = Lib._urlEncode('there should be no spaces');
    console.log('t-es-1',encoded, Lib._urlEncode);
    expect(encoded.indexOf(' ')).toEqual(-1);
    expect(encoded.indexOf('%')).toBeGreaterThan(0);
  });
});

describe('Test _urlEncode method', () => {
  it('_urlEncode should be a function', () => {
    expect(typeof Lib._urlEncode).toBe('function');
  });
});

describe('Test _buildQuery Method', () => {
  let testQ = ['SELECT', '*', 'FROM', 'table_name', 'WHERE', 'foo', '=', 'bar'];
  let val = Lib._buildQuery({ q: testQ });

  it('Should return a non-empty string', () => {
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });
});