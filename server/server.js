const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
const cors = require('cors');

app.use(cors());  
app.use(express.json());

const mongoURI = "mongodb+srv://test:ljR36wHjImUdTaad@cluster0.flnm2su.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// login verification
app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    User.findOne({ username })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
          }


        res.json(user);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });


  // signup user post
  app.post('/users/signup', (req,res) => {
    const { username, password } = req.body;
    console.log(username);
    User.findOne({ username })
    .then(existingUser => {
      if (existingUser) {
        // Username already taken
        return res.status(401).json({ error: 'Username Taken' });
      }

      else {
        const newUser = new User({
          username: username,
          password: password,
          tasks: [
            { id: 'Task 1', content: 'Description 1', date: new Date().toISOString()},
            { id: 'Task 2', content: 'Description 2' , date: new Date().toISOString()},
            // Add more tasks as needed
          ]
        });
        newUser.save();
        return res.status(200).send('Signup Successful');
      }
    })
   
    .catch(error => {
      console.error('Error signing up user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    });
  });

  // task list update
  // 
  app.put('/users/:username/tasks', (req, res) => {
    const { username } = req.params;
    const { tasks } = req.body;
    console.log("START");
    User.findOneAndUpdate(
        { username: username }, // criteria to find the user
        { $set: { tasks: tasks } }, // Update operation
        { new: true } // Options: Return the updated document
      )
        .then(updatedUser => {
          if (updatedUser) {
            // User found and updated successfully
            console.log('User tasks updated:', updatedUser);
            console.log("Finish Update");
            res.status(200).send('Task list updated successfully');
          } else {
            // User not found
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
          }
        })
        .catch(error => {
          // Error occurred
          console.log('Error updating user tasks:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    
  });
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(3001, () => {
  console.log('Server started on port 3001');
});