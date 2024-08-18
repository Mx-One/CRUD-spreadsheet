import React, {Fragment, useState} from "react";

const EditProject = ({project}) => {
    
    const [projectName, setProjectName] = useState(project);

    // edit project name function
    const updateProjectName = async(e) => {
        e.preventDefault();
        try {
            const body = {projectName, project}
            await fetch(`http://localhost:5000/projects/${projectName}`,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                }
            )
            window.location = "/";
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>  
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modal2">
                Edit
            </button>
            <div className="modal" id="modal2" onClick={e => setProjectName(project)}>
            <div className="modal-dialog">
                <div className="modal-content">


                <div className="modal-header">
                    <h4 className="modal-title">Edit Project Name</h4>
                    <button type="button" className="close" data-dismiss="modal" onClick={e => setProjectName(project)}>&times;</button>
                </div>

                <div className="modal-body">
                    <input type="text" className="form-control" value={projectName} onChange={e => setProjectName(e.target.value)}/>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateProjectName(e)}>Edit</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={e => setProjectName(project)}>Close</button>
                </div>

                </div>
            </div>
            </div>
        </Fragment>
    )
}

export default EditProject;