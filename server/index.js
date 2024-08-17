const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//middleware
app.use(cors());    
app.use(express.json());

//get all projects
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

//get a table for a project
app.post("/openproject", async (req,res) => {
  try 
  {
    const {projectName} = req.body
    const project = await pool.query(`SELECT * FROM "${projectName}" ORDER BY id;`);
    res.json(project.rows);
  } 
  catch(err) 
  {
    console.error(err.message);
  }
});

//add a project
app.post("/addproject", async (req, res) => {
  try {
    const { project } = req.body;

    // Check if the table already exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${project}'
      );
    `);

    const tableExists = checkTable.rows[0].exists;

    if (tableExists) {
      return res.status(400).json({ message: "The project with this name already exists. Choose a different name." });
    }

    // Create the table if it doesn't exist
    await pool.query(`
      CREATE TABLE "${project}" 
      (
        id SERIAL PRIMARY KEY,
        tasks TEXT, 
        price NUMERIC,
        notes TEXT
      );
    `);

    // Insert empty rows if fewer than 5 rows exist
    for (let i = 0; i < 5; i++) {
      await pool.query(`INSERT INTO "${project}" (tasks, price, notes) VALUES (NULL, NULL, NULL);`);
    }

    const data = await pool.query(`SELECT * FROM "${project}" ORDER BY id;`);
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------------------------------------------- //
function escapeIdentifier(identifier) {
  // Double quotes around the identifier, escaping any internal double quotes
  return '"' + identifier.replace(/"/g, '""') + '"';
}

//delete a project
app.delete("/projects/:table_name", async (req,res) => {
  try {
    const projectName = req.params.table_name;
    await pool.query(`DROP TABLE IF EXISTS ${escapeIdentifier(projectName)};`);
    res.json("Project was deleted");
  } catch (err) {
      console.error(err.message);
  }
})
// ------------------------------------------------------------------- //


//re-write table
app.post("/onsave", async (req, res) => {
  const client = await pool.connect();

  try {
    const [data, projectName] = req.body;
    // console.log(data, projectName);

    // Start transaction
    await client.query('BEGIN');

    // Drop table if it exists
    await client.query(`DROP TABLE IF EXISTS ${escapeIdentifier(projectName)}`);

    // Create new table
    await client.query(`
      CREATE TABLE "${projectName}" 
      (
        id SERIAL PRIMARY KEY,
        tasks TEXT, 
        price NUMERIC,
        notes TEXT
      );
    `);

    // Insert rows
    for (const row of data) {
      const priceValue = typeof row[1] === 'string'
        ? parseFloat(row[1].replace(/[^0-9.-]+/g, ''))
        : parseFloat(row[1]) || null;

      await client.query(
        `INSERT INTO "${projectName}" (tasks, price, notes) VALUES ($1, $2, $3)`,
        [row[0] || null, priceValue || null, row[2] || null]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({ message: 'Spreadsheet updated successfully' });
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error updating spreadsheet:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });