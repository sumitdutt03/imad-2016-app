var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'sumitdutt03',
    database :'sumitdutt03',
    host:'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //*
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));//*

var dutt = {
    title: 'DUTT',
    date:'sep-06-2016',
    heading: 'try',
    content:
    `
  <p> trying my self</p>
`};



function createTemplate(data){
var title = data.title;
var date = data.date;
var content = data.content;
var heading = data.heading;

    

var htmlTemplate = `
 <html>
<head>
   <style>
   body {  background-image: url(https://i.ytimg.com/vi/F3I0wRGAkxo/maxresdefault.jpg); } 
   #head{color:white;}
   #con{color:white;}
   #pa{float:right;}
   </style>
<title>${title}</title>
<link href="/ui/style.css" rel="stylesheet" />
<meta name="viewpoint" content="width-device-width,intialscale =1" />
</head>
<body>
    <div class ="container" id='con'>
    <div><a href="/" style="color:red" >home</a></div>
    <hr/>
    <div><a href="http://sumitdutt03.imad.hasura-app.io/article/two"><span style="color:red">Previous</span></a></div>
    <hr/>
    <div>
    <h2 id='head'>${heading}</h2>
    </div>
    <div>
    ${date.toDateString()}
    </div>
    <hr/>
    <div>
${content}
</div>
</div>

</body>
</html>
`;
return htmlTemplate;
}

app.get('/dutt', function (req, res) {
  res.send(createTemplate(dutt));
});

//testing for article 



//
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

//////////////// Article
app.get('/article/:articlename', function (req, res) {
    pool.query("SELECT * FROM article WHERE title = '"+req.params.articlename+"'", function(err,result){
        if(err){
            res.status(500).send('something wrong');
        }else{
            if(result.rows.length ===0){
            res.status(404).send('Article not found') ;
            }
            else{
                var articledata = result.rows[0];
                res.send(createTemplate(articledata));
                
            }
            
            
        }
    });
    
});




var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
  res.send(counter.toString());
});
///////////////////hash

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});



app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

////
app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
              // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});


app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});






///end hash


app.get('/server.js', function (req, res) {
  res.sendFile(path.join(__dirname,'server.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/sumit1', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'sumit1.html'));
});

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});