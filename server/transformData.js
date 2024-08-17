function transformData(data) {
  let transformed = [];
  const numColumns = data[0].length;

  for (let colIndex = 0; colIndex < numColumns; colIndex++) {
    let columnObject = {};
    
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      let value = data[rowIndex][colIndex];
      
      // Handle numeric values and empty strings
      if (colIndex === 1) {  // Assuming column 1 is numeric
        value = value === '' ? 0 : parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
      } else {
        value = value === '' ? '' : value;
      }

      // Store raw values directly
      columnObject[rowIndex + 1] = value;
    }

    transformed.push(columnObject);
  }
  console.log(transformed)
  return transformed;
}

module.exports = transformData;