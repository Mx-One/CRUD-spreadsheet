/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import jspreadsheet from "jspreadsheet-ce";
// eslint-disable-next-line no-unused-vars
import jexcel from "jexcel"; // Required to correctly render the context menu
import "jspreadsheet-ce/dist/jspreadsheet.css";
 

export default function Spreadsheet({data, projectName}) {

  const dataArr = data
  const dataChanges = [{}, {}, {}];  //Create an empty array with three objects where each object represent a column

  const updateData = (change) => {
    for (const [col, rows] of Object.entries(change)) {
      if (!dataChanges[col]) {
        dataChanges[col] = {}; // Initialize column if it does not exist
      }
      
      // Update each row in the column
      for (let [row, value] of Object.entries(rows)) {

        // Remove any non-numeric characters except for the decimal point
        if (col === "1") {
          value = parseFloat(value.replace(/[^0-9.-]+/g, ''))
    
        }
        dataChanges[col][row] = value
      }
    }
  };

  const onSave = async e => {
    e.preventDefault();
    try {
        const body = [dataChanges, projectName]
        await fetch("http://localhost:5000/updatespreadsheet", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        console.log(dataChanges)
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
   onchange: (instance, cell,  col, row, value) => {
    if (col === '1') countSum(jRef, Number(col));
    updateData({[col]: {[row]: value}});
  }

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
