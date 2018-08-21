var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logRouter = require('./routes/log/log');
var timeSliderRouter = require('./routes/timeSlider/timeSlider');
var electricalDiagram = require('./routes/electrical_diagram/electrical_diagram');
var electricalDiagramGis = require('./routes/electrical_diagram_gis/electrical_diagram_gis');
var systemListTable = require('./routes/table_route/SystemListDatatables');
var algorithm = require('./routes/algorithm/algorithm');
var session = require('express-session');

var _auth = require('./model/auth/auth');

var app = express();

var routes = require('./routes');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/toggle', express.static(__dirname + '/node_modules/bootstrap-toggle/css'));
app.use('/toggles', express.static(__dirname + '/node_modules/bootstrap-toggle/js'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//세션 설정
app.use(session({
    secret: 'softfactory', //쿠기를 임의로 변조하는 것을 방지하기 위한 암호 값
    resave: false, //세션을 언제나 저장할지 정하는 값 (false 권장)
    saveUninitialized: true //세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장 (?)
}));

//  로그인 및 회원가입 기능
/*const checkLogin = _auth.checkLogin;
app.use(checkLogin);*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/log', logRouter);
app.use('/slider', timeSliderRouter);
app.use('/electrical_diagram', electricalDiagram);
app.use('/electrical_diagram_gis', electricalDiagramGis);
app.use('/system', systemListTable);
app.use('/algorithm', algorithm);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
