// Run on terminal with command node db.js
// Functioning code locally with phpmyadmin
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'neoshop'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

});

app.get('/customers', (req, res) => {
  const query = 'SELECT * FROM customer';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM customer WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful' });
    console.log(`Success login for ${email}`);
  });
});

app.get("/viewbyid/:id", (req,res)=>{
  const fetchid = req.params.id;
  connection.query('select * from customer where id=?', fetchid,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result);
      console.log(`Viewed for id ${fetchid}`)
    }
  })
});

app.put("/update/:id", (req,res)=>{
  const upid = req.params.id;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const phoneno = req.body.phoneno;
  const password = req.body.password;

  connection.query('UPDATE customer SET name=?, username=?, email=?, phoneno=?, password=? WHERE id=?',
  [name,username,email,phoneno,password,upid],(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send("UPDATED");
      console.log(`Updated for ${username}`);
    }
  })
});

app.delete('/delete/:id',(req,res)=>{
  const delid = req.params.id;
  connection.query('delete from customer where id=?',delid,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(`Deleted for id ${delid}`);
      console.log(result);
    }
  })
}); 

app.post("/add", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const phoneno = req.body.phoneno;
  const password = req.body.password;

  connection.query(
    'INSERT INTO customer (name, username, email, phoneno, password) VALUES (?, ?, ?, ?, ?)',
    [name, username, email, phoneno, password],
    (err, res) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred while adding data.");
      } else {
        res.send("Data added successfully.");
        console.log(`Added data for ${username}`);
      }
    }
  );
});

const PORT = process.env.PORT || 1004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
