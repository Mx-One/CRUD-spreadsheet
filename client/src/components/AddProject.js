import React, {Fragment, useState} from "react";

const AddProject = ({viewHandle, changeProjectName, uploadData}) => {

    const [project, addProject] = useState("");

    const OnSubmitForm = async e => {
        e.preventDefault();
        try {
            // Trim the project name before sending it
            const trimmedProjectName = project.trim();
            const body = { project: trimmedProjectName };

            const response = await fetch("http://localhost:5000/addproject", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            changeProjectName(trimmedProjectName);
            
            const data = await response.json();
            uploadData(data); 
            viewHandle(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
    <Fragment>  
        <div className="text-center mt-5">   
            <button type="button" className="btn btn-outline-primary btn-lg" data-toggle="modal" data-target="#modal1">
                Add Project
            </button>
        </div>
        <div className="modal" id="modal1" onClick={e => addProject("")}>
        <div className="modal-dialog">
            <div className="modal-content">


            <div className="modal-header">
                <h4 className="modal-title">Add Project</h4>
                <button type="button" className="close" data-dismiss="modal" onClick={e => addProject("")}>&times;</button>
            </div>

            <div className="modal-body">
                <input type="text" className="form-control" value={project} onChange={e => addProject(e.target.value)}/>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-success" data-dismiss="modal" onClick={e => OnSubmitForm(e)}>Add</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={e => addProject("")}>Close</button>
            </div>

            </div>
        </div>
        </div>
    </Fragment>
)}

export default AddProject;


