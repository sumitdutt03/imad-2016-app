var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'sumitdutt03',
    database :'sumitdutt03',
    host:'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));

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
   </style>
<title>${title}</title>
<link href="/ui/style.css" rel="stylesheet" />
<meta name="viewpoint" content="width-device-width,intialscale =1" />

</head>
<body>
    <div class ="container" id='con'>
    <div><a href="/">home</a></div>
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
//hash

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
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
