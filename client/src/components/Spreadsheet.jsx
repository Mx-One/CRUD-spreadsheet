/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import jspreadsheet from "jspreadsheet-ce";
// eslint-disable-next-line no-unused-vars
import jexcel from "jexcel"; // Required to correctly render the context menu
import "jspreadsheet-ce/dist/jspreadsheet.css";

export default function Spreadsheet({data, projectName}) {

  const convertTo2DArray = (array) => { 
    return array.map(item => [
        item.tasks || '', // Convert null to an empty string for 'tasks'
        parseFloat(item.price) || 0, // Convert null to 0 for 'price'
        item.notes || '' // Convert null to an empty string for 'notes'
    ]);
};
  const dataArr = convertTo2DArray(data) // Convert the data array to a 2D array

  const onSave = async e => {
    e.preventDefault();
    try {
        const body = [dataArr, projectName]
        await fetch("http://localhost:5000/onsave", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
    } catch (err) {
        console.error(err.message);
    }
}

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(value);
}

  function extractFloatFromString(formattedString) {
    if (formattedString.length === 0) return 0;
    // Remove non-numeric characters except for the decimal point
    const numericPart = formattedString.replace(/[^0-9.]/g, '');
    // Parse the string as a float
    const floatPart = parseFloat(numericPart);
    return floatPart;
}

  const countSum = (table, col) => {
      const data = table.current.jspreadsheet.options.data
      const footers = table.current.jspreadsheet.options.footers
      let total = 0
      for (let i = 0; i < data.length; i++) {
          isNumber(data[i][col]) ? total += data[i][col] : total += extractFloatFromString(data[i][col])
      }
      footers[0][col] = formatCurrency(total).toString()
      return footers[0][col]
  }

  // console.log(dataArr)
  const jRef = useRef(null);
  const options = {
    data: dataArr,
    columns: [
      { type: 'text', title:'Tasks', width:200 },
      { type: 'numeric', title:'Price', width:100, mask:'$ #,##.00', decimal:'.' },
      { type: 'text', title:'Notes', width:200 },
   ],
   minDimensions: [3, 5],
   wordWrap: true,
   defaultRowHeight: 30,
   footers: [['Total','$0','']],
   columnSorting: false,
   allowInsertColumn:false,
   allowManualInsertColumn:false,
   rowDrag: false,
   onchange: (instance, cell,  col, row, value) => {
    if (col === '1') countSum(jRef, Number(col));
  },
};
 
  useEffect(() => {
    if (!jRef.current.jspreadsheet) {
      jspreadsheet(jRef.current, options);
    }
    jRef.current.jspreadsheet.options.footers[0][1] = countSum(jRef, 1)
    jRef.current.jspreadsheet.refresh()
  }, [options]);

  const addRow = () => {
    jRef.current.jexcel.insertRow();
  };
 
  return (
    <div>
      <h1 className="text-center mb-5">{projectName}</h1>
      <div ref={jRef} />
      <br />
      <div className="flex">
        <button className="btn btn-light text-start mr-3 mt-3" onClick={addRow}>Add new row</button>
        <button className="btn btn-light text-start ml-3 mt-3" onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
