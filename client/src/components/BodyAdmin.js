import React, { useEffect, useState } from 'react';
import './App_comp.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BodyAdmin(props) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users list on initial render
  useEffect(() => {
    fetch(`https://${props.server_ip}/users/admin`)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [users]);

  useEffect(() => {
    if (selectedUser && selectedUser.tasks) {
      fetch(`https://${props.server_ip}/users/${selectedUser.username}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: selectedUser.tasks }),
      })
        .then(response => {
          if (response.ok) {
            console.log('Task list updated successfully');
          } else {
            console.error('Failed to update task list:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error occurred:', error);
        });
      console.log('Finish update');
    }
    
  }, [selectedUser]);

  const handleUserSelect = (userId) => {
    const selectedUser = users.find(user => user._id === userId);
    setSelectedUser(selectedUser);
  };

  const handleTaskContentChange = (event, taskId) => {
    const updatedTasks = selectedUser.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, content: event.target.value };
      }
      return task;
    });
    const updatedUser = { ...selectedUser, tasks: updatedTasks };
    setSelectedUser(updatedUser);
  };

  const handleTaskDateChange = (date, taskId) => {
    const updatedTasks = selectedUser.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, date };
      }
      return task;
    });
    const updatedUser = { ...selectedUser, tasks: updatedTasks };
    setSelectedUser(updatedUser);
  };

  const handleAddTask = () => {
    const newTaskId = selectedUser.tasks.length + 1;
    const newTaskObj = {
      id: newTaskId,
      content: 'New Task',
      date: new Date(),
    };
    const updatedTasks = [...selectedUser.tasks, newTaskObj];
    const updatedUser = { ...selectedUser, tasks: updatedTasks };
    setSelectedUser(updatedUser);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = selectedUser.tasks.filter(task => task.id !== taskId);
    const updatedUser = { ...selectedUser, tasks: updatedTasks };
    setSelectedUser(updatedUser);
  };

  return (
    <div className="container">
      <h3 className="text-center mt-3">All Users</h3>
      <div className="dropdown mt-3">
        <button
          className="btn btn-primary dropdown-toggle "
          type="button"
          id="userDropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Select User
        </button>
        <div className="dropdown-menu " aria-labelledby="userDropdown">
          {users.map(user => (
            <button
              key={user._id}
              className="dropdown-item"
              onClick={() => handleUserSelect(user._id)}
            >
              {user.username}
            </button>
          ))}
        </div>
      </div>
      {selectedUser && (
        <div className="mt-3">
          <h4 className="text-center">User: {selectedUser.username}</h4>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <input
                        type="text"
                        value={task.content}
                        onChange={event => handleTaskContentChange(event, task.id)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={new Date(task.date)}
                        onChange={date => handleTaskDateChange(date, task.id)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-primary btn-sm "
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      )}
    </div>
  );
}

export default BodyAdmin;
