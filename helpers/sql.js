const { BadRequestError } = require("../expressError");

/**
 * Helper function for making selective update queries
 * 
 * Calling function can use it to make SET clause of SQL UPDATE queries.
 * 
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param  jsToSql {object} maps js-style data fields to database columns names,
 *   like {firstName: "first_name", age: "age"}
 * 
 * @returns {Object} {sqlSetCols, dataToUpdate}
 * 
 *  @example {firstName: 'John', age: 21} => {setCols: '"first_name"=$1, "age"=$2', values:['john, 21]}
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'John', age: 21} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
