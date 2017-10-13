var OrientDB = require('orientjs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.locals.pretty=true;
app.set('view engine','pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

var server = OrientDB({
  host: 'localhost',  //orient db가 설치된 ip주소를 입력합니다. 로컬이면 그대로 적용.
  port: 2424,           //orient db의 포트를 입력합니다. orient db의 디폴트 포트는 2424로 설정됩니다.
  username: 'root',  //데이터베이스 계정명을 입력합니다.
  password: 're5134kw'         //password를 입력합니다.
});
var db = server.use('webEX');  //데이터베이스명을 입력합니다.
console.log('Using database: ' + db.name);

app.get(['/topic','/topic/:id'],function(req,res){
  var sql='SELECT FROM topic';
  db.query(sql).then(function(topics){
    var id=req.params.id;
    if(id){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql,{params:{rid:id}}).then(function(topic){
        res.render('view',{topics:topics, topic:topic[0]});
      });
    }else{
      res.render('view',{topics:topics});
    }
    });
});

app.get('/topic/add', function(req,res){
  var sql='SELECT FROM topic';
  db.query(sql).then(function(topics){
    if(topics.length===0){
      console.log('There is no topic record.');
      res.status(500).send('Internal Server Error');
    }
    res.render('add',{topics:topics});
  });
});

app.post('/topic/add', function(req,res){
  var id = req.body.ID;
  var lastName = req.body.LastName;
  var sql='INSERT INTO topic(ID, LastName) VALUES(:id,:lastName)'
  db.query(sql,{
    params:{
      ID:id,
      LastName:lastName
    }
  }).then(function(results){
    res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
  });
});

app.get('/template', function(req,res){
  res.render('first', {time:Date(), title:'Jade'});
});

app.get('/', function(req,res){
  res.send('Hello home page');
});

app.get('/route', function(req,res){
  res.send('<h1>Route page</h1><br><img src="/dice.jpg">');
});

app.get('/form', function(req,res){
  res.render('form');
});

app.post('/form_receiver', function(req,res){
  res.send(req.body.title+','+req.body.description);
});

app.get('/topic1', function(req,res){  //http://localhost:3000/topic1?id=1&name=ggg
  res.send(req.query.id+','+req.query.name);
});

app.get('/topic2', function(req,res){
  var topics=[
    'Javascript is...',
    'Nodejs js',
    'Express is....'
  ];
  var output =`
  <a href="/topic2?id=0">JavaScript</a><br>
  <a href="/topic2?id=1">Nodejs</a><br>
  <a href="/topic2?id=2">Express</a><br>
  ${topics[req.query.id]}
  ` //1왼쪽에 있는 거 사용
  res.send(output);
});

app.get('/topic/:id/:mode', function(req,res){  //시멘틱URL - http://localhost:3000/topic/100/aaa
  res.send(req.params.id+','+req.params.mode)
});

app.listen(3000,function(){
  console.log('Connected 3000port!');
});



















/*
// 이런식으로도 할수있음
app.get('/dynamic', function(req,res){
  var lis = '';
  for(var i=0; i<5; i++)
    lis = lis+'<li>coding</li>';
    var time = Date();
    var output = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title></title>
      </head>
      <body>
          Hello, Dynamic!
          <ul>
            ${lis}
          </ul>
          ${time}
      </body>
    </html>`;
    res.send(output);
});

// select
var sql = 'select * from topic where @rid=:rid';
var param = {
  params:{
    rid:'#18:0'
  }
};
db.query(sql, param).then(function(results){
  console.log(results);
});

//insert
var sql = 'insert into topic(ID, LastName) values(:ID, :LastName)';
db.query(sql, {
  params:{
    ID: 2,
    LastName: 'Express is framework for web'
  }
}).then(function(results){
  console.log(results);
});
//insert
var sql = 'insert into topic(ID, LastName) values(:ID, :LastName)';
db.query(sql, {
  params:{
    ID: 3,
    LastName: '1234work for web'
  }
}).then(function(results){
  console.log(results);
});//insert
var sql = 'insert into topic(ID, LastName) values(:ID, :LastName)';
db.query(sql, {
  params:{
    ID: 4,
    LastName: '346 web'
  }
}).then(function(results){
  console.log(results);
});

//delete
var sql = 'delete from topic where ID=:ID';
db.query(sql, {
  params:{
    ID: 2
  }
}).then(function(results){
  console.log(results);
});

//update
var sql = 'update topic set ID=:ID where @rid=:rid';
db.query(sql, {
  params:{
    ID: 1,
    rid: '#18:0'
  }
}).then(function(results){
  console.log(results);
})
*/
