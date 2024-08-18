import React, { Fragment, useEffect, useState } from "react";
import AddProject from "./AddProject";
import EditProject from "./EditProject";

const ListProjects = ({viewHandle, listView, changeProjectName, uploadData}) => {
    
    const [projects, setProjects] = useState([]);

    const deleteProject = async (projectName) => {
        try {
            await fetch(`http://localhost:5000/projects/${projectName}`,               
                {
                    method: "DELETE"
                });
        
        setProjects(projects.filter(project => project.table_name !== projectName));
        changeProjectName("")
        uploadData([])

        } catch (err) {
            console.error(err.message)
        }
    }


    const getProjects = async () => {
        try {
            const response = await fetch(`http://localhost:5000/projects`);
            const jsonData = await response.json();
            setProjects(jsonData);  
        } catch (err) {
            console.error(err.message)
        }
    }

    const openProject = async (e, projectName) => {
        e.preventDefault();
        try {
            const body = {projectName}
            const response = await fetch("http://localhost:5000/openproject", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); 
            
            changeProjectName(projectName)
            uploadData(data)
            viewHandle(false)
      
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        if (listView)
            getProjects();
    }, [listView])


    return (
        <Fragment>
            <table className="table mt-5 text-center">
            <thead>
                <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody className="mt-5"> 
                {projects.map(project => (
                    <tr key={project.table_name}>
                        <td> 
                            <div 
                            onClick={(e) => openProject(e, project.table_name)}
                            className="glow-border">
                                {project.table_name}
                            </div>
                        </td>
                        <td>
                            <EditProject 
                            project={project.table_name}/>
                        </td>
                        <td><button className="btn btn-danger" onClick={() => deleteProject(project.table_name)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
            </table>
            <AddProject 
                viewHandle={viewHandle} 
                changeProjectName={changeProjectName}
                uploadData={uploadData}/>  
        </Fragment>
    )
}

export default ListProjects;