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
        Tasks TEXT, 
        Price NUMERIC,
        Notes TEXT
      );
    `);

    // Insert empty rows if fewer than 5 rows exist
    for (let i = 0; i < 5; i++) {
      await pool.query(`INSERT INTO "${project}" (Tasks, Price, Notes) VALUES (NULL, NULL, NULL);`);
    }

    res.status(200).json({ message: `${project} table created successfully with 5 empty rows` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});



//update spreadsheet
app.post("/updatespreadsheet", async (req, res) => {
  try {
    const [dataChanges, projectName] = req.body;

    // Map column indexes to column names
    const columnMapping = {
      '0': 'tasks',
      '1': 'price',
      '2': 'notes',
    };
    
    // Array to store SQL queries
    const queries = [];

    // Loop through each column in dataChanges
    dataChanges.forEach((column, colIndex) => {
      // Get the column name based on the column index
      const columnName = columnMapping[colIndex];
      
      // Skip if the column name is not found
      if (!columnName) return;

      // Loop through each row in the column object
      Object.entries(column).forEach(([rowIndex, value]) => {
        // Construct the SQL query for each row update

        const query = `
          INSERT INTO "${projectName}" (id, "${columnName}")
          VALUES ($2, $1)
          ON CONFLICT (id)
          DO UPDATE SET 
            "${columnName}" = EXCLUDED."${columnName}";
        `;
        
        // Add the query to the array with the appropriate values
        queries.push({
          query,
          values: [value, parseInt(rowIndex) + 1] // Assuming rowIndex is 0-based and needs to be 1-based for `id`
        });
      });
    });

    // console.log(await queries)
    // Execute all queries
    await Promise.all(
      queries.map(({ query, values }) =>
        pool.query(query, values)
      )
    );

    res.json({ message: "Data updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
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
    const deleteProject = await pool.query(`DROP TABLE IF EXISTS ${escapeIdentifier(projectName)};`);
    res.json("Project was deleted");
  } catch (err) {
      console.error(err.message);
  }
})
// ------------------------------------------------------------------- //

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });