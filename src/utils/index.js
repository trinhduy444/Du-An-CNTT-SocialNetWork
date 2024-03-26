const _ = require("lodash");
const { Types } = require("mongoose");

// Only enter object name & [fieldName1, fieldName2]
const getInfoData = (object = {}, fields = []) => _.pick(object, fields);

const convertObjectIdMongo = (id) => {
  return new Types.ObjectId(id);
};

// ["A","B","C"] => {A:1, B:1, C:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ["A","B","C"] => {A:0, B:0, C:0}
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeObjectFieldNull = (obj) => {
  Object.keys(obj).map((key) => {
    if (obj[key] === null || (typeof obj[key] === "string" && obj[key].trim() === "")) {
      delete obj[key];
    }
  });
  return obj;
};

/**
    obj = {
        a:1,
        b: {
            c:2,
            d:3
        }
    }
    => obj = {a=1, b.c=2, b.d=3}
 */
const updateNestedObjectParser = (obj) => {
  const results = {};
  Object.keys(obj).map((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const subObject = updateNestedObjectParser(obj[key]);
      Object.keys(subObject).map((keySub) => {
        results[`${key}.${keySub}`] = subObject[keySub];
      });
    } else {
      results[key] = obj[key];
    }
  });
  return results;
};

module.exports = { getInfoData, getSelectData, getUnSelectData, removeObjectFieldNull, updateNestedObjectParser, convertObjectIdMongo };