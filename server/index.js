const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//middleware
app.use(cors());    
app.use(express.json());

//get all todos
app.get("/projects", async (req,res) => {
  try 
  {
    const allProjects = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';");
    res.json(allProjects.rows);
  } 
  catch(err) 
  {
    console.error(err.message);
  }
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });


  //create a new item in the spreadsheet
// app.post("/createItem", async (req, res) => {
//   try 
//   {
//     const { 
//       slabName, 
//       finish, 
//       supplier, 
//       sf, 
//       slabsQty, 
//       ourPrice, 
//       sellingPrice, 
//       ourTotal, 
//       clientsTotal, 
//       notes } = req.body;
    
//     // Construct the SQL query dynamically based on the provided columns
//     const columns = [];
//     const values = [];
//     const placeholders = [];

//     if (slabName) {
//       columns.push('"Slab name"');
//       values.push(slabName);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (finish) {
//       columns.push('Finish');
//       values.push(finish);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (supplier) {
//       columns.push('Supplier');
//       values.push(supplier);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (sf) {
//       columns.push('SF');
//       values.push(sf);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (slabsQty) {
//       columns.push('"Slabs q-ty"');
//       values.push(slabsQty);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (ourPrice) {
//       columns.push('"Our price"');
//       values.push(ourPrice);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (sellingPrice) {
//       columns.push('"Selling price"');
//       values.push(sellingPrice);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (ourTotal) {
//       columns.push('"Our TOTAL"');
//       values.push(ourTotal);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (clientsTotal) {
//       columns.push('"Client\'s TOTAL"');
//       values.push(clientsTotal);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }
//     if (notes) {
//       columns.push('Notes');
//       values.push(notes);
//       placeholders.push(`$${placeholders.length + 1}`);
//     }

//     // Ensure at least one column is provided
//     if (columns.length === 0) {
//       return res.status(400).json({ error: 'At least one column value must be provided' });
//     }

//     const query = `INSERT INTO spreadsheet (${columns.join(', ')}) VALUES(${placeholders.join(', ')}) RETURNING *`;

//     const createItem = await pool.query(
//       `INSERT INTO spreadsheet 
//       ("Slab name", 
//       Finish, 
//       Supplier, 
//       SF, 
//       "Slabs q-ty", 
//       "Our price", 
//       "Selling price", 
//       "Our TOTAL", 
//       "Client's TOTAL", 
//       Notes) 
//       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
//       [
//         slabName, 
//         finish, 
//         supplier, 
//         sf, 
//         slabsQty, 
//         ourPrice, 
//         sellingPrice, 
//         ourTotal, 
//         clientsTotal, 
//         notes
//       ]
//     );
//     res.json(createItem.rows[0]);
//   } 
//   catch (err) 
//   {
//     console.error(err.message);
//   }
// });