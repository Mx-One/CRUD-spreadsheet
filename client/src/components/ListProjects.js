import React, { Fragment, useEffect, useState } from "react";
const ListProjects = () => {
    
    const [projects, setProjects] = useState([])

    const deleteProject = async (projectName) => {
        try {
            const deleteProject = await fetch(`http://localhost:5000/projects/${projectName}`,               
                {
                    method: "DELETE"
                });
        
        setProjects(projects.filter(project => project.table_name !== projectName));

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

    useEffect(() => {
        getProjects();
    }, [])

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
            <tbody>
                {/* <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                </tr> */}  
                {projects.map(project => (
                    <tr key={project.table_name}>
                        <td>{project.table_name}</td>
                        <td>
                            <h6>Edit</h6>
                            {/* <EditTodo todo={todo}/> */}
                        </td>
                        <td><button className="btn btn-danger" onClick={() => deleteProject(project.table_name)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
            </table>  
        </Fragment>
    )
}

export default ListProjects;