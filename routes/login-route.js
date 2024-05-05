var express = require('express');

var router = express.Router();
var db=require('../database');
var app = express();
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login-form.ejs');
});

router.post('/login', function(req, res){
    var emailAddress = req.body.email_address;
    var password = req.body.password;

    var sql='SELECT * FROM registration WHERE email_address =? AND password =?';
    db.query(sql, [emailAddress, password], function (err, data, fields) {
        if(err) throw err
        if(data.length>0){
            req.session.loggedinUser= true;
            req.session.emailAddress= emailAddress;
            // alert("wait")
            // localStorage.setItem('userData', JSON.stringify(data[0]));
            // req.session.userData = data[0];
            console.log("User Data :", data[0]);
            // res.redirect('/userInfo');
            // res.redirect({ userData: data[0] },'userInfo');
            // res.render('userInfo', { userData: data[0] });
            // res.redirect('/blockchain');

            // var userData = {
            //     first_name: data[0].first_name,
            //     email_address: data[0].email_address
            // };
            // res.render('userInfo', { userData: userData });

            res.redirect(`/userInfo?first_name=${data[0].first_name}&dept=${data[0].department}`);
        
            

        }else{
            res.render('login-form.ejs',{alertMsg:"Your Email Address or password is wrong"});
        }
    })

})

module.exports = router;

