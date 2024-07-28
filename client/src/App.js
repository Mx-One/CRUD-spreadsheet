import React, {Fragment} from "react";
import './App.css';

//components
// import InputTodo from "./components/InputTodo"; 
import ListProjects from "./components/ListProjects";

function App() {
  return (
    <Fragment>
      <div className="container"> 
        {/* <InputTodo/> */}
        <ListProjects/>
      </div>
    </Fragment>
)}

export default App;
