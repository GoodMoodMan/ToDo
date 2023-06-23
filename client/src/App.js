
import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import HeaderTask from './components/HeaderTask';
import BodyTask from './components/BodyTask';
import BodyAdmin from './components/BodyAdmin';

const server_ip = 'to-do-server-goodmoodman.vercel.app';

fetch(`https://${server_ip}`)
  .then(response => response.text())
  .then(data => {
    // Handle the response data
    console.log(data);
  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });


function App() {

  const [true_username, setUsername] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const [curr_tab, setCurr_tab] = useState(1);
  const [tasks, setTasks] = useState([
    { id: 'task-1', content: 'Task 1', date: new Date() },
    { id: 'task-2', content: 'Task 2', date: new Date() },
    { id: 'task-3', content: 'Task 3', date: new Date() },
  ]);

  const [message, setMessage] = useState('');
  const [alert_type, setAlertType] = useState(-1);

  const [guest, setGuest] = useState(false);
  const [admin, setAdmin] = useState(false);


  useEffect(() => {
    // if user is a guest dont post to server
    if (guest) return;
    // this useEffect hook gets called on any change to tasks,
    // putting the new task list to server using saved username
    console.log("update");
    fetch(`https://${server_ip}/users/${true_username}/tasks`, {
      
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
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
    console.log("finish update");


  }, [tasks, guest, true_username])

  // every change to current tab, reset alert
  useEffect(() => {
    setAlertType(-1);
  }, [curr_tab])

  const HandleLogin = (username, password) => {
    console.log("connect");
    fetch(`https://${server_ip}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {

        // Handle the response from the server
        if (response.status === 200) {
          // Login successful
          setMessage('Login Successful');
          setAlertType(1);
          return response.json(); // Parse the response body as JSON
        } else if (response.status === 401) {
          // Invalid password
          setMessage('Wrong Password');
          setAlertType(0);
          throw new Error('Wrong password');
        } else if (response.status === 404) {
          // User not found
          setMessage('User not found');
          setAlertType(0);
          throw new Error('User not found');
        } else {
          // Other errors
          console.error('Error occurred:', response.statusText);
          throw new Error('Error occurred');
        }
      })
      .then(data => {
        // Access the parsed data

        setUsername(username);
        //if (username === 'admin') setAdmin(true);
        setLoggedin(true);
        setTasks(data.tasks);
        console.log(data);

      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  };

  // SERVER SIGNUP
  const HandleSignup = (username, email, password, confirmPassword) => {
    if (username.trim() === '') {
      setMessage('Username cannot be empty!');
      setAlertType(0);
      return;
    }

    if (password.trim() === '') {
      setMessage('Password cannot be empty!');
      setAlertType(0);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setAlertType(0);
      return;
    }

    const validateEmail = email => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setMessage('Please enter a valid email address');
      setAlertType(0);
      return;
    }


    console.log(email);
    fetch(`https://${server_ip}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => {
        // Handle the response from the server
        if (response.status === 200) {
          // Signup successful
          setMessage('Signup Successful');
          setAlertType(1);

          return response.json(); // Parse the response body as JSON
        } else if (response.status === 401) {
          // Username Taken
          setMessage('Username Already Taken');
          setAlertType(0);
          throw new Error('Username Taken');
        } else {
          // Other errors

          console.error('Error occurred:', response.statusText);
          throw new Error('Error occurred');
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  }

  const HandleLogoff = () => {
    setAlertType(-1);
    setLoggedin(false);
    setGuest(false);
  }


  const HandleGuest = () => {
    setLoggedin(true);
    setGuest(true);
  }

  if (!loggedin) {
    return (
      <div className="App">
        <Header curr_tab={curr_tab} setCurr_tab={setCurr_tab}></Header>
        <Body HandleSignup={HandleSignup} curr_tab={curr_tab} setCurr_tab={setCurr_tab} HandleLogin={HandleLogin}
          message={message} alert_type={alert_type} HandleGuest={HandleGuest}></Body>

      </div>
    );
  }

  else {
    if (admin) {
      return (
        <div className="App">
          <HeaderTask HandleLogoff={HandleLogoff}></HeaderTask>
          <BodyAdmin taskList={tasks} setTasks={setTasks} server_ip = {server_ip}></BodyAdmin>
        </div>
      );

    }
    else {
      return (
        <div className="App">
          <HeaderTask HandleLogoff={HandleLogoff}></HeaderTask>
          <BodyTask taskList={tasks} setTasks={setTasks}></BodyTask>
        </div>
      );
    }
  }
}

export default App;

