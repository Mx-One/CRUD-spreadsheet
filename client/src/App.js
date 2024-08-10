import React, {Fragment, useState} from "react";
import './App.css';

//components
import ListProjects from "./components/ListProjects";
import Spreadsheet from "./components/Spreadsheet";

function App() {

  const [listView, setListView] = useState(true);
  const [data, setData] = useState([])
  const [projectName, setProjectName] = useState("")

  const viewHandle = (state) => {
    setListView(state);
  }

  const uploadData = (data) => {
    setData(data)
  }

  const changeProjectName = (name) =>
    setProjectName(name)

  return (
    <Fragment>
      <div className="container"> 
        { listView ? 
          (<Fragment> 
            <h1 className="text-center mt-5"> Projects List</h1>
            <ListProjects 
              viewHandle={viewHandle}
              listView={listView}
              uploadData={uploadData}
              changeProjectName={changeProjectName}
            /> 
          </Fragment>) : 
          (<Fragment>
            <div className="text-center mt-10">
              <Spreadsheet data={data} projectName={projectName}/> 
            </div>
            <div className="text-center mt-5"> 
              <button className="btn btn-light btn-lg" onClick={() => viewHandle(true)}>Back</button>
            </div>
          </Fragment>)
        }
      </div>
    </Fragment>
)}

export default App;
