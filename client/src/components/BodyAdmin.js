import React, { useEffect, useState } from 'react';
import './App_comp.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BodyAdmin(props) {
  const [users, setUsers] = useState([]);

  // useEffect to fetch users list on initial render
  useEffect(() => {
    fetch(`https://${props.server_ip}/users/admin`)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  });

  // useEffect to send PUT request when users state changes
  useEffect(() => {
    fetch(`https://${props.server_ip}/users/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(users),
    })
      .then(response => response.json())
      .then(data => {
        console.log('User list updated:', data);
      })
      .catch(error => {
        console.error('Error updating user list:', error);
      });
  }, [users]); // Dependency array with users state

  
  const handleTaskContentChange = (event, userId, taskId) => {
    const updatedUsers = users.map(user => {
      if (user._id === userId) {
        const updatedTasks = user.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, content: event.target.value };
          }
          return task;
        });
        return { ...user, tasks: updatedTasks };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleTaskDateChange = (date, userId, taskId) => {
    const updatedUsers = users.map(user => {
      if (user._id === userId) {
        const updatedTasks = user.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, date };
          }
          return task;
        });
        return { ...user, tasks: updatedTasks };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleAddTask = (userId) => {
    const updatedUsers = users.map(user => {
      if (user._id === userId) {
        const newTaskId = user.tasks.length + 1;
        const newTaskObj = {
          id: newTaskId,
          content: 'New Task',
          date: new Date(),
        };
        const updatedTasks = [...user.tasks, newTaskObj];
        return { ...user, tasks: updatedTasks };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleDeleteTask = (userId, taskId) => {
    const updatedUsers = users.map(user => {
      if (user._id === userId) {
        const updatedTasks = user.tasks.filter(task => task.id !== taskId);
        return { ...user, tasks: updatedTasks };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <div className="container">
      <h3>All Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                {user.tasks.map((task, index) => (
                  <div key={task.id} className="task-container d-flex justify-content-center align-items-center mb-3">
                    <div className="task-field">
                      <label>Task:</label>
                      <input
                        className='table-fields'
                        type="text"
                        value={task.content}
                        onChange={event => handleTaskContentChange(event, user._id, task.id)}
                      />
                    </div>
                    <div className="task-field">
                      <label>Date:</label>
                      <DatePicker
                        selected={new Date(task.date)}
                        onChange={date => handleTaskDateChange(date, user._id, task.id)}
                        className="datepicker"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div className="task-field">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(user._id, task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAddTask(user._id)}
                >
                  Add Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BodyAdmin;
