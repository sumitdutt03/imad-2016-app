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

    

var htmTemplate = `
 <html>
<head>
   
<title>${title}</title>
<link href="/ui/style.css" rel="stylesheet" />
<meta name="viewpoint" content="width-device-width,intialscale =1" />

</head>
<body>
    <div class ="container">
    <div><a href="/">home</a></div>
    <hr/>
    <div>
    <h2>${heading}</h2>
    </div>
    <div>
    ${date}
    </div>
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
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);


app.get('/test-db', function (req, res) {
    pool.query('SELECT * FROM test', function(err,result){
        if(err){
            res.status(500).send('something wrong');
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
    
});




var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
  res.send(counter.toString());
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
