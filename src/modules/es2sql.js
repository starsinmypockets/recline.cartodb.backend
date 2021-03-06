'use strict';
console.log('>>>', __dirname);
import * as _ from 'lodash';

/**
 * Internal query methods
 **/
let privates = {
  // @TODO we need a way to get the table name 
  // cartodb lib handles this i think
  _getTableName: (opts) => {
    console.log('gTn', opts);
  },

  _filters: (opts) => {
    console.log('_f', opts);
    let sqlArr = [];
    // @@TODO - we should also check for type property
    _.each(opts, (data, type) => {
      type = _.capitalize(type);
      let filterMethod = '_add' + type + 'Filter';
      console.log('_k1', data, type, filterMethod);
      sqlArr.push(privates[filterMethod](data));
    });

    return privates._composeQuery(sqlArr);
  },

  _addTermFilter: (opts) => {
    let sql = 'WHERE ';
    let and = false;
    _.each(opts, (key, val) => {
       if (and) sql += ' AND ';
       sql += val + ' = ' + key;
       and = true;
    });
    console.log('_aTF', sql);
    return sql;     
  },

  _addRangeFilter: (opts) => {
    let sql = ['WHERE'];
    let and = false;
    _.each(opts, (data, field) => {
      if (and) sql.push('AND');
      let op = _.keys(data)[0]; // get operator
      let filterVal = data[op]; // get value
      console.log('aRF 1', opts, op, filterVal);
      sql.push(field); // set field
      if (opts.from && opts.to) {
        sql.push([opts.field, '>=' , opts.from, 'AND <=', opts.to]);
      } else if (op) {
        sql.push(privates._rangeOperators[op], filterVal);
      }
      and = true;
    });
    return privates._composeQuery(sql);
  },

  // key elastic search operators to sql operators
  _rangeOperators : {
    gte : '>=',
    lte : '<=',
    gt : '>',
    lt : '<'
  },

  _sort: (opts) => {
    console.log('_s', opts);
  },

  _group: (opts) => {
    console.log('_g', opts); 
  },

  _limit: (opts) => {
    console.log('_l', opts); 
  },

  _composeQuery: (opts) => {
    console.log('_bQ', opts);
    var sql = '';
    _.each(opts, (bit, i) => {
      sql += bit;
      if (i < opts.length - 1) {
        sql += ' ';
      }
    });
    return sql;
  },

  _urlEncode: (str) => {
    return encodeURIComponent(str);
  }
};

module.exports = {
  translate : (opts) => {
    console.log('es2sql 1', opts, privates);
    let q = opts.query;
    let size = q.size || 10;
    let tableName = privates._getTableName(q);
    let filters = privates._filters(q.filters);
    let sort = privates._sort(q.sort);
    let cartoQ = [];
    
    // build sql array
    cartoQ.push('SELECT');
    cartoQ.push(size);
    cartoQ.push('FROM');
    cartoQ.push(tableName);
    
    if (q.size) {    
      cartoQ.push('LIMIT =');
      cartoQ.push(q.size);
    }

    if (q.offset) {
      cartoQ.push('OFFSET =');
      cartoQ.push(q.from);
    }

    if (q.filters) {
      cartoQ.push(filters);
    }

    if (q.sort) {
      cartoQ.push(sort);
    }

    return privates._composeQuery(cartoQ);
  },

  privates : privates //include for unit testing
};
