"use strict";
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var asyncLoop = require('node-async-loop');

var mysql = require('mysql');
var connection = require('express-myconnection');
var apn = require("apn");
var apnProvider = new apn.Provider({
         cert: "./resources/fipush.pem",
         key: "./resources/fipush.pem",
         production: true

    });
var gcm = require('node-gcm');
//var sender = new gcm.Sender('AIzaSyCCKNgm9SgRuEnTlxvUVlXAuV8obSR1J4U');
var sender = new gcm.Sender('AIzaSyDdK4zYtqVGNHR1oLVn8H-HYdxTImnglyQ');
var defaultUrl = "http://52.66.124.74:3000/ImagesFiles/";
//const {initPayment, responsePayment,sucesspay} = require("../paytm/services/index");
const shortid= require('shortid');
const {initPayment, responsePayment} = require("../paytm/services/index");
var cryptLib = require('cryptlib'),
    iv = 'mindcrewnewapp17', //16 bytes = 128 bit 
    key = cryptLib.getHashSha256('newapp17mindcrew', 32), //32 bytes = 256 bits 
    encryptedText = cryptLib.encrypt('159753', key, iv);
//decryptedText = cryptLib.decrypt('AHIpkwOPQ1JGhmwQpX9+PA==', key, iv);
var twilio = require('twilio');
 var nodemailer = require("nodemailer");
 var smtpTransport = require("nodemailer-smtp-transport");

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 465,
    auth : {
        user : "walkifyapp@gmail.com",
        pass : "mindcrew01"
    }
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(encryptedText);

});

module.exports = router;

function middleware(req,res,next){
     var reqObj = req.body;
 //next();
     if(!reqObj.imei || reqObj.imei=="" || !req.headers.wakifykey || req.headers.wakifykey == ""){
         return res.json({"status":'false',"msg":'Something went wrong!4'});
     } else{
    req.getConnection(function(err, conn){  
     var queryChecktb_ids = conn.query("SELECT * FROM `tb_ids` where  tb_ids.imei =  '"+reqObj.imei+"'", function (err, resultChecktb_ids)
                             {
 
                             if(err){
                             res.json({"status":'false',"msg":'Something went wrong!3'});
                             }
 
                             if(resultChecktb_ids==''){
                                 res.json({"status":'false',"msg":'Invalid IMEI!'});
                             }
                             else{
                                 var key = cryptLib.getHashSha256('walkify9!8@7*', 32);
                                 var iv = "ivWalkify@1!2#3";
                                 var plain = cryptLib.decrypt(resultChecktb_ids[0].cypher, key, iv);
                                 var plainHeader = cryptLib.decrypt(req.headers.wakifykey, key, iv);
                                 if(plainHeader == plain){
                                     next();                                   
                                    }else{
                                         return res.json({
                                              status:"false",
                                              msg:"You are doing something wrong!6"
                                           })
                                     }
                             }
 
                         });
     });
 
  }
 
    
 }

router.post('/', function(req, res, next) {
  var reqObj = req.body;  
  var decryptedText = cryptLib.decrypt(reqObj.password, key, iv);  
  res.send(decryptedText);

});



router.post('/getWalletAmountPrevious',middleware, function(req,res,next){
        try{
        var reqObj = req.body;        
    req.getConnection(function(err, conn){  
             var query = conn.query("SELECT IFNULL(sum(amount),0) as amount from tb_wallet WHERE  tb_wallet.userid =  '"+reqObj.userid+"' AND tb_wallet.is_withdrawn_resuested_generated = 0", function (err, result){
            if(err){
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            else{

                    res.json({"status":'true',"msg":'Successful',"response":result[0]});        
             
            }
            });
            });

            }
        catch(ex){
        return next(ex);
        }
});

//27 Aug
router.post('/getWalletAmount', function(req,res,next){
  try{
        var reqObj = req.body;        
        req.getConnection(function(err, conn){  
             var query = conn.query("select amount from tb_challenge_wallet where userid='"+reqObj.userid+"' AND is_withdrawn_resuested_generated = 0", function (err, result){
            if(err){
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            
            else{
                if(result.length>0){
                    res.json({"status":'true',"msg":'Successful',"amount":(result[0].amount).toString()}); 
                }else{
                    res.json({"status":'true',"msg":'Successful',"amount":0});
                }     
             
            }
            });
            });

            }
        catch(ex){
        
        return next(ex);
        }

})


router.post('/updateLocationAfterLogin', function(req,res,next){
        try{
        var reqObj = req.body;        

        


        req.getConnection(function(err, conn){  

             var query = conn.query("update tb_users set lat='"+reqObj.lat+"', lng='"+reqObj.lng+"', address='"+reqObj.address+"' where id='"+reqObj.userid+"' ", function (err, result){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            
            else{


                    res.json({"status":'true',"msg":'Successful'});        
             
            }
            });
            });

            }
        catch(ex){
        
        return next(ex);
        }
});


router.post('/withdrawlAmount', middleware, function(req,res,next){
    try{
    var reqObj = req.body;        
    req.getConnection(function(err, conn){ 
    var query1 = conn.query("SELECT IFNULL(amount, 0) as amount FROM `tb_challenge_wallet` WHERE is_withdrawal=0 and is_withdrawn_resuested_generated=0 and userid='"+reqObj.userid+"'", function (err, result1){
        
        

        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!1'});
        }
        
        else{
                if(result1[0].amount >= 250){

                var query = conn.query("update tb_challenge_wallet set payment_by = '"+reqObj.payment_type+"', is_withdrawn_resuested_generated = 1, withdrawal_date = Now(), phone = '"+reqObj.phone+"', updated_at=NOW() WHERE  tb_challenge_wallet.userid =  '"+reqObj.userid+"' AND tb_challenge_wallet.is_withdrawal = 0 AND tb_challenge_wallet.is_withdrawn_resuested_generated = 0", function (err, result){
                    if(err){
                    res.json({"status":'false',"msg":'Something went wrong!2'});
                    }else{
                            res.json({"status":'true',"msg":'Withdrawl request generated'});        
                    
                    }
                });   
            }else{
                res.json({"status":'false',"msg":'Minimum withdrawal amount is Rs.250. Walk and Earn more.'});
            }  
         
        }
       
             
          }); 
        });

        }
    catch(ex){
    
    return next(ex);
    }
});


router.post('/withdrawlAmountNew', middleware, function(req,res,next){
    try{
    var reqObj = req.body;        
    req.getConnection(function(err, conn){ 
    var query1 = conn.query("SELECT IFNULL(amount, 0) as amount FROM `tb_challenge_wallet` WHERE is_withdrawal=0 and is_withdrawn_resuested_generated=0 and userid='"+reqObj.userid+"'", function (err, result1){
        
        

        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!1'});
        }
        
        else{
                if(result1[0].amount >= 250){

                var query = conn.query("update tb_challenge_wallet set payment_by = '"+reqObj.payment_type+"', is_withdrawn_resuested_generated = 1, withdrawal_date = Now(), phone = '"+reqObj.phone+"', updated_at=NOW() WHERE  tb_challenge_wallet.userid =  '"+reqObj.userid+"' AND tb_challenge_wallet.is_withdrawal = 0 AND tb_challenge_wallet.is_withdrawn_resuested_generated = 0", function (err, result){
                    if(err){
                    res.json({"status":'false',"msg":'Something went wrong!2'});
                    }else{
                            res.json({"status":'true',"msg":'Withdrawl request generated'});        
                    
                    }
                });   
            }else{
                res.json({"status":'false',"msg":'Minimum withdrawal amount is Rs.250. Walk and Earn more.'});
            }  
         
        }
       
             
          }); 
        });

        }
    catch(ex){
    
    return next(ex);
    }
});

// 

router.post('/authUser', middleware, function(req,res,next){
    
        try{
        var reqObj = req.body;        

        var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);


        req.getConnection(function(err, conn){  
             var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.password =  '"+encryptPasword+"'  AND tb_users.status =1", function (err, result){
           

            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'Wrong username or password'});
                
            }
            else{


                            var query = conn.query("Update tb_users set device_type =  '"+reqObj.device_type+"', device_token =  '"+reqObj.device_token+"', imei =  '"+reqObj.imei+"', is_loggedIn = 1  where id = '"+result[0].id+"'", function (err, resultUpdate){
                                if(err){
                                
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Unable to update Device Token.'});
                                    
                                }else{

                                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.password =  '"+encryptPasword+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    if(resultSelect==''){

                                                        res.json({"status":'false',"msg":'Something went wrong.'});
                                                        
                                                    }else{

                                                            var responseData = {};

                                                            responseData.id = resultSelect[0].id;
                                                            responseData.name = resultSelect[0].name;
                                                            responseData.email = resultSelect[0].email;
                                                            responseData.profileImg = resultSelect[0].profileImg;
                                                            responseData.dob = resultSelect[0].dob;
                                                            responseData.dobn = resultSelect[0].dobn;
                                                            responseData.gender = resultSelect[0].gender;
                                                            responseData.phone = resultSelect[0].phone;
                                                            responseData.is_loggedIn = resultSelect[0].is_loggedIn;
                                                            responseData.disease = resultSelect[0].disease;
                                                            responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                            responseData.weight_kg = resultSelect[0].weight_kg;
                                                            responseData.device_type = resultSelect[0].device_type;
                                                            responseData.referral_code = resultSelect[0].referral_code;
                                                            responseData.parent_id = resultSelect[0].parent_id;
                                                            responseData.organisation_id = resultSelect[0].organisation_id;
                                                            responseData.organisation_name = resultSelect[0].organisation_name;
                                                            responseData.organisation_code = resultSelect[0].organisation_code;
                                                            responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                                                       
                                                                
                                                            res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
                                                    }
                                                    });
                                    
                                }
                                });

             
            }
            });
            });

            }
        catch(ex){
        
        return next(ex);
        }
});

router.post('/googleAuth', function(req,res,next){
        try{
        var reqObj = req.body;        

        req.getConnection(function(err, conn){ 

            var parentID = 0;

                if(!reqObj.referral_code || reqObj.referral_code == ''){

                    parentID = 0;

                }
                else{
                        var queryCheckReferral = conn.query("SELECT * from tb_users WHERE  tb_users.referral_code =  '"+reqObj.referral_code+"'", function (err, resultCheckReferral)
                            {

                            if(err){
                            
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }

                            if(resultCheckReferral==''){

                                res.json({"status":'false',"msg":'Invalid referral code!'});
                            }
                            else{

                                parentID = resultCheckReferral[0].id;
                            }

                        });

                }
         
            var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.status =1", function (err, result){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

                var referral_code = cryptLib.encrypt(reqObj.email, key, iv);
                var query1 = conn.query("SELECT * from tb_users WHERE  tb_users.imei =  '"+reqObj.imei+"'  ", function (err, result1)
                {  

                if(result1.length > 0){
                    res.json({"status":'false',"msg":'Walkify do not allow multiple user registration from same phone!'});
                }
                var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token, referral_code, parent_id, is_loggedIn, disease, imei, isFbLogin) Values('"+reqObj.name+"','"+reqObj.email+"','','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+referral_code+"','"+parentID+"', 1, '', '"+reqObj.imei+"', 1)", function (err, resultUpdate){
                                if(err){
                                
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }                       
                                                        var insert_newtable = "insert into tb_newpoint(userid, points, bonus_point, outdoor_point, total_league_steps, total_league_point) Values('"+resultUpdate.insertId+"', 0, 0,0,0,0)"
                                                        conn.query(insert_newtable, (err, result)=>{
                                                           if(err){
                                                            
                                                           }
                                                        });
                                                        

                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Something went wrong.'});
                                    
                                }else{

                                              
                                                      
                                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.email =  '"+reqObj.email+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    

                                                            var responseData = {};
                                                             
                                                            responseData.id = resultSelect[0].id;
                                                            responseData.name = resultSelect[0].name;
                                                            responseData.email = resultSelect[0].email;
                                                            responseData.profileImg = resultSelect[0].profileImg;
                                                            if(resultSelect[0].dob == '0000-00-00'){
                                                                responseData.dob = '';
                                                            responseData.dobn = '';
                                                            }else{
                                                                responseData.dob = resultSelect[0].dob;
                                                            responseData.dobn = resultSelect[0].dobn;
                                                            }
                                                            responseData.gender = resultSelect[0].gender;
                                                            responseData.phone = resultSelect[0].phone;
                                                            responseData.is_loggedIn = resultSelect[0].is_loggedIn;
                                                            responseData.disease = resultSelect[0].disease;
                                                            responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                            responseData.weight_kg = resultSelect[0].weight_kg;
                                                            responseData.device_type = resultSelect[0].device_type;
                                                            responseData.referral_code = resultSelect[0].referral_code;
                                                            responseData.parent_id = resultSelect[0].parent_id;
                                                            responseData.organisation_id = resultSelect[0].organisation_id;
                                                            responseData.organisation_name = resultSelect[0].organisation_name;
                                                            responseData.organisation_code = resultSelect[0].organisation_code;
                                                            responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                            
                                                                responseData.endtime=  "";
                                                            

                                                            
                                                            
                                                            res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
                                                });
                                    
                                }
                                });

                        });
                
            }
            else{

                         if(result[0].bannuseres == 0){
                            var query = conn.query("Update tb_users set device_type =  '"+reqObj.device_type+"', device_token =  '"+reqObj.device_token+"', imei =  '"+reqObj.imei+"', is_loggedIn = 1  where id = '"+result[0].id+"'", function (err, resultUpdate){
                                if(err){
                                
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Unable to update Device Token.'});
                                    
                                }else{
                                            
                                        conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+result[0].id+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    

                                                            var responseData = {};

                                                            responseData.id = resultSelect[0].id;
                                                            responseData.name = resultSelect[0].name;
                                                            responseData.email = resultSelect[0].email;
                                                            responseData.profileImg = resultSelect[0].profileImg;
                                                            if(resultSelect[0].dob == '0000-00-00'){
                                                                responseData.dob = '';
                                                            responseData.dobn = '';
                                                            }else{
                                                                responseData.dob = resultSelect[0].dob;
                                                            responseData.dobn = resultSelect[0].dobn;
                                                            }
                                                            responseData.gender = resultSelect[0].gender;
                                                            responseData.phone = resultSelect[0].phone;
                                                            responseData.is_loggedIn = resultSelect[0].is_loggedIn;
                                                            responseData.disease = resultSelect[0].disease;
                                                            responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                            responseData.weight_kg = resultSelect[0].weight_kg;
                                                            responseData.device_type = resultSelect[0].device_type;
                                                            responseData.referral_code = resultSelect[0].referral_code;
                                                            responseData.parent_id = resultSelect[0].parent_id;
                                                            responseData.organisation_id = resultSelect[0].organisation_id;
                                                            responseData.organisation_name = resultSelect[0].organisation_name;
                                                            responseData.organisation_code = resultSelect[0].organisation_code;
                                                            responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                            
                                                                responseData.endtime = ""
                                                            
                                                                                       
                                                                
                                                            res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
                                                    
                                                });
                                    
                                }
                                });
                         }
                         else{
                            res.json({"status":'false',"msg":'You have Ban walkify please Contact Walkify Support', "Walkfy Support": "9179237479"});
                         }
            }
            });
            });

            }
        catch(ex){
        
        return next(ex);
        }
});

// Api to add user
router.post('/addUser', middleware, function(req,res,next){

try{
var reqObj = req.body;

req.getConnection(function(err, conn){
    
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

    var parentID = 0;

    if(!reqObj.referral_code || reqObj.referral_code == ''){

        parentID = 0;

    }
    else{
            var queryCheckReferral = conn.query("SELECT * from tb_users WHERE  tb_users.referral_code =  '"+reqObj.referral_code+"'", function (err, resultCheckReferral)
                {

                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }

                if(resultCheckReferral==''){

                    res.json({"status":'false',"msg":'Invalid referral code!'});
                }
                else{

                    parentID = resultCheckReferral[0].id;
                }

            });

    }
    
                    //var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"' or tb_users.phone =  '"+reqObj.phone+"'", function (err, result)
                var query1 = conn.query("SELECT * from tb_users WHERE  tb_users.imei =  '"+reqObj.imei+"'  ", function (err, result1)
                        {  

                        if(result1.length > 0){
                            res.json({"status":'false',"msg":'Walkify do not allow multiple user registration from same phone!'});
                        } 
                   var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"'  ", function (err, result)
                        {

                        if(err){
                        
                        res.json({"status":'false',"msg":'Something went wrong!'});
                        }

                        if(result==''){
                            //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
                            var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);
                            var referral_code = cryptLib.encrypt(reqObj.email, key, iv);
                            
                            var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token, referral_code, parent_id, is_loggedIn, disease, imei) Values('"+reqObj.name+"','"+reqObj.email+"','"+encryptPasword+"','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+referral_code+"','"+parentID+"', 1, '', '"+reqObj.imei+"')", function (err, resultdata){
                            if(err){
                            
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }

                            var query = conn.query("SELECT id,name,email, profileImg, dob, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, gender, phone,height_fit_inc, weight_kg, device_type, referral_code, disease, organisation_id, parent_id, is_loggedIn from tb_users WHERE  tb_users.id =  '"+resultdata.insertId+"'", function (err, resultresponse)
                                    {

                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                    var responseData = {};

                                    responseData.id = resultresponse[0].id;
                                    responseData.name = resultresponse[0].name;
                                    responseData.email = resultresponse[0].email;
                                    responseData.profileImg = resultresponse[0].profileImg;
                                    if(resultresponse[0].dob == '0000-00-00'){
                                        responseData.dob = '';
                                    responseData.dobn = '';
                                    }else{
                                        responseData.dob = resultresponse[0].dob;
                                    responseData.dobn = resultresponse[0].dobn;
                                    }
                                    responseData.gender = resultresponse[0].gender;
                                    responseData.phone = resultresponse[0].phone;
                                    responseData.disease = resultresponse[0].disease;
                                    responseData.height_fit_inc = resultresponse[0].height_fit_inc;
                                    responseData.weight_kg = resultresponse[0].weight_kg;
                                    responseData.device_type = resultresponse[0].device_type;
                                    responseData.referral_code = resultresponse[0].referral_code;
                                    responseData.parent_id = resultresponse[0].parent_id;
                                    responseData.is_loggedIn = resultresponse[0].is_loggedIn;
                                    responseData.organisation_id = resultresponse[0].organisation_id;

                                    res.json({"status":'true',"msg":'SignUp is Successful!',"response":responseData});

                                })

                            
                            

                            });
                        }
                        else{
                            res.json({"status":'false',"msg":'Email already registered!'});   
                        }

                            
                        });
                            
                    });

                    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});

//september 15
router.post('/AddOutDoorWalkOneSix', function(req,res,next) {

    try{
var reqObj = req.body;
req.getConnection(function(err, conn){
    
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

    if(!reqObj.userid || reqObj.userid == "" || !reqObj.distance || reqObj.distance == "" || !reqObj.distance_unit || reqObj.distance_unit == "" || !reqObj.calorie_unit || reqObj.calorie_unit == "" || !reqObj.date || reqObj.date == "" || !reqObj.walk_time || reqObj.walk_time == "" || !reqObj.calories || reqObj.calories == "" )
        {

            res.json({"status":'false',"msg":'Please fill all the fields!'});
        }
        else{

                    function checkReferalPoints(deviceData) {
                        
                        return new Promise(function(resolve,reject) {
                            var distance = parseFloat(reqObj.distance);
                            var parent_id = parseFloat(reqObj.parent_id);

                                if(distance >= 5 && parent_id > 0){
                                    
                                    var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                           
                                        if(resultCheckReferalPoints == ""){
                                                var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.parent_id+"','"+deviceData.parent_organisation_id+"', 1000, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                if(err){
                                                
                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                }   
                                                    // where user check user participate
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.parent_id+"'",(err, result_userid)=>{
                                                        if(result_userid.length > 0){

                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.parent_id+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                }
                                                            })  
                                                        }
                                                        else{
                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.parent_id+"',0, 1000, 0, 0, 1000 )"
                                                            conn.query(insertpoint, (err, result)=>{
                                                                if(err){
                                                                
                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                }
                                                            })     
                                                        }

                                                    });
                                                        // end where user check user participate
                                                       //update point end
                                              //  custom by MCT insert point in new table end


                                                        if(deviceData.parent_device_type == "iOS"){
                                                                             let deviceToken = deviceData.parent_device_token;
                                                                             
                                                                             // Prepare the notifications
                                                                             let notification = new apn.Notification();
                                                                             notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                             notification.badge = 0;
                                                                             notification.sound = "default";
                                                                             notification.alert = "You have earned 1000 referral points.";
                                                                             notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
                                                                             // Replace this with your app bundle ID:
                                                                             notification.topic = "Com.MindCrew.FitIndia";
                                                                             
                                                                             // Send the actual notification
                                                                             apnProvider.send(notification, deviceToken).then( result => {
                                                                                // Show the result of the send operation:
                                                                             });
                                                                             // Close the server
                                                                             apnProvider.shutdown();
                                                                        }else if(deviceData.parent_device_type == "Android"){

                                                                            // Prepare a message to be sent
                                                                            var message = new gcm.Message({

                                                                                data: { key:  "You have earned 1000 referral points"},

                                                                                    notification: {
                                                                                        title: "Walkify",
                                                                                        icon: "ic_launcher",
                                                                                        body: "You have earned 1000 referral points"
                                                                                    }
                                                                            });
                                                                            message.addData({
                                                                                            message: "You have earned 1000 referral points"
                                                                                        });
                                                                            // Specify which registration IDs to deliver the message to
                                                                            var regTokens = [deviceData.parent_device_token];
                                                                             
                                                                            // Actually send the message
                                                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                            });



                                                                        }
                                                                        //resolve(true);
                                                

                                                });


                                                var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 1000, 3, '"+reqObj.parent_id+"')", function (err, resultInsertInvitePoints){
                                                if(err){
                                                
                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                              //  custom by MCT  insert point in new table start
                                                       //update point start
                                                       var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.userid+"'"
                                                       conn.query(update_point, (err, result)=>{
                                                           if(err){
                                                           res.json({"status":'false',"msg":'Something went wrong!'});
                                                           }
                                                       })
                                                       
                                                       

                                                       //update point end
                                              //  custom by MCT insert point in new table end
                                                    if(deviceData.device_type == "iOS"){
                                                                             let deviceToken = deviceData.device_token;
                                                                             
                                                                             // Prepare the notifications
                                                                             let notification = new apn.Notification();
                                                                             notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                             notification.badge = 0;
                                                                             notification.sound = "default";
                                                                             notification.alert = "You have earned 1000 referral bonus points.";
                                                                             notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
                                                                             // Replace this with your app bundle ID:
                                                                             notification.topic = "Com.MindCrew.FitIndia";
                                                                             
                                                                             // Send the actual notification
                                                                             setTimeout(function () {
                                                                                    apnProvider.send(notification, deviceToken).then( result => {
                                                                                            // Show the result of the send operation:
                                                                                            
                                                                                            
                                                                                         });
                                                                                         // Close the server
                                                                                         apnProvider.shutdown();
                                                                                }, 2000);    

                                                                             
                                                                        }else if(deviceData.device_type == "Android"){

                                                                            
                                                                            

                                                                            // Prepare a message to be sent
                                                                            var message = new gcm.Message({

                                                                                data: { key:  "You have earned 1000 referral bonus points"},

                                                                                    notification: {
                                                                                        title: "Walkify",
                                                                                        icon: "ic_launcher",
                                                                                        body: "You have earned 1000 referral bonus points."
                                                                                    }
                                                                            });
                                                                            message.addData({
                                                                                            message: "You have earned 1000 referral bonus points"
                                                                                        });
                                                                            // Specify which registration IDs to deliver the message to
                                                                            var regTokens = [deviceData.device_token];
                                                                             
                                                                            // Actually send the message

                                                                            setTimeout(function () {
                                                                                

                                                                                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                       
                                                                                    });


                                                                            }, 2000); 

                                                                            



                                                                        }
                                                                        resolve(true);


                                                });
                                                

                                                resolve(true);

                                        }else{

                                            

                                            resolve(true);
                                        }


                                    });

                                


                                }
                                else{
                                    resolve(true);
                                }

                        });
                    }


                   //new updated 1.51
                    function addWalking(deviceData) {
                        
                        return new Promise(function(resolve,reject) {
                            
                            // date24 june
                            
                            var hms =  reqObj.walk_time;   // your input string
                            var a = hms.split(':'); // split it at the colons
                            // minutes are worth 60 seconds. Hours are worth 60 minutes.
                            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

                            if(seconds >=60){
                                var updatetime= Math.round(seconds/60);
                                var newupdatetime= parseInt(updatetime);
                            }else{
                                var updatetime= 1;
                                var newupdatetime= 1;
                            }
                           
                            var updatepointval;
                            var uupoint; //insert point table
                            var walkpoint = Math.round(reqObj.walk_points);
                            var userdistence= Math.round(reqObj.distance);
                            var utime = Math.round(newupdatetime);
                            var actwlak = (utime*200) //multip 200 1M = 200Meter
                            // compare actuall distence = user distence
                                if(userdistence >= actwlak){
                                    updatepointval = Math.round(actwlak)
                                    if(walkpoint > updatepointval){
                                        uupoint = parseInt(updatepointval)
                                    }
                                    else{
                                        uupoint = parseInt(walkpoint)
                                     }
                                }
                                else if(actwlak > userdistence){
                                    updatepointval = Math.round(userdistence)
                                    if(walkpoint > updatepointval){
                                        uupoint = parseInt(updatepointval)
                                    }
                                    else{
                                        uupoint = parseInt(walkpoint)
                                    }
                                }
                           
                             

                              

                             conn.query("SELECT imei FROM `tb_users` WHERE id= '"+reqObj.userid+"'", function(err, resultimel){
                               if(resultimel[0].imei == reqObj.imei){
                                   
                              
                            conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                if(result_userid.length>0){
                                    var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+uupoint+", total_league_steps = total_league_steps+'"+0+"', total_league_point = total_league_point+'"+uupoint+"' WHERE userid = '"+reqObj.userid+"'"
                                    conn.query(update_point, (err, result)=>{
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                    })
                                    //update point end
                           //  custom by MCT insert point in new table end


                //  custom by MCT  insert point in new table start
                                    //update point start 
                                    var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+uupoint+"', 1, NOW(), 'Walking point', 'walkingpoint', 'WalkingPoint' )"
                                    conn.query(update_point, (err, result)=>{
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                    })      
                                }
                                else {


                                    var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+uupoint+"', 0, 0, '"+uupoint+"', '"+uupoint+"' )"
                                    conn.query(insertpoint, (err, result)=>{
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!insert'});
                                        }
                                    })
                                    var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+uupoint+"', 1, NOW(), 'Walking point', 'walkingpoint', 'WalkingPoint' )"
                                    conn.query(update_point, (err, result)=>{
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                    }) 
                                }

                            });
                            var query = conn.query("insert into tb_walking_history(userid, distance, date, walk_time, calories, distance_unit, calorie_unit, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"','"+reqObj.distance+"', NOW(), '"+reqObj.walk_time+"','"+reqObj.calories+"','"+reqObj.distance_unit+"','"+reqObj.calorie_unit+"','"+reqObj.from_lat+"','"+reqObj.from_lng+"','"+reqObj.to_lat+"','"+reqObj.to_lng+"')", function (err, resultdata){
                                if(err){
                                
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                var queryAddPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', '"+uupoint+"', 0)", function (err, resultAddPoints){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                });


                                  //  custom                     
                                                       //update point end
                                              //  custom by MCT insert point in new table end
                                    var distance = parseFloat(reqObj.distance);
                                    if(distance >1){

                                        var calculatedPointIndex = parseInt(distance);
                                        if(calculatedPointIndex > 0){
                                            var calculatedPoint = calculatedPointIndex * 10;

                                            if(deviceData.device_type == "iOS"){
                                                if(uupoint>0){
                                                             let deviceToken = deviceData.device_token;
                                                             
                                                             // Prepare the notifications
                                                             let notification = new apn.Notification();
                                                             notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                             notification.badge = 2;
                                                             notification.sound = "default";
                                                             notification.alert = "You got "+uupoint+ " points";
                                                             notification.payload = {'messageFrom': 'FitIndia'};
                                                             
                                                             // Replace this with your app bundle ID:
                                                             notification.topic = "Com.MindCrew.FitIndia";
                                                             
                                                             // Send the actual notification
                                                             apnProvider.send(notification, deviceToken).then( result => {
                                                                // Show the result of the send operation:
                                                                
                                                                
                                                             });
                                                             // Close the server
                                                             apnProvider.shutdown();
                                                            }
                                                        }else if(deviceData.device_type == "Android"){
                                                            if(uupoint>0){
                                                            
                                                            

                                                            // Prepare a message to be sent
                                                            var message = new gcm.Message({

                                                                data: { key:  "You got "+uupoint+ " points"},

                                                                    notification: {
                                                                        title: "Walkify",
                                                                        icon: "ic_launcher",
                                                                        body: "You got "+uupoint+ " points"
                                                                    }
                                                            });
                                                            message.addData({
                                                                            message: "You got "+uupoint+ " points"
                                                                        });
                                                            // Specify which registration IDs to deliver the message to
                                                            var regTokens = [deviceData.device_token];
                                                             
                                                            // Actually send the message
                                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                               
                                                            });

                                                        }

                                                        }
                                                        resolve(uupoint);                                       
                                     }
                                     resolve(uupoint); 
                                 }
                                 resolve(uupoint); 

                                });
                            }
                            else{
                                res.json({"status": "flase", "msg": "IMEI not valid"})
                            }
                        }); 
                        });
                    }

                    //apke hisaab se comment krna hai
                   function challengwalking1(){
                    return new Promise(function(resolve,reject) {
                         resolve(true)
                    })
                }
                   //end new updated 1.51
                   function challengwalking(){


                    return new Promise(function(resolve,reject) {

                        var hms =  reqObj.walk_time;   // your input string
                        var a = hms.split(':'); // split it at the colons
                        // minutes are worth 60 seconds. Hours are worth 60 minutes.
                        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

                        if(seconds >=60){
                            var updatetime= Math.round(seconds/60);
                            var newupdatetime= parseInt(updatetime);
                        }else{
                            var updatetime= 1;
                            var newupdatetime= 1;
                        }
                       
                        var updatepointval;
                        var uupoint; //insert point table
                        var walkpoint = Math.round(reqObj.walk_points);
                        var userdistence= Math.round(reqObj.distance);
                        var utime = Math.round(newupdatetime);
                        var actwlak = (utime*100) //multip 200 1M = 200Meter
                        // compare actuall distence = user distence
                            if(userdistence >= actwlak){
                                updatepointval = Math.round(actwlak)
                                if(walkpoint > updatepointval){
                                    uupoint = parseInt(updatepointval)
                                }
                                else{
                                    uupoint = parseInt(walkpoint)
                                 }
                            }
                            else if(actwlak > userdistence){
                                updatepointval = Math.round(userdistence)
                                if(walkpoint > updatepointval){
                                    uupoint = parseInt(updatepointval)
                                }
                                else{
                                    uupoint = parseInt(walkpoint)
                                }
                            }
                       
                        conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                            if(err){
                                res.json({"status":"false","msg":"SOmething went wrong12!"});
    
                            }else{
                                //challenages start if
                                if(challengeresult.length>0){
                                    
                                    conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                        if(err){
                                            res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                        }else{
                                            if(chlngpointresult.length>0){  
                                                conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"','"+uupoint+"',1, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                    if(err){    
                                                        res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                    }
                                                    conn.query("UPDATE tb_challengepoints SET outdoor_points= outdoor_points+'"+uupoint+"',total_challenge_points = total_challenge_points+'"+uupoint+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                        if(err){
                                                            
                                                            res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                        }
                                                    resolve(true);
                                                });// end of updatesteppoints query
                                                });// end of insertstepchlgpoints query
                                         }
                                         else{
                                           conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"', '"+uupoint+"',1, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                               if(err){    
                                                   res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                               }
                                               conn.query("insert into tb_challengepoints (userid, challenge_id, step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"',0,0,'"+uupoint+"','"+uupoint+"',NOW())",function(err,inserted){
                                                   if(err){
                                                       
                                                       res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                   }
                                                  resolve(true);
                                                   
                                               });// end of inserted query
                                             });// end of insertstepchlgpoints query
                                           } // else if no data found 
                                        }
    
                                        });
                                }
                                else{
                                    resolve(true)
                                }
                                //challenages end if
                            }
                        }); 
                        //close challenges   
                    
                    });
                    //return promise
                   }      
                    function getPointsGlobal() {
                        
                        return new Promise(function(resolve,reject) {
                            //SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'
                            //
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints, (SELECT IFNULL(sum(points), 0) FROM `tb_bonuspoint` WHERE point_type = 1 and userid = '"+reqObj.userid+"') as outdoorpoint FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid= '"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsGlobal == ""){
                                            resolve(resultPointsGlobal);

                                        }else{

                                            

                                            resolve(resultPointsGlobal[0]);
                                        }


                                    });


                        });
                    }


                    function getPointsByOrg() {
                        
                        return new Promise(function(resolve,reject) {
                                    
                                if(reqObj.organisation_id > 0){
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsByOrg == ""){

                                            
                                            resolve(resultPointsByOrg);

                                        }else{

                                            

                                            resolve(resultPointsByOrg[0]);
                                        }


                                    });
                                }
                                else{
                                    var resultPointsByOrg = [];
                                    resolve(resultPointsByOrg);
                                }


                        });
                    }

                    function getDeviceInfo() {
                        
                        return new Promise(function(resolve,reject) {
                                    
                                
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultDeviceInfo == ""){

                                            
                                            resolve(resultDeviceInfo);

                                        }else{

                                            

                                            resolve(resultDeviceInfo[0]);
                                        }


                                    });
                                


                        });
                    }
                    
                    function getBonuscard(walkPoint) {
                        return new Promise(function(resolve,reject) {
                            var snumber = (Math.floor(Math.random() * (10 - 1 + 1) + 1))*10;
                                if(walkPoint>=500){
                                    conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES ('"+reqObj.userid+"', '"+snumber+"', 14, NOW(), 'outdoorbonus', '"+snumber+"', 'outdoorbonus')", function (err, resultDeviceInfo){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    
                                    }
                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+snumber+"', 14, 0, 1, NOW(), 1 )", function (err, resultPoint){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        
                                        }
                                        
                                        conn.query("UPDATE tb_newpoint SET bonus_point = bonus_point+"+snumber+", total_league_point= total_league_point+"+snumber+"  WHERE userid = '"+reqObj.userid+"'", function (err, resultNewpoint){
                                            if(err){
                                            
                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                            
                                            }
                                              //challenges start
                                    conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                                        if(err){
                                            
                                            res.json({"status":"false","msg":"SOmething went wrong12!"});
                
                                        }else{
                                            //challenages start if
                                            if(challengeresult.length>0){
                                                
                                                conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                                    if(err){
                                                        res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                                    }else{
                                                        if(chlngpointresult.length>0){  
                                                            conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"','"+snumber+"',14, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                if(err){    
                                                                    res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                                }
                                                                conn.query("UPDATE tb_challengepoints SET bonus_points= bonus_points+'"+snumber+"',total_challenge_points = total_challenge_points+'"+snumber+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                                    if(err){
                                                                        
                                                                        res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                                    }
                                                                resolve(snumber);
                                                            });// end of updatesteppoints query
                                                            });// end of insertstepchlgpoints query
                                                     }
                                                     else{
                                                       conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"', '"+snumber+"',14, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                           if(err){    
                                                               res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                                           }
                                                           conn.query("insert into tb_challengepoints (userid, challenge_id, step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"',0,0,'"+snumber+"','"+snumber+"',NOW())",function(err,inserted){
                                                               if(err){
                                                                   
                                                                   res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                               }
                                                              resolve(snumber);
                                                               
                                                           });// end of inserted query
                                                         });// end of insertstepchlgpoints query
                                                       } // else if no data found 
                                                    }
                
                                                    });
                                            }
                                            else{
                                                resolve(snumber)
                                            }
                                            //challenages end if
                                        }
                                    });
                                    //challenges end
                                                
        
        
                                            });                                       
     
                                        });
                                        

                                    });
                                    
                                }
                                else{
                                    resolve(snumber)
                                }
                               


                        });
                    }
                    

                         getDeviceInfo().then(function(data) {
                                        var deviceData = data;       
                                checkReferalPoints(deviceData).then(function(data) {
                                    
                                    if(data== true){
                            
                           
                                        addWalking(deviceData).then(function(data) {
                                                
                                                var walkingpoint1 = data;                                                
                                                if(data){
                                                    challengwalking().then(function(data){
                                                        var challenagesdata = data

                                                    if(data==true){
                                                    getBonuscard(walkingpoint1).then(function(data) {
                                                            var bonus_point =  data;
                                                
                                                      getPointsGlobal().then(function(data) {
                                                    var globalPoints = data;
                                                    if(data){

                                                        getPointsByOrg(globalPoints).then(function(data) {
                                                                    var pointsInOrganisation = data;
                                                                    var jsonObj = {};
                                                                    if(globalPoints.userid == null){

                                                                        jsonObj.userid = reqObj.userid
                                                                        jsonObj.globalPoints = 0
                                                                        jsonObj.pointsInOrganisation = 0
                                                                       jsonObj.rewardPoint = 0
                                                                       jsonObj.reward = "false"
                                                                    }else{
                                                                        jsonObj.userid = globalPoints.userid
                                                                        // jsonObj.name = globalPoints.name
                                                                        // jsonObj.email = globalPoints.email
                                                                        // jsonObj.profileImg = globalPoints.profileImg
                                                                        jsonObj.globalPoints = globalPoints.globalPoints
                                                                        jsonObj.outdoorpoint = globalPoints.outdoorpoint
                                                                        jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
                                                                         if(walkingpoint1 >=500){
                                                                        jsonObj.rewardPoint = bonus_point;
                                                                        jsonObj.reward = "true"
                                                                         }
                                                                         else{
                                                                            jsonObj.rewardPoint = bonus_point;
                                                                            jsonObj.reward = "false"
                                                                         }
                                                                    }
                                                                   
                                                                    res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
                                                                });
                                                        }
                                                      });
                                                });
                                            }
                                            });
                                                }
                                                else{
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                                //next();
                                            });


                                        }
                                    //next();
                                });


                            });

                        

                }
}
});
}
catch(ex){

return next(ex);
}
});



router.post('/getWalking', middleware, function(req,res,next){
    
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT *, DATE_FORMAT(date, '%d-%m-%Y %H:%i:%s') as daten, DATE_FORMAT(date, '%d-%m-%Y %r') as dater from tb_walking_history WHERE  tb_walking_history.userid =  '"+reqObj.userid+"' order by tb_walking_history.id desc limit 100", function (err, result){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'No record found'});
                
            }else{


                    
                res.json({"status":'true',"msg":'Successful',"response":result});
            }
            });
            });

}
catch(ex){

return next(ex);
}
});



//get organisations list

router.get('/getOrganisations', function(req,res,next){
    
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT * from tb_organisations WHERE tb_organisations.isdeleted =  0 and tb_organisations.id != 0", function (err, result){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'No record found'});
                
            }else{


                    
                res.json({"status":'true',"msg":'Successful',"response":result});
            }
            });
            });

}
catch(ex){

return next(ex);
}
});



//joinOrganisation

router.post('/joinOrganisation', middleware, function(req,res,next){
    
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
            var query = conn.query("Update tb_users set tb_users.organisation_id =  '"+reqObj.organisation_id+"' where tb_users.id= '"+reqObj.userid+"'", function (err, result){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'No record found'});
                
            }else{


                
                var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    if(resultSelect==''){

                                                        res.json({"status":'false',"msg":'Something went wrong.'});
                                                        
                                                    }else{

                                                            var responseData = {};

                                                            responseData.id = resultSelect[0].id;
                                                            responseData.name = resultSelect[0].name;
                                                            responseData.email = resultSelect[0].email;
                                                            responseData.profileImg = resultSelect[0].profileImg;
                                                            responseData.dob = resultSelect[0].dob;
                                                            responseData.dobn = resultSelect[0].dobn;
                                                            responseData.gender = resultSelect[0].gender;
                                                            responseData.phone = resultSelect[0].phone;
                                                            responseData.disease = resultSelect[0].disease;
                                                            responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                            responseData.weight_kg = resultSelect[0].weight_kg;
                                                            responseData.device_type = resultSelect[0].device_type;
                                                            responseData.referral_code = resultSelect[0].referral_code;
                                                            responseData.parent_id = resultSelect[0].parent_id;
                                                            responseData.organisation_id = resultSelect[0].organisation_id;
                                                            responseData.organisation_name = resultSelect[0].organisation_name;
                                                            responseData.organisation_code = resultSelect[0].organisation_code;
                                                            responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                                                       
                                                                
                                                            res.json({"status":'true',"msg":'Successful',"response":responseData});
                                                     
                                                    }
                                                    });

                
            }
            });
            });

}
catch(ex){

return next(ex);
}
});

router.post('/ProfileUpdateFivethree', middleware, function(req,res,next){
    //res.json({"status":'false',"msg":'somthing went wrong'});
    
    try{
    var reqObj = req.body;        
    
    
            req.getConnection(function(err, conn){
    
                res.json({"status":"false", "msg": "not able to update name"})
    
            //     var updateString = "";
            //     var msg = "Successful";
    
            //     function checkPhoneNumber() {
                
    
            //         return new Promise(function(resolve,reject) {
            //         if(reqObj.phone && reqObj.phone!=""){
    
    
            //         if(updateString == ""){
                        
    
            //             var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
            //                 {
            //                 if(err){
            //                 
            //                 res.json({"status":'false',"msg":'Something went wrong!'});
            //                 }
            //                     if(resultCheckPhone == ""){
    
            //                     updateString = "phone='"+reqObj.phone+"'";
    
            //                     msg = "Successful";
            //                     resolve(true);
    
    
            //                 }
            //                 else{
            //                     msg = "Phone is already registered!";
            //                     resolve(true);
            //                 }
            //             });
                        
            //         }
            //         else{
    
            //             var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
            //                 {
            //                 if(err){
            //                 
            //                 res.json({"status":'false',"msg":'Something went wrong!'});
            //                 }
    
            //                     if(resultCheckPhone == ""){
    
            //                     updateString = updateString+",phone='"+reqObj.phone+"'";
    
            //                     msg = "Successful";
            //                     resolve(true);
    
            //                 }
            //                 else{
            //                     msg = "Phone is already registered!";
            //                     resolve(true);
            //                 }
            //             });
            //         }
                    
            //     }
            //     else{
            //       resolve(true);
            //     }
            // });
            //     };
    
    
    
            //     function updateAllProfileData() {
    
    
            //         return new Promise(function(resolve,reject) {
    
            //           
                      
            //         if(reqObj.name){
            //         if(updateString == ""){
            //             updateString = "name='"+reqObj.name+"'";
            //         }
            //         else{
            //             updateString = updateString+",name='"+reqObj.name+"'";
            //         }
                    
            //     }
            //     if(reqObj.dob){
            //         if(updateString == ""){
            //             updateString = "dob='"+reqObj.dob+"'";
            //         }
            //         else{
            //             updateString = updateString+",dob='"+reqObj.dob+"'";
            //         }
                    
            //     }
    
            //     if(reqObj.gender){
            //         if(updateString == ""){
            //             updateString = "gender='"+reqObj.gender+"'";
            //         }
            //         else{
            //             updateString = updateString+",gender='"+reqObj.gender+"'";
            //         }
                    
            //     }
    
            //     if(reqObj.height_fit_inc){
            //         if(updateString == ""){
            //             updateString = "height_fit_inc='"+reqObj.height_fit_inc+"'";
            //         }
            //         else{
            //             updateString = updateString+",height_fit_inc='"+reqObj.height_fit_inc+"'";
            //         }
                    
            //     }
    
            //     if(reqObj.weight_kg){
            //         if(updateString == ""){
            //             updateString = "weight_kg='"+reqObj.weight_kg+"'";
            //         }
            //         else{
            //             updateString = updateString+",weight_kg='"+reqObj.weight_kg+"'";
            //         }
                    
            //     }
    
            //     if(reqObj.disease){
            //         if(updateString == ""){
            //             updateString = "disease='"+reqObj.disease+"'";
            //         }
            //         else{
            //             updateString = updateString+",disease='"+reqObj.disease+"'";
            //         }
                    
            //     }
    
            //     if(reqObj.disease == ""){
            //         if(updateString == ""){
            //             updateString = "disease=''";
            //         }
            //         else{
            //             updateString = updateString+",disease=''";
            //         }
                    
            //     }
    
            //     if(reqObj.profileImg && reqObj.profileImg!=""){
    
            //         var imagesFile = new Buffer(reqObj.profileImg, 'base64');
            //         var timestamp  =  Date.now();
            //         fs.writeFileSync("./Images/"+timestamp+".jpg", imagesFile);
    
            //         if(updateString == ""){
            //             updateString = "profileImg='"+defaultUrl+timestamp+".jpg'";
                        
            //         }
            //         else{
            //             updateString = updateString+",profileImg='"+defaultUrl+timestamp+".jpg'";
            //         }
                    
            //     }
                
    
            //     if(updateString != ""){
    
            //             //res.json({"status":'f',"msg":"Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'"}); return false;
            //             var queryUpdate = "Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'";
                    
    
    
            //     var query = conn.query(queryUpdate, function (err, result){
            //     if(err){
            //     
            //     res.json({"status":'false',"msg":'Something went wrong!'});
            //     }
            //     if(result==''){
    
            //     //res.json({"status":'false',"msg":'Something went wrong'});
            //      resolve("wrong");   
            //     }else{
    
    
            //         var queryPic = conn.query("SELECT count(tb_points.id) as c, tb_users.organisation_id as organisation_id from tb_points, tb_users WHERE  tb_points.userid = "+reqObj.userid+" AND tb_points.points_type = 6 and tb_points.userid=tb_users.id and tb_users.profileImg != ''", function (err, resultSelectPic){
            //                                             if(err){
            //                                             
            //                                             res.json({"status":'false',"msg":'Something went wrong!'});
            //                                             }
            //                                             if(resultSelectPic[0].c == 0){
    
            //                                                                 if(reqObj.profileImg && reqObj.profileImg!=""){
    
                                                        
            //                                                                     var organisation_id = parseInt(resultSelectPic[0].organisation_id);    
            //                                                                     var queryInsert = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+organisation_id+"', 250, 6, 0)", function (err, resultInsert){
            //                                                                                                         if(err){
            //                                                                                                         
            //                                                                                                         res.json({"status":'false',"msg":'Something went wrong!'});
            //                                                                                                         }  
                                                                                                                         
            //                                                                                                                     //  custom by MCT  insert point in new table start
            //                                                                                                                             //update point start
            //                                                                                                                             var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+250+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+250+" WHERE userid  = '"+reqObj.userid+"'"
            //                                                                                                                             conn.query(update_point, (err, result)=>{
            //                                                                                                                                 if(err){
            //                                                                                                                                 
            //                                                                                                                                 res.json({"status":'false',"msg":'Something went wrong!'});
            //                                                                                                                                 }
            //                                                                                                                             })
            //                                                                                                                             var d = new Date();
    
            //                                                                                                                                 var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
            //                                                                                                                         var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
            //                                                                                                                         conn.query(update_point, (err, result)=>{
            //                                                                                                                             if(err){
            //                                                                                                                             
            //                                                                                                                             res.json({"status":'false',"msg":'Something went wrong!'});
            //                                                                                                                             }
            //                                                                                                                         });
            //                                                                                                                         var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
            //                                                                                                                         conn.query(update_point, (err, result)=>{
            //                                                                                                                             if(err){
            //                                                                                                                             
            //                                                                                                                             res.json({"status":'false',"msg":'Something went wrong!'});
            //                                                                                                                             }
            //                                                                                                                         })
            //                                                                                                                             //update point end
            //                                                                                                                     //  custom by MCT insert point in new table end
                                                                                                                                                   
    
    
            //                                                                                                                                 if(reqObj.device_type == "iOS"){
            //                                                                                                                                      let deviceToken = reqObj.device_token;
            //                                                                                                                                      //
            //                                                                                                                                      // Prepare the notifications
            //                                                                                                                                      let notification = new apn.Notification();
            //                                                                                                                                      notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
            //                                                                                                                                      notification.badge = 0;
            //                                                                                                                                      notification.sound = "default";
            //                                                                                                                                      notification.alert = "You have earned 250 bonus points by updating your profile pic.";
            //                                                                                                                                      notification.payload = {'messageFrom': 'FitIndia'};
                                                                                                                                                 
            //                                                                                                                                      // Replace this with your app bundle ID:
            //                                                                                                                                      notification.topic = "Com.MindCrew.FitIndia";
                                                                                                                                                 
            //                                                                                                                                      // Send the actual notification
            //                                                                                                                                      setTimeout(function () {
            //                                                                                                                                             apnProvider.send(notification, deviceToken).then( result => {
            //                                                                                                                                                     // Show the result of the send operation:
            //                                                                                                                                                     
            //                                                                                                                                                     
            //                                                                                                                                                  });
            //                                                                                                                                                  // Close the server
            //                                                                                                                                                  apnProvider.shutdown();
            //                                                                                                                                         }, 2000);    
    
                                                                                                                                                 
            //                                                                                                                                 }else if(reqObj.device_type == "Android"){
    
            //                                                                                                                                     
            //                                                                                                                                     
    
            //                                                                                                                                     // Prepare a message to be sent
            //                                                                                                                                     var message = new gcm.Message({
    
            //                                                                                                                                         data: { key:  "You have earned 250 bonus points by updating your profile pic."},
    
            //                                                                                                                                             notification: {
            //                                                                                                                                                 title: "Walkify",
            //                                                                                                                                                 icon: "ic_launcher",
            //                                                                                                                                                 body: "You have earned 250 bonus points by updating your profile pic."
            //                                                                                                                                             }
            //                                                                                                                                     });
            //                                                                                                                                     message.addData({
            //                                                                                                                                                     message: "You have earned 250 bonus points by updating your profile pic."
            //                                                                                                                                                 });
            //                                                                                                                                     // Specify which registration IDs to deliver the message to
            //                                                                                                                                     var regTokens = [reqObj.device_token];
                                                                                                                                                 
            //                                                                                                                                     // Actually send the message
    
            //                                                                                                                                     setTimeout(function () {
                                                                                                                                                    
    
            //                                                                                                                                         sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                                                                                            
            //                                                                                                                                             });
    
    
            //                                                                                                                                     }, 2000); 
    
                                                                                                                                                
    
    
    
            //                                                                                                                                 }
                                                                                                                    
    
            //                                                                     });
    
            //                                                                  }   else{
    
                                                   
    
            //                                                                  }
            //                                             }
    
    
    
            //                                             var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
            //                                             if(err){
            //                                             
            //                                             res.json({"status":'false',"msg":'Something went wrong!'});
            //                                             }
            //                                             if(resultSelect==''){
    
            //                                                 //res.json({"status":'false',"msg":'Something went wrong.'});
            //                                                 resolve("wrong");
            //                                             }else{
    
            //                                                     var responseData = {};
    
            //                                                     responseData.id = resultSelect[0].id;
            //                                                     responseData.name = resultSelect[0].name;
            //                                                     responseData.email = resultSelect[0].email;
            //                                                     responseData.profileImg = resultSelect[0].profileImg;
            //                                                     responseData.dob = resultSelect[0].dob;
            //                                                     responseData.dobn = resultSelect[0].dobn;
            //                                                     responseData.gender = resultSelect[0].gender;
            //                                                     responseData.phone = resultSelect[0].phone;
            //                                                     responseData.disease = resultSelect[0].disease;
            //                                                     responseData.height_fit_inc = resultSelect[0].height_fit_inc;
            //                                                     responseData.weight_kg = resultSelect[0].weight_kg;
            //                                                     responseData.device_type = resultSelect[0].device_type;
            //                                                     responseData.referral_code = resultSelect[0].referral_code;
            //                                                     responseData.organisation_id = resultSelect[0].organisation_id;
            //                                                     responseData.organisation_name = resultSelect[0].organisation_name;
            //                                                     responseData.organisation_code = resultSelect[0].organisation_code;
            //                                                     responseData.organisation_logo = resultSelect[0].organisation_logo;
    
            //                                                     var totalFieldsFilled = 0;
            //                                                     if(responseData.name != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
            //                                                     if(responseData.email != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
            //                                                     if(responseData.profileImg != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
            //                                                     if(responseData.dob != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
            //                                                     if(responseData.gender != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
    
            //                                                     if(responseData.phone != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
    
            //                                                     if(responseData.height_fit_inc != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
    
            //                                                     if(responseData.weight_kg != ""){
            //                                                         totalFieldsFilled = totalFieldsFilled+1;
            //                                                     }
    
            //                                                     responseData.profileComplete = (totalFieldsFilled/8)*100+"%";                       
                                                                    
            //                                                     //res.json({"status":'true',"msg":msg,"response":responseData});
            //                                                     resolve(responseData);
                                                         
            //                                             }
            //                                             });
    
            //         });
                        
                    
            //     }
            //     });
            //     }
            //         else{
            //             //res.json({"status":'false',"msg":'Sent valid parameters.'});
            //             resolve("invalid");
            //         }
            // });
            //     };
    
    
            
            //     checkPhoneNumber().then(function(data) {
    
                    
            //         updateAllProfileData().then(function(dataU) {
    
            //                 if(dataU=="invalid"){
            //                     res.json({"status":'false',"msg":'Sent valid parameters.'});
            //                 }else if(dataU=="wrong"){
            //                     res.json({"status":'false',"msg":'Something went wrong'});
            //                 }
            //                 else{
            //                     res.json({"status":'true',"msg":msg,"response":dataU}); 
            //                 }
    
            //         });
    
            //     });
    
    
    
    
    
                
                });
    
    
    }
    catch(ex){
    
    return next(ex);
    }
});
//1.54
//updateBMI
    
router.post('/updateBMIData', middleware, function(req,res,next){
    // res.json({"status":'false',"msg":'please update app'});
    try{
    var reqObj = req.body;        
    
    
            req.getConnection(function(err, conn){
    
                
                var queryUpdate = "Update tb_users set  tb_users.gender =  '"+reqObj.gender+"', tb_users.height_fit_inc =  '"+reqObj.height_fit_inc+"', tb_users.weight_kg =  '"+reqObj.weight_kg+"', tb_users.device_type =  '"+reqObj.device_type+"', tb_users.device_token =  '"+reqObj.device_token+"', tb_users.imei =  '"+reqObj.imei+"' where tb_users.id= '"+reqObj.userid+"'";
                
    
                var query = conn.query(queryUpdate, function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                if(result==''){
    
                res.json({"status":'false',"msg":'Something went wrong'});
                    
                }else{
    
    
                    function checkReferalPoints(deviceData) {
                            return new Promise(function(resolve,reject) {
                                
                                var distance = parseFloat(deviceData.tot_distance);
                                var stepscount = parseFloat(deviceData.tot_stepscount);
                                var parent_id = parseFloat(deviceData.parent_id);
                                var user_org = parseFloat(deviceData.user_org);
                                reqObj.parent_id = parent_id;
                                reqObj.organisation_id = user_org;
                                
    
                                    if((distance >= 5 || stepscount>20) && parent_id > 0){
                                        
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultCheckReferalPoints == ""){
    
                                                
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.parent_id+"','"+deviceData.parent_organisation_id+"', 1000, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                         
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.parent_id+"'",(err, result_userid)=>{
                                                        if(result_userid.length >0){
                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.parent_id+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                }
                                                            }) 
                                                        }
                                                         else {
                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.parent_id+"', 0, 1000, 0, 0, 1000 )"
                                                            conn.query(insertpoint, (err, result)=>{
                                                                if(err){
                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                }
                                                            })  
                                                            
                                                        }

                                                    });
                                                    
                                                            //  custom by MCT  insert point in new table start
                                                    //update point start
                                                    
                                                           
                                                    //update point end
                                                  //  custom by MCT insert point in new table end
                                                            if(deviceData.parent_device_type == "iOS"){
                                                                                 let deviceToken = deviceData.parent_device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    
                                                                                    
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.parent_device_token];
                                                                                 
                                                                                // Actually send the message
                                                                                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                    
                                                                                });
    
    
    
                                                                            }
                                                                            //resolve(true);
                                                    
    
                                                    });
                                                    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+reqObj.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                                        if(result_userid.length>0){  
                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.userid+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                }
                                                            })   
                                                        }
                                                         else {

                                                            
                                                                var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', points+"+0+", bonus_point = bonus_point+"+1000+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+1000+" )"
                                                                conn.query(insertpoint, (err, result)=>{
                                                                    if(err){
                                                                    res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                    }
                                                                })
                                                            
                                                        }

                                                    });
                                                    //  custom by MCT  insert point in new table start
                                                     //update point start
                                                     
                                                  //  custom by MCT insert point in new table end
    
                                                    
    
                                                        if(deviceData.device_type == "iOS"){
                                                                                 let deviceToken = deviceData.device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                
                                                                                                
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                
    
                                                resolve(true);
                                            }
    
    
                                        });
    
                                    
    
    
                                    }
                                    else{
                                        resolve(true);
                                    }
    
                            });
                        }
    
                     function updateUserData() {
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckPoints = conn.query("SELECT * FROM `tb_points` where userid ='"+reqObj.userid+"'", function (err, resultCheckPoints){
                                                                            if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    
                                                                    
                                                                    if(resultCheckPoints==""){
    
                                                                                var queryCheckGuestPoints = conn.query("SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_points_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestPoints){
                                                                                                if(err){
                                                                                        
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        if(resultCheckGuestPoints!=""){
    
    
                                                                                            asyncLoop(resultCheckGuestPoints, function (v, next)
    {
        var query = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to, created_at) Values('"+reqObj.userid+"',0, '"+v.points+"', '"+v.points_type+"', 0, '"+v.dten+"')", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                    if(result_userid.length>0){
                        var update_point = "UPDATE tb_newpoint SET points = points+"+v.points+", bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+v.points+" WHERE userid = '"+reqObj.userid+"'"
                        conn.query(update_point, (err, result)=>{
                            if(err){
                            
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }
                        })      
                    }
                    else {
                        var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+v.points+"', 0, 0, 0, '"+v.points+"' )"
                        conn.query(insertpoint, (err, result)=>{
                            if(err){
                            
                            res.json({"status":'false',"msg":'Something went wrong!insert'});
                            }
                        })



                       
                    }

                });
                //update point start
                
                //update point end
    
    
    next();
                });
    }, function (err)
    {
       
     
        resolve(true);
    });
                                                                                            
                                                                                        }else{
                                                                                            resolve(true);
                                                                                        }
                                                                                    });
                                                                        
                                                                    }else{
                                                                        resolve(true);
                                                                    }
                                                                });
    
    
    
    
                                                     
    
    
    
    
                                                }else{
                                                     resolve(true);
                                                }
                                    });
    
    
    
                            });
                     } 
    
    
    
                     function updateUserWalking() {
                            
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                        
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckWalking = conn.query("SELECT * FROM `tb_walking_history` where userid ='"+reqObj.userid+"'", function (err, resultCheckWalking){
                                                                            if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    
                                                                    
                                                                    if(resultCheckWalking==""){
    
                                                                                var queryCheckGuestWalking = conn.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_walking_history_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestWalking){
                                                                                                if(err){
                                                                                        
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        
                                                                                        if(resultCheckGuestWalking!=""){
    
    
    
                                                                                             asyncLoop(resultCheckGuestWalking, function (v, next)
    {
        var getHeightInMeter = reqObj.height_fit_inc;
        getHeightInMeter = getHeightInMeter.split(".");
        var HeightInMeter = parseInt(getHeightInMeter[0])+parseInt(getHeightInMeter[1])/12;
    
        var calPerMin = (0.035 * parseFloat(reqObj.weight_kg)) + ((v.velocity * 2) / (HeightInMeter/3.2808)) * (0.029) * (parseFloat(reqObj.weight_kg));
        calPerMin = Math.round(calPerMin * 100) / 100;
        var query = conn.query("insert into tb_walking_history(userid, distance, distance_unit, date, walk_time, calories, calorie_unit, img, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"', '"+v.distance+"', '"+v.distance_unit+"', '"+v.dten+"', '"+v.walk_time+"', '"+calPerMin+"', 'Kcal', '"+v.img+"', '"+v.from_lat+"', '"+v.from_lng+"', '"+v.to_lat+"', '"+v.to_lng+"')", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
    next();
                });
    }, function (err)
    {
       
     
        resolve(true);
    });    
                                                                                              
                                                                                            
                                                                                        }else{
                                                                                            resolve(true);
                                                                                        }
                                                                                       
                                                                                    });
                                                                        
                                                                    }
                                                                    
                                                                });
    
    
    
                                                
                                                }
                                                else{
                                                    resolve(true);
                                                }
                                    });
    
    
    
                            });
                     } 
    
                      function updateUserSteps() {
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                        
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckWalking = conn.query("SELECT * FROM `tb_stepscount_history` where userid ='"+reqObj.userid+"'", function (err, resultCheckWalking){
                                                                            if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    
                                                                    
                                                                    if(resultCheckWalking==""){
    
                                                                                var queryCheckGuestWalking = conn.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_stepscount_history_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestWalking){
                                                                                                if(err){
                                                                                        
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        
                                                                                        
                                                                                        if(resultCheckGuestWalking!=""){
    
    
    
                                                                                             asyncLoop(resultCheckGuestWalking, function (v, next)
    {
        
        var query = conn.query("insert into tb_stepscount_history(userid, stepscount, date, realstp, total_distance, total_calorie) Values('"+reqObj.userid+"', '"+v.stepscount+"', '"+v.dten+"', '"+v.realstp+"', '"+v.total_distance+"', '"+v.total_calorie+"')", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
    next();
                });
    }, function (err)
    {
        resolve(true);
    });
    
    
                                                                                              
                                                                                            
                                                                                        }else{
                                                                                            resolve(true);
                                                                                        }
                                                                                       
                                                                                    });
                                                                        
                                                                    }
                                                                    
                                                                });
    
    
    
                                                
                                                }
                                                else{
                                                    resolve(true);
                                                }
                                    });
    
    
    
                            });
                     }       
    
                    function deleteGuestData() {
                            
                            return new Promise(function(resolve,reject) {
    
                                    var querytb_points_guest = conn.query("DELETE FROM `tb_points_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelecttb_points_guest){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                
                                                        var querytb_walking_history_guest = conn.query("DELETE FROM `tb_walking_history_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_walking_history_guest){
                                                               if(err){
                                                                
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                 }
                                                            
                                                                var querytb_user_guest = conn.query("DELETE FROM `tb_guestUsers` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_user_guest){
                                                                   if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                     }
                                                                
                                                                 var querytb_user_stcount = conn.query("DELETE FROM `tb_stepscount_history_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_user_stcount){
                                                                   if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                     }
                                                                
                                                                resolve(true);
                                                            });
                                                            });
                                                            
                                                        });
    
                                                    });
    
                                    
    
                            });
                        }
    
                    function getUserInfo() {
                            
                            return new Promise(function(resolve,reject) {
    
                                    var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        if(resultSelect==''){
    
                                                            res.json({"status":'false',"msg":'Something went wrong.'});
                                                            
                                                        }else{
    
                                                                var responseData = {};
    
                                                                responseData.id = resultSelect[0].id;
                                                                responseData.name = resultSelect[0].name;
                                                                responseData.email = resultSelect[0].email;
                                                                responseData.profileImg = resultSelect[0].profileImg;
                                                                if(resultSelect[0].dob == '0000-00-00'){
                                                                    responseData.dob = '';
                                                                responseData.dobn = '';
                                                                }else{
                                                                    responseData.dob = resultSelect[0].dob;
                                                                responseData.dobn = resultSelect[0].dobn;
                                                                }
                                                                responseData.dob = resultSelect[0].dob;
                                                                responseData.dobn = resultSelect[0].dobn;
                                                                responseData.gender = resultSelect[0].gender;
                                                                responseData.phone = resultSelect[0].phone;
                                                                responseData.disease = resultSelect[0].disease;
                                                                responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                                responseData.weight_kg = resultSelect[0].weight_kg;
                                                                responseData.device_type = resultSelect[0].device_type;
                                                                responseData.referral_code = resultSelect[0].referral_code;
                                                                responseData.organisation_id = resultSelect[0].organisation_id;
                                                                responseData.organisation_name = resultSelect[0].organisation_name;
                                                                responseData.organisation_code = resultSelect[0].organisation_code;
                                                                responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                                                           
                                                                    
                                                                resolve(responseData);
                                                         
                                                        }
                                                        });
    
                    });
                    }   
    
                        
                    /*var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        if(resultSelect==''){
    
                                                            res.json({"status":'false',"msg":'Something went wrong.'});
                                                            
                                                        }else{
    
                                                                var responseData = {};
    
                                                                responseData.id = resultSelect[0].id;
                                                                responseData.name = resultSelect[0].name;
                                                                responseData.email = resultSelect[0].email;
                                                                responseData.profileImg = resultSelect[0].profileImg;
                                                                responseData.dob = resultSelect[0].dob;
                                                                responseData.dobn = resultSelect[0].dobn;
                                                                responseData.gender = resultSelect[0].gender;
                                                                responseData.phone = resultSelect[0].phone;
                                                                responseData.disease = resultSelect[0].disease;
                                                                responseData.height_fit_inc = resultSelect[0].height_fit_inc;
                                                                responseData.weight_kg = resultSelect[0].weight_kg;
                                                                responseData.device_type = resultSelect[0].device_type;
                                                                responseData.referral_code = resultSelect[0].referral_code;
                                                                responseData.organisation_id = resultSelect[0].organisation_id;
                                                                responseData.organisation_name = resultSelect[0].organisation_name;
                                                                responseData.organisation_code = resultSelect[0].organisation_code;
                                                                responseData.organisation_logo = resultSelect[0].organisation_logo;
                                                                                           
                                                                    
                                                                res.json({"status":'true',"msg":'Successful',"response":responseData});
                                                         
                                                        }
                                                        });*/
    
    
                    function getDeviceInfo() {
                            
                            return new Promise(function(resolve,reject) {
                                    
                                        var queryLeaderboardByOrg = conn.query("SELECT IFNULL(sum(tb_walking_history_guest.distance),0) as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_walking_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_walking_history_guest.imei", function (err, resultDeviceInfo){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultDeviceInfo == ""){
    
                                                
                                                var queryLeaderboardByOrg1 = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo1){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                            if(resultDeviceInfo1 == ""){
    
                                                                
                                                                resolve(resultDeviceInfo);
    
                                                            }else{
    
    
                                                                resolve(resultDeviceInfo1[0]);
                                                            }
    
    
                                                        });
    
                                            }else{
    
                                                resolve(resultDeviceInfo[0]);
                                            }
    
    
                                        });
                                    
    
    
                            });
                        }
    
                    getDeviceInfo().then(function(data) {
    
                        var deviceData = data;
                                               
                                            
                                                            
                                updateUserData().then(function(data) {
                                    
                                    
                                    if(data){
                                        updateUserWalking().then(function(dataupdateUserWalking) {
                                            
                                            if(dataupdateUserWalking){
    
                                                updateUserSteps().then(function(data) {
    
    
                                                checkReferalPoints(deviceData).then(function(data) {
                                                    
                                                    if(data== true){
                                                             deleteGuestData().then(function(GuestData) {
                                                               
                                                                
                                                                   
                                                                    getUserInfo().then(function(datagetUserInfo) {
                                                                        res.json({"status":'true',"msg":'Successful',"response":datagetUserInfo});
                                                                    });
                                                            });
                                                      }
    
                                                    });
    
                                                    });       
                                                }
    
                                        });
                                    }
                                });
    
                                
                        
                    });
    
                }
                });
                });
    
    }
    catch(ex){
    
    return next(ex);
    }
});
//get ProfileInfo history


router.post('/getProfileInfo', function(req,res,next){
    
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg, tb_users.disease ,tb_users.is_verified as is_email_verified ,tb_users.is_phone_verified, tb_users.parent_id,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"'   AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, result){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                    if(result==''){

                                    res.json({"status":'false',"msg":'Wrong username or password'});
                                        
                                    }else{

                                     var responseData = {};

                                    responseData.id = result[0].id;
                                    responseData.name = result[0].name;
                                    responseData.email = result[0].email;
                                    responseData.is_email_verified = result[0].is_email_verified;
                                    responseData.is_phone_verified = result[0].is_phone_verified;
                                    responseData.profileImg = result[0].profileImg;
                                    if(result[0].dob == '0000-00-00'){
                                        responseData.dob = '';
                                    responseData.dobn = '';
                                    }else{
                                        responseData.dob = result[0].dob;
                                    responseData.dobn = result[0].dobn;
                                    }
                                    //responseData.dob = result[0].dob;
                                    //responseData.dobn = result[0].dobn;
                                    responseData.gender = result[0].gender;
                                    responseData.phone = result[0].phone;
                                    responseData.height_fit_inc = result[0].height_fit_inc;
                                    responseData.weight_kg = result[0].weight_kg;
                                    responseData.disease  = result[0].disease;
                                    responseData.device_type = result[0].device_type;
                                    responseData.referral_code = result[0].referral_code;
                                    responseData.parent_id = result[0].parent_id;
                                    responseData.organisation_id = result[0].organisation_id;
                                    responseData.organisation_name = result[0].organisation_name;
                                    responseData.organisation_code = result[0].organisation_code;
                                    responseData.organisation_logo = result[0].organisation_logo;
                                                               
                                        
                                    res.json({"status":'true',"msg":'Successful',"response":responseData});
                                    }
                                    });
            });

}
catch(ex){

return next(ex);
}
});



//get user Score

router.post('/getUserScore', function(req,res,next){


try{
var reqObj = req.body;

req.getConnection(function(err, conn){
    
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

    if(!reqObj.organisation_id || reqObj.organisation_id == "" || !reqObj.userid || reqObj.userid == "")
        {

            res.json({"status":'false',"msg":'Organisation Id and User Id is mandatory!'});
        }
        else{

                    function getStepsScore() {
                        
                        return new Promise(function(resolve,reject) {
                            
                                    var querygetStepsScore = conn.query("SELECT stepscount, date, total_distance, total_calorie FROM `tb_stepscount_history` where userid='"+reqObj.userid+"' order by id DESC limit 1", function (err, resultgetStepsScore){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultgetStepsScore.length < 1){
                                            resultgetStepsScore = {};
                                            
                                            resultgetStepsScore.stepscount = "0"
                                                            resultgetStepsScore.date = ''
                                                            resultgetStepsScore.total_distance = "0"
                                                            resultgetStepsScore.total_calorie = "0"

                                            resolve(resultgetStepsScore);

                                        }else{

                                            

                                            resolve(resultgetStepsScore[0]);
                                        }


                                    });


                        });
                    }

                    function getPointsGlobal() {
                        
                        return new Promise(function(resolve,reject) {
                            
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsGlobal == ""){

                                            
                                            resolve(resultPointsGlobal);

                                        }else{

                                            

                                            resolve(resultPointsGlobal[0]);
                                        }


                                    });


                        });
                    }


                    function getPointsByOrg() {
                        
                        return new Promise(function(resolve,reject) {
                                    
                                if(reqObj.organisation_id > 0){
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points), 0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.status=0 and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                    if(err){
                                    
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsByOrg == ""){

                                            
                                            resolve(resultPointsByOrg);

                                        }else{

                                            

                                            resolve(resultPointsByOrg[0]);
                                        }


                                    });
                                }
                                else{
                                    var resultPointsByOrg = [];
                                    resolve(resultPointsByOrg);
                                }


                        });
                    }

                getStepsScore().then(function(data) {
                    var stepsScore = data;
                    getPointsGlobal().then(function(data) {
                        

                        var globalPoints = data;

                        if(data){

                            getPointsByOrg().then(function(data) {
                                    
                                    var pointsInOrganisation = data;


                                    var jsonObj = {};
                                                        if(globalPoints.userid == null){
                                                            var resultgetStepsScore ={};
                                                            resultgetStepsScore.stepscount = "0"
                                                            resultgetStepsScore.date = ''
                                                            resultgetStepsScore.total_distance = "0"
                                                            resultgetStepsScore.total_calorie = "0"

                                                            jsonObj.userid = reqObj.userid
                                                            jsonObj.globalPoints = 0
                                                            jsonObj.pointsInOrganisation = 0
                                                            jsonObj.stepsInfo = resultgetStepsScore

                                                        }
                                                        else{
                                                            jsonObj.userid = globalPoints.userid
                                                            // jsonObj.name = globalPoints.name
                                                            // jsonObj.email = globalPoints.email
                                                            // jsonObj.profileImg = globalPoints.profileImg
                                                            jsonObj.globalPoints = globalPoints.globalPoints
                                                            jsonObj.isEmailVerified = globalPoints.isEmailVerified
                                                            jsonObj.isPhoneVerified = globalPoints.isPhoneVerified
                                                            jsonObj.isProfileVerified = globalPoints.isProfileVerified
                                                            jsonObj.isAllVerified = 1
                                                            if(jsonObj.isEmailVerified == 0 || jsonObj.isPhoneVerified == 0 || jsonObj.isProfileVerified == 0){
                                                                jsonObj.isAllVerified = 0
                                                            }
                                                            jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
                                                            jsonObj.stepsInfo = stepsScore   
                                                        }   
                                                        

                                    res.json({"status":'true',"response":jsonObj});
                                    //next();
                                });
                        }
                        //next();
                    });

                   }); 

                }
}
});
}
catch(ex){

return next(ex);
}
});


// Api to Logout user
router.post('/logoutUser', middleware, function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    var query = conn.query("Update tb_users set tb_users.is_loggedIn =  0, tb_users.device_type =  '', tb_users.device_token = ''  where tb_users.id='"+reqObj.userid+"'", function (err, result)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

        res.json({"status":'true',"msg":'User is logged-Out Now!'});

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});


// Api to check user login
router.post('/isUserLoggedIn', function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var query = conn.query("select * from tb_users where tb_users.id='"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function (err, result)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(result == ""){
                                            res.json({"status":'true', "loginStatus":'false'});

                                        }else{
                                             if(result[0].bannuseres == 0)
                                              {
                                                res.json({"status":'true', "loginStatus":'true'});
                                              } 
                                              else{
                                                var query = conn.query("Update tb_users set tb_users.is_loggedIn =  0, tb_users.device_type =  '', tb_users.device_token = ''  where tb_users.id='"+reqObj.userid+"'", function (err, result)
                                                {
                                                if(err){
                                                
                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                        
                                                res.json({"status":'true',"msg":'User is logged-Out Now!'});
                                        
                                                    
                                                });
                                              }
                                            
                                        }

        

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});


// Api to forgot password
router.post('/forgotPassword', middleware, function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"'", function (err, result)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

        if(result==''){
            //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
            res.json({"status":'false',"msg":'Email id doesn’t exist!'});
        }
        else{

            var otp = Math.floor(Math.random()*90000) + 10000;

            
            var query = conn.query("insert into tb_otp(userid, otp) Values('"+result[0].id+"','"+otp+"')", function (err, resultt){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }

            var msgContent = "<br><br>Hi "+result[0].name+", <br><br> Please click on below link or paste on browser to reset your password.<br><a href='http://www.walkifyapp.com/reset.php?ver="+otp+"'>http://www.walkifyapp.com/reset.php?ver="+otp+"</a><br><br><br>Regards,<br>Walkify Team";
            var mailOptions={
        to : reqObj.email,
        subject : 'Walkify : Reset Password',
        html : '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">        @import url(https://fonts.googleapis.com/css?family=Lato);  @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }.mj-column-per-50 { width:50%!important; }  }</style></head><body style="background: #FFFFFF;">    <div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:50px;white-space:nowrap;">&#xA0;</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:72px;"><img alt="" height="auto" src="'+defaultUrl+'logowalkify.jpg" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="72"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="center"><div style="cursor:auto;color:#FFFFFF;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:center;"><h1 style="font-family: &apos;Cabin&apos;, sans-serif; color: #FFFFFF; font-size: 32px; line-height: 100%;">Walkify</h1><p>Keep Walking, Keep Earning</p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:35px 0px 35px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 21px 100px 9px;" align="left"><div style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><p><span style="font-size:14px;">'+msgContent+'</span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:29px;white-space:nowrap;">&#xA0;</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="left"><div style="cursor:auto;color:#949494;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:left;"><p><span style="font-size:12px;">Copyright &#xA9; 2019&#xA0;Walkify.com, All rights reserved.&#xA0;<br>&#xA0;<br></span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td><td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;" align="right"><div><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="undefined"><tr><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.facebook.com/PROFILE"><img alt="facebook" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/facebook.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.facebook.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.twitter.com/PROFILE"><img alt="twitter" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/twitter.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.twitter.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://plus.google.com/PROFILE"><img alt="google" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/google-plus.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://plus.google.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>'
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        res.end("error");
      }else{
        res.end("sent");
      }
    });

            res.json({"status":'true',"msg":'An email sent to your email address to reset password!'});  

            });
        }

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});


// Api to resetPassword
router.post('/resetPassword', function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var queryGet = conn.query("SELECT tb_users.*,tb_otp.otp FROM `tb_users`,`tb_otp` where tb_otp.otp='"+reqObj.user.ver+"' and tb_users.id = tb_otp.userid ORDER BY tb_otp.date DESC limit 1", function (err, resultGet)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(resultGet == ""){

                                            
                                            res.json({"status":'true', "msg":'Something went wrong'});

                                        }else{

                                                
                                                var encryptPasword = cryptLib.encrypt(reqObj.user.npassword, key, iv);
                                                var query = conn.query("Update tb_users set tb_users.password =  '"+encryptPasword+"' where tb_users.email='"+resultGet[0].email+"'", function (err, result)
                                                    {
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }

                                                    if(result==''){
                                                        //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    else{

                                                                    var queryDelete = conn.query("delete from tb_otp where tb_otp.otp='"+reqObj.user.ver+"'", function (err, resultDelete)
                                                                    {
                                                                    if(err){
                                                                    
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }

                                                                        res.json({"status":'true',"msg":'Password successfully updated!'});

                                                                        
                                                                    });

                                                        

                                                    }

                                                        
                                                    });
                                        }

        

            
        });


    
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});


// Api to check otp
router.post('/checkOTP', function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var query = conn.query("SELECT tb_users.*,tb_otp.otp FROM `tb_users`,`tb_otp` where tb_otp.otp='"+reqObj.user.ver+"' and tb_users.id = tb_otp.userid ORDER BY tb_otp.date DESC limit 1", function (err, result)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(result == ""){

                                            
                                            res.json({"status":'true', "link":'expired'});

                                        }else{

                                            

                                            res.json({"status":'true', "link":'working'});
                                        }

        

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});



// Api for mobile veritication
router.post('/phoneVerification', function(req,res,next){

    try{
    var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {
        var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
            {
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                if(resultCheckPhone == ""){
    
        var queryCheck = conn.query("SELECT * FROM `tb_users` where tb_users.id='"+reqObj.userid+"' and tb_users.is_phone_verified = 0 ", function (err, resultCheck)
            {
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                            if(resultCheck == ""){
                                                res.json({"status":'false', "msg":'Something went wrong'});
    
                                            }else{
                                                var queryUpdate = conn.query("Update tb_users set tb_users.is_phone_verified = 1, tb_users.phone = '"+reqObj.phone+"' where tb_users.id='"+reqObj.userid+"' ", function (err, resultUpdate)
                                                        {
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                                        if(resultUpdate == ""){
    
                                                                                            
                                                                                            res.json({"status":'true', "msg":'Something went wrong'});
    
                                                                                        }else{
                                                                                            res.json({"status":'true', "msg":'Phone updated'});
                                                                                        }
    
                                                        
    
                                                            
                                                        });
    
                                                
                                            }
    
            
    
                
            });
                
        }else{
            res.json({"status":'false', "msg":'Phone number is already registers!'});
        }
        });
        //res.json({"Insert":"Successful"});
    
    }
    
    });
    }
    catch(ex){
    
    return next(ex);
    }
});
    
// Api to check veritication email code
router.post('/checkEmailVerification', function(req,res,next){
    
    try{
    var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {
        
        var queryCheck = conn.query("SELECT * FROM `tb_users` where tb_users.verification_code='"+reqObj.user.ver+"' and tb_users.is_verified = 0 and tb_users.verification_code !='' ", function (err, resultCheck)
            {
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                            if(resultCheck == ""){
    
                                                
                                                res.json({"status":'true', "link":'expired'});
    
                                            }else{
    
                                                
                                                var queryUpdate = conn.query("Update tb_users set tb_users.is_verified = 1 where tb_users.verification_code='"+reqObj.user.ver+"' ", function (err, resultUpdate)
                                                        {
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                                        if(resultUpdate == ""){
    
                                                                                            
                                                                                            res.json({"status":'true', "link":'expired'});
    
                                                                                        }else{
                                                                                                res.json({"status":'true', "link":'working'});
                                                                                        }
    
                                                        
    
                                                            
                                                        });
    
                                                
                                            }
    
            
    
                
            });
        //res.json({"Insert":"Successful"});
    
    }
    
    });
    }
    catch(ex){
    
    return next(ex);
    }
});



// Api to verify email
router.post('/verifyEmail', middleware, function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"'", function (err, result)
        {
        if(err){
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

        if(result==''){
            //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
            res.json({"status":'false',"msg":'Email is not found!'});
        }
        if(result[0].is_verified==1 || result[0].is_verified=='1'){
            //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
            res.json({"status":'true',"msg":'Email is already verified!'});
        }
        else{

            var otp = Math.floor(Math.random()*90000) + 10000;

            
            var query = conn.query("update tb_users set verification_code = '"+otp+"' where email='"+reqObj.email+"'", function (err, resultt){
            if(err){
            
            res.json({"status":'false',"msg":'Something went wrong!'});
            }

            var msgContent = "<br><br>Hi "+result[0].name+", <br><br> Please click on below link or paste on browser to verify your email.<br><a href='http://www.walkifyapp.com/verify.php?ver="+otp+"'>http://www.walkifyapp.com/verify.php?ver="+otp+"</a><br><br><br>Regards,<br>Walkify Team";
            var mailOptions={
        to : reqObj.email,
        subject : 'Walkify : Verify Email',
        html : '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">        @import url(https://fonts.googleapis.com/css?family=Lato);  @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }.mj-column-per-50 { width:50%!important; }  }</style></head><body style="background: #FFFFFF;">    <div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:50px;white-space:nowrap;">&#xA0;</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:72px;"><img alt="" height="auto" src="'+defaultUrl+'logowalkify.jpg" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="72"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="center"><div style="cursor:auto;color:#FFFFFF;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:center;"><h1 style="font-family: &apos;Cabin&apos;, sans-serif; color: #FFFFFF; font-size: 32px; line-height: 100%;">Walkify</h1><p>Keep Walking, Keep Earning</p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:35px 0px 35px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 21px 100px 9px;" align="left"><div style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><p><span style="font-size:14px;">'+msgContent+'</span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:29px;white-space:nowrap;">&#xA0;</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="left"><div style="cursor:auto;color:#949494;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:left;"><p><span style="font-size:12px;">Copyright &#xA9; 2019&#xA0;Walkify.com, All rights reserved.&#xA0;<br>&#xA0;<br></span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td><td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;" align="right"><div><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="undefined"><tr><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.facebook.com/PROFILE"><img alt="facebook" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/facebook.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.facebook.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.twitter.com/PROFILE"><img alt="twitter" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/twitter.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.twitter.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://plus.google.com/PROFILE"><img alt="google" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/google-plus.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://plus.google.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>'
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        res.end("error");
      }else{
        res.end("sent");
      }
    });

            res.json({"status":'true',"msg":'An email sent to your email address to verify email!'});  

            });
        }

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){

return next(ex);
}
});

//06_september Api for live testing daily changed on 10 Sept

router.post('/AddStepsDailyBasedOneSix', middleware, function(req,res,next){
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    function checkReferalPoints(deviceData) {
                            
                            return new Promise(function(resolve,reject) {
                                
                                var stepscount = parseFloat(reqObj.stepscount);
                                    
                                    if(stepscount >= 1 && deviceData.parent_id > 0){
                                        
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                            if(resultCheckReferalPoints.length < 1){
    
                                                
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 1000, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                       //  custom by MCT  insert point in new table start
                                                                    //update point start

                                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+deviceData.parent_id+"'",(err, result_userid)=>{
                                                                        if(result_userid.length>0){
                                                                                       

                                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+deviceData.parent_id+"'"
                                                                            conn.query(update_point, (err, result)=>{
                                                                            if(err){
                                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            }
                                                                            })
                                                                                                                   
                                                                        }
                                                                        else {
                                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+deviceData.parent_id+"', 0, 1000,0, 0,1000 )"
                                                                            conn.query(insertpoint, (err, result)=>{
                                                                                if(err){
                                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                                }
                                                                            })

                                                                        }
          
                                                                    });

                                                                    
                                                                    //update point end
                                                                
                                                        //  custom by MCT insert point in new table end       
                                                    
                                                            if(deviceData.parent_device_type == "iOS"){
                                                                                 let deviceToken = deviceData.parent_device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    
                                                                                    
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.parent_device_token];
                                                                                 
                                                                                // Actually send the message
                                                                                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                    if (err) console.error(err);
                                                                                    else console.log(response);
                                                                                });
    
    
    
                                                                            }
                                                                            //resolve(true);
                                                    
    
                                                    });
    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 1000, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    //  custom by MCT  insert point in new table start
                                                    
                                                                            //update point start
                                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.userid+"'"
                                                                            conn.query(update_point, (err, result)=>{
                                                                            if(err){
                                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            }
                                                                            })
                                                        
    
                                                        if(deviceData.device_type == "iOS"){
                                                                                 let deviceToken = deviceData.device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                
                                                                                                
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                
    
                                                resolve(true);
                                            }
    
    
                                        });
    
                                    
    
    
                                    }
                                    else{
                                        resolve(true);
                                    }
    
                            });
                        }
                        function addStepsCountforchallenge1(){
                            return new Promise(function(resolve,reject) { 
                                resolve(true)
                            })
                        }
                        function addStepsCountforchallenge(){
                            return new Promise(function(resolve,reject) { 
                                conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_imei){
                                    if(err){
                                        res.json({"status": "false", "message": "Somthing Went Wrong11"})
                                    }else{
                                        if(result_imei.length>0){
                                            conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                                                if(err){
                                                    
                                                    res.json({"status":"false","msg":"SOmething went wrong12!"});

                                                }else{
                                                    
                                                    if(challengeresult.length>0){
                                                        
                                                        conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                                            if(err){
                                                                
                                                                res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                                            }else{
                                                                
                                                                if(chlngpointresult.length>0){  
                                                                    conn.query("select sum(points) as points,DATE_FORMAT(created_at, '%Y-%m-%d') as created_at from tb_challengepointsontime where userid='"+reqObj.userid+"' and points_type=7 and created_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1",function(err,timeresult){
                                                                        if(err){    
                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong14"})
                                                                        }else{
                                                                            if(timeresult.length>0){
                                                                                if(reqObj.StepCount>timeresult[0].points){
                                                                                    
                                                                                    var update_points = reqObj.StepCount - timeresult[0].points;
                                                                                    if(reqObj.StepCount>50000){
                                                                                        update_points = 50000 - timeresult[0].points;
                                                                                       }
                                                                                    conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+update_points+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                                        if(err){    
                                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                                                        }
                                                                                        conn.query("UPDATE tb_challengepoints SET step_points = step_points+'"+update_points+"', total_challenge_points = total_challenge_points+'"+update_points+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                                                            if(err){
                                                                                                
                                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                                                            }
                                                                                        resolve(true);
                                                                                            
                                                                                    });// end of updatesteppoints query
                
                                                                                    });// end of insertstepchlgpoints query
                                                                                }else{
                                                                                    res.json({"status": "false", "msg": "steps not correct challenge","response":null});
                                                                                }

                                                                            }else{
                                                                                if(reqObj.StepCount>50000){
                                                                                    reqObj.StepCount = 50000;
                                                                                   }
                                                                                conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                                    if(err){    
                                                                                        res.json({"status": "false", "msg": "Somthing Went Wrong17"})
                                                                                    }
                                                                                    conn.query("UPDATE tb_challengepoints SET step_points = '"+reqObj.StepCount+"', total_challenge_points = total_challenge_points+'"+reqObj.StepCount+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                                                        if(err){
                                                                                            
                                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong18"})	
                                                                                        }
                                                                                       resolve(true);
                                                                                        
                                                                                   });// end of updatesteppoints query
            
                                                                                });// end of insertstepchlgpoints query

                                                                            } // end of else block
                                                                        } //end of timeresult else block

                                                                    });  // end of timeresult query                                                         
                                                                    
                                                                }else{
                                                                    if(reqObj.StepCount>50000){
                                                                        reqObj.StepCount = 50000;
                                                                       }

                                                                    conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                        if(err){    
                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                                                        }
                                                                        conn.query("insert into tb_challengepoints (userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',0,0,'"+reqObj.StepCount+"',NOW())",function(err,inserted){
                                                                            if(err){
                                                                                
                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                                            }
                                                                           resolve(true);
                                                                            
                                                                       });// end of inserted query

                                                                    });// end of insertstepchlgpoints query
                                                                    

                                                                    
                                                                } // else if no data found 
                                                              
                                                            } // end of chlngpointresult else block

                                                        }); //end of chlngpointresult query
                                                    }else{
                                                        resolve(true);
                                                    }
                                                }
                                            }); //end of challengeresult query

                                        }else{
                                            res.json({"status": "false", "msg": "user not exist", "response":null})
                                        }
                                    } // end of result_imei else block
                                }); //end of result_imei query block

                            }); //end of return promise 

                        } // end of fucntion addStepsCountforchallenge

                        //******************end of challenge module for step couts***************//
                        function addStepsCount() {
                            return new Promise(function(resolve,reject) { 
                                conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_imei){
                                         if(err){
                                             res.json({"status": "false", "message": "Somthing Went Wrong"})
                                         }
                                         //imei check
                                         else{
                                             //imei check > 0
                                             var d = new Date();
                                             if((d.getMonth()+1)<10){
                                                if(d.getDate()<10){
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-0" +d.getDate();
                                                }
                                                else{
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
                                                }
                                               
                                            } 
                                            else{
                                                
                                                if(d.getDate()<10){
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-0" +d.getDate();
                                                }
                                                else{
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
                                                }
                                            }
                                                if(datestring == reqObj.CurrentDate){
                                             if(result_imei.length>0){
                                                 conn.query("SELECT points FROM `tb_newpoint` where userid = '"+reqObj.userid+"'", function(err, result_userid){
                                                     if(err){
                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})     
                                                     }
                                                     else{
                                                         //point table check last date
                                                         if(result_userid.length > 0){
                                                             conn.query("SELECT sum(points) as points, DATE_FORMAT(created_at, '%Y,-%m-%d') as created_at FROM tb_points WHERE userid = '"+reqObj.userid+"' and points_type = 7 and created_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1", function(err, result_lasttime){
                                                                if(result_lasttime.length>0){
                                                                    if(reqObj.StepCount>result_lasttime[0].points){
                                                                        
                                                                        var old_steps = result_lasttime[0].points;
                                                                            var new_steps = reqObj.StepCount;
                                                                            var updated_stps = (new_steps - old_steps);
                                                                            if(new_steps>50000){
                                                                                updated_stps = 50000 - old_steps;
                                                                               }
                                                                        conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+reqObj.StepCount+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                            if(err){
                                                                                res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                            }
                                                                            
                                                                                conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+updated_stps+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                                    if(err){    
                                                                                        res.json({"status": "false", "msg": "Somthing Went Wrong"})
                                                                                    }
                                                                                });
                                                                            
                                                                                resolve(true);
                                                                        });
                                                                    }else{
                                                                        res.json({"status": "false", "msg": "steps not correct league","response":null});
                                                                    }
                                                                    
                                                                }
                                                                //point table check last date
                                                                //else last date 
                                                                else{
                                                                 
                                                                    if(new_steps>50000){
                                                                        updated_stps = 50000 - old_steps;
                                                                       }
                                                                conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = total_league_steps+'"+updated_stps+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                    }
                                                                    
                                                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+updated_stps+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                            if(err){    
                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong"})
                                                                            }
                                                                        });
                                                                    
                                                                       resolve(true);
                                                                });
                                                             
                                                                 //
                                                                }
                                                                //else last date
                                                             });
                                                          
                                                        }
                                                         else{
                                                            if(reqObj.StepCount>=50000){
                                                                reqObj.StepCount=50000;
                                                            }
                                                            conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"', '"+reqObj.StepCount+"', 0, 0, '"+reqObj.StepCount+"', '"+reqObj.StepCount+"', Now() )", function(err, result_insert){
                                                                if(err){
                                                                    res.json({"status": "false", "message": "Somthing Went Wrong1"})
                                                                }
                                                                    conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+reqObj.StepCount+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                        if(err){    
                                                                            res.json({"status": "false", "message": "Somthing Went Wrong2"})
                                                                        }
                                                                       
                                                                        resolve(true)
                                                                    });
                                                              
 
                                                            });  
                                                            
                                                         }
                                                     }
                                                     
                                                 });
                                                 
                                             }
                                            }
                                             
                                             //imei check > 0
                                             else{
                                                 res.json({"status": "false", "msg": "user not exist", "response":null})
                                             }
                                         }
                                         //imei check
                                });
                            })
                          }
          
          
    
                        function getPointsGlobal() {
                            
                            return new Promise(function(resolve,reject) {
                                        var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                        if(err){
                                       // 
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsGlobal == ""){
    
                                                //
                                                resolve(resultPointsGlobal);
    
                                            }else{
    
                                               // 
    
                                                resolve(resultPointsGlobal[0]);
                                            }
    
    
                                        });
    
    
                            });
                        }
    
    
                        function getPointsByOrg() {
                            
                            return new Promise(function(resolve,reject) {
                                        
                                    if(reqObj.organisation_id > 0){
                                        var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                        if(err){
                                        
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsByOrg == ""){
    
                                                
                                                resolve(resultPointsByOrg);
    
                                            }else{
    
                                                
    
                                                resolve(resultPointsByOrg[0]);
                                            }
    
    
                                        });
                                    }
                                    else{
                                        var resultPointsByOrg = [];
                                        resolve(resultPointsByOrg);
                                    }
    
    
                            });
                        }
    
    
    
    
                        function getDeviceInfo() {
                            
                            return new Promise(function(resolve,reject) {
                                        
                                       
                                        var queryLeaderboardByOrg = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo){
                                        
                                        if(err){
                                        console.error('SQL error_sanju: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultDeviceInfo.length < 1){
    
    
                                                var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token, tb_users.parent_id as parent_id ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                        
                                        if(err){
                                        console.error('SQL error_sanju: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                        if(resultDeviceInfo.length < 1){
                                            resolve(resultDeviceInfo);
                                        }else{
                                            resolve(resultDeviceInfo[0]);
                                        }
                                                
    
                                    })
    
                                                
    
                                            }else{
                                                resolve(resultDeviceInfo[0]);
                                            }
    
                                            
                                        });
                                    
                                    
    
    
                            });
                        }
    
    
       getDeviceInfo().then(function(data) {
            var deviceData = data;
                   
            checkReferalPoints(deviceData).then(function(data) {
                if(data== true){
                                        
                        addStepsCount().then(function(data) {
                           
    
                          if(data== true){

                            addStepsCountforchallenge().then(function(data){
                           
                                           
                                    getPointsGlobal().then(function(data) {
                                    
                                    var globalPoints = data;
                                    

                                    if(data){

                                        getPointsByOrg().then(function(data) {
                                                    
                                                    
                                                    var pointsInOrganisation = data;
                                                    var jsonObj = {};
                                                    if(globalPoints.userid == null){

                                                        jsonObj.userid = reqObj.userid
                                                        // jsonObj.name = globalPoints.name
                                                        // jsonObj.email = globalPoints.email
                                                        // jsonObj.profileImg = globalPoints.profileImg
                                                        jsonObj.globalPoints = 0
                                                        jsonObj.pointsInOrganisation = 0
                                                    }else{
                                                        jsonObj.userid = globalPoints.userid
                                                        // jsonObj.name = globalPoints.name
                                                        // jsonObj.email = globalPoints.email
                                                        // jsonObj.profileImg = globalPoints.profileImg
                                                        jsonObj.globalPoints = globalPoints.globalPoints
                                                        jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
                                                    }
                                                    
                                                    res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
                                                });
                                        }
                                    }); //end of getPointsGlobal calling function
                            
                                }); //end of addStepsCountforchallenge
                            }
                            else{
                                res.json({"status":'true',"msg":'Something went wrong!'});
                            }
                          }); 
    
                    }
                });
            });
                    
    
    
               })     
    
    }
    catch(ex){
    
    return next(ex);
    }
});

// changed on 13 sept 

router.post('/AddStepsDailyBasedOneSixAndroid', function(req,res,next){
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    function checkReferalPoints(deviceData) {
                            
                            return new Promise(function(resolve,reject) {
                                
                                var stepscount = parseFloat(reqObj.stepscount);
                                    
                                    if(stepscount >= 1 && deviceData.parent_id > 0){
                                        
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        } 
                                            if(resultCheckReferalPoints.length < 1){
    
                                                
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                       //  custom by MCT  insert point in new table start
                                                                    //update point start

                                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+deviceData.parent_id+"'",(err, result_userid)=>{
                                                                        if(result_userid.length>0){
                                                                                       

                                                                            var update_point = "UPDATE tb_newpoint SET bonus_point = bonus_point+"+1000+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+deviceData.parent_id+"'"
                                                                            conn.query(update_point, (err, result)=>{
                                                                            if(err){
                                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            }
                                                                            })
                                                                        }
                                                                        else {
                                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+deviceData.parent_id+"', 0, 1000,0, 0,1000 )"
                                                                            conn.query(insertpoint, (err, result)=>{
                                                                                if(err){
                                                                                
                                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                                }
                                                                            })

                                                                        }
          
                                                                    });

                                                                    
                                                                    //update point end
                                                                
                                                        //  custom by MCT insert point in new table end       
                                                    
                                                            if(deviceData.parent_device_type == "iOS"){
                                                                                 let deviceToken = deviceData.parent_device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    
                                                                                    
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.parent_device_token];
                                                                                 
                                                                                // Actually send the message
                                                                                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                    if (err) console.error(err);
                                                                                    else console.log(response);
                                                                                });
    
    
    
                                                                            }
                                                                            //resolve(true);
                                                    
    
                                                    });
    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 1000, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    //  custom by MCT  insert point in new table start
                                                    
                                                                            //update point start
                                                                            var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+1000+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+1000+" WHERE userid = '"+reqObj.userid+"'"
                                                                            conn.query(update_point, (err, result)=>{
                                                                            if(err){
                                                                            
                                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            }
                                                                            })
                                                                                                    
                                                                                                            //update point start
                                                                                                            var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+1000+"', 3,NOW(), 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                                                            conn.query(update_point, (err, result)=>{
                                                                                                                if(err){
                                                                                                                
                                                                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                                                }
                                                                                                            });
                                                                                                            //  custom by MCT insert point in new table end
                                                        
    
                                                        if(deviceData.device_type == "iOS"){
                                                                                 let deviceToken = deviceData.device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 1000 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                
                                                                                                
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                
                                                                                
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 1000 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 1000 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 1000 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                
    
                                                resolve(true);
                                            }
    
    
                                        });
    
                                    
    
    
                                    }
                                    else{
                                        resolve(true);
                                    }
    
                            });
                        }
                        //***** to check user challenge is active or not on 31Aug NIVZ start *****//
                        function addStepsCountforchallenge1(){
                            return new Promise(function(resolve,reject) { 
                                resolve(true)
                            })
                        }
                        function addStepsCountforchallenge(){
                            return new Promise(function(resolve,reject) { 
                                conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_imei){
                                    if(err){
                                        res.json({"status": "false", "message": "Somthing Went Wrong11"})
                                    }else{
                                        if(result_imei.length>0){
                                            conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                                                if(err){
                                                    
                                                    res.json({"status":"false","msg":"SOmething went wrong12!"});

                                                }else{
                                                    
                                                    if(challengeresult.length>0){
                                                        
                                                        conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                                            if(err){
                                                                
                                                                res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                                            }else{
                                                                
                                                                if(chlngpointresult.length>0){  
                                                                    conn.query("select sum(points) as points,DATE_FORMAT(created_at, '%Y-%m-%d') as created_at from tb_challengepointsontime where userid='"+reqObj.userid+"' and points_type=7 and created_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1",function(err,timeresult){
                                                                        if(err){    
                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong14"})
                                                                        }else{
                                                                            if(timeresult.length>0){
                                                                                if(reqObj.StepCount>timeresult[0].points){
                                                                                    
                                                                                    var update_points = reqObj.StepCount - timeresult[0].points;
                                                                                    if(reqObj.StepCount>50000){
                                                                                        update_points = 50000 - timeresult[0].points;
                                                                                       }
                                                                                    conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+update_points+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                                        if(err){    
                                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                                                        }
                                                                                        conn.query("UPDATE tb_challengepoints SET step_points = step_points+'"+update_points+"', total_challenge_points = total_challenge_points+'"+update_points+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                                                            if(err){
                                                                                                
                                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                                                            }
                                                                                        resolve(true);
                                                                                            
                                                                                    });// end of updatesteppoints query
                
                                                                                    });// end of insertstepchlgpoints query
                                                                                }else{
                                                                                    res.json({"status": "false", "msg": "steps not correct challenge","response":null});
                                                                                }

                                                                            }else{
                                                                                if(reqObj.StepCount>50000){
                                                                                    reqObj.StepCount = 50000;
                                                                                   }
                                                                                conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                                    if(err){    
                                                                                        res.json({"status": "false", "msg": "Somthing Went Wrong17"})
                                                                                    }
                                                                                    conn.query("UPDATE tb_challengepoints SET step_points = '"+reqObj.StepCount+"', total_challenge_points = total_challenge_points+'"+reqObj.StepCount+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                                                        if(err){
                                                                                            
                                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong18"})	
                                                                                        }
                                                                                       resolve(true);
                                                                                        
                                                                                   });// end of updatesteppoints query
            
                                                                                });// end of insertstepchlgpoints query

                                                                            } // end of else block
                                                                        } //end of timeresult else block

                                                                    });  // end of timeresult query                                                         
                                                                    
                                                                }else{
                                                                    if(reqObj.StepCount>50000){
                                                                        reqObj.StepCount = 50000;
                                                                       }

                                                                    conn.query("INSERT INTO tb_challengepointsontime(userid,challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',7, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                                        if(err){    
                                                                            res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                                                        }
                                                                        conn.query("insert into tb_challengepoints (userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"','"+challengeresult[0].challenge_id+"','"+reqObj.StepCount+"',0,0,'"+reqObj.StepCount+"',NOW())",function(err,inserted){
                                                                            if(err){
                                                                                
                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                                            }
                                                                           resolve(true);
                                                                            
                                                                       });// end of inserted query

                                                                    });// end of insertstepchlgpoints query
                                                                    

                                                                    
                                                                } // else if no data found 
                                                              
                                                            } // end of chlngpointresult else block

                                                        }); //end of chlngpointresult query
                                                    }else{
                                                        resolve(true);
                                                    }
                                                }
                                            }); //end of challengeresult query

                                        }else{
                                            res.json({"status": "false", "msg": "user not exist", "response":null})
                                        }
                                    } // end of result_imei else block
                                }); //end of result_imei query block

                            }); //end of return promise 

                        } // end of fucntion addStepsCountforchallenge

                        //******************end of challenge module for step couts***************//
                        function addStepsCount() {
                            return new Promise(function(resolve,reject) { 
                                conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_imei){
                                         if(err){
                                             res.json({"status": "false", "message": "Somthing Went Wrong"})
                                         }
                                         //imei check
                                         else{
                                             //imei check > 0
                                             var d = new Date();
                                             if((d.getMonth()+1)<10){
                                                if(d.getDate()<10){
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-0" +d.getDate();
                                                }
                                                else{
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
                                                }
                                               
                                            } 
                                            else{
                                                
                                                if(d.getDate()<10){
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-0" +d.getDate();
                                                }
                                                else{
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
                                                }
                                            }
                                                if(datestring == reqObj.CurrentDate){
                                             if(result_imei.length>0){
                                                 conn.query("SELECT points FROM `tb_newpoint` where userid = '"+reqObj.userid+"'", function(err, result_userid){
                                                     if(err){
                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})     
                                                     }
                                                     else{
                                                         //point table check last date
                                                         if(result_userid.length > 0){
                                                             conn.query("SELECT sum(points) as points, DATE_FORMAT(created_at, '%Y,-%m-%d') as created_at FROM tb_points WHERE userid = '"+reqObj.userid+"' and points_type = 7 and created_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1", function(err, result_lasttime){
                                                                if(result_lasttime.length>0){
                                                                    if(reqObj.StepCount>result_lasttime[0].points){
                                                                        var old_steps = result_lasttime[0].points;
                                                                            var new_steps = reqObj.StepCount;
                                                                            var updated_stps = (new_steps - old_steps);
                                                                                      
                                                                            if(new_steps>50000){
                                                                                updated_stps = 50000 - old_steps;
                                                                               }

                                                                        conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+reqObj.StepCount+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                            if(err){
                                                                                res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                            }
                                                                            
                                                                                conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+updated_stps+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                                    if(err){    
                                                                                        res.json({"status": "false", "msg": "Somthing Went Wrong"})
                                                                                    }
                                                                                });
                                                                            
                                                                                resolve(true);
                                                                        });
                                                                    }else{
                                                                        res.json({"status": "false", "msg": "steps not correct league","response":null});
                                                                    }
                                                                    
                                                                }
                                                                //point table check last date
                                                                //else last date 
                                                                else{
                                                                    if(new_steps>50000){
                                                                        updated_stps = 50000 - old_steps;
                                                                       }
                                                                 
                                                                conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = total_league_steps+'"+updated_stps+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                    }
                                                                    
                                                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+updated_stps+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                            if(err){    
                                                                                res.json({"status": "false", "msg": "Somthing Went Wrong"})
                                                                            }
                                                                        });
                                                                    
                                                                       resolve(true);
                                                                });
                                                             
                                                                 //
                                                                }
                                                                //else last date
                                                             });
                                                          
                                                        }
                                                         else{
                                                            if(reqObj.StepCount>=50000){
                                                                reqObj.StepCount=50000;
                                                            }
                                                            conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"', '"+reqObj.StepCount+"', 0, 0, '"+reqObj.StepCount+"', '"+reqObj.StepCount+"', Now() )", function(err, result_insert){
                                                                if(err){
                                                                    res.json({"status": "false", "message": "Somthing Went Wrong1"})
                                                                }
                                                                    conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+reqObj.StepCount+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
                                                                        if(err){    
                                                                            res.json({"status": "false", "message": "Somthing Went Wrong2"})
                                                                        }
                                                                       
                                                                        resolve(true)
                                                                    });
                                                              
 
                                                            });  
                                                            
                                                         }
                                                     }
                                                     
                                                 });
                                                 
                                             }
                                            }
                                             
                                             //imei check > 0
                                             else{
                                                 res.json({"status": "false", "msg": "user not exist", "response":null})
                                             }
                                         }
                                         //imei check
                                });
                            })
                          }
          
          
    
                        function getPointsGlobal() {
                            
                            return new Promise(function(resolve,reject) {
                                        var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                        if(err){
                                       // 
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsGlobal == ""){
    
                                                //
                                                resolve(resultPointsGlobal);
    
                                            }else{
    
                                               // 
    
                                                resolve(resultPointsGlobal[0]);
                                            }
    
    
                                        });
    
    
                            });
                        }
    
    
                        function getPointsByOrg() {
                            
                            return new Promise(function(resolve,reject) {
                                        
                                    if(reqObj.organisation_id > 0){
                                        var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                        if(err){
                                        
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsByOrg == ""){
    
                                                
                                                resolve(resultPointsByOrg);
    
                                            }else{
    
                                                
    
                                                resolve(resultPointsByOrg[0]);
                                            }
    
    
                                        });
                                    }
                                    else{
                                        var resultPointsByOrg = [];
                                        resolve(resultPointsByOrg);
                                    }
    
    
                            });
                        }
    
    
    
    
                        function getDeviceInfo() {
                            
                            return new Promise(function(resolve,reject) {
                                        
                                        
                                       
                                        var queryLeaderboardByOrg = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo){
                                        
                                        if(err){
                                        console.error('SQL error_sanju: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultDeviceInfo.length < 1){
    
    
                                                var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token, tb_users.parent_id as parent_id ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                        
                                        if(err){
                                        console.error('SQL error_sanju: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                        if(resultDeviceInfo.length < 1){
                                            resolve(resultDeviceInfo);
                                        }else{
                                            resolve(resultDeviceInfo[0]);
                                        }
                                                
    
                                    })
    
                                                
    
                                            }else{
    
    
                                                resolve(resultDeviceInfo[0]);
                                            }
    
                                            
                                        });
                                    
                                    
    
    
                            });
                        }
    
    
       getDeviceInfo().then(function(data) {
        
            var deviceData = data;
                   
            checkReferalPoints(deviceData).then(function(data) {
                
                if(data== true){
                                        
                        addStepsCount().then(function(data) {
                            
                           
    
                          if(data== true){

                            addStepsCountforchallenge().then(function(data){
                                
                           
                                           
                                    getPointsGlobal().then(function(data) {
                                    
                                    var globalPoints = data;
                                    

                                    if(data){

                                        getPointsByOrg().then(function(data) {
                                                    
                                                    
                                                    var pointsInOrganisation = data;
                                                    var jsonObj = {};
                                                    if(globalPoints.userid == null){

                                                        jsonObj.userid = reqObj.userid
                                                        // jsonObj.name = globalPoints.name
                                                        // jsonObj.email = globalPoints.email
                                                        // jsonObj.profileImg = globalPoints.profileImg
                                                        jsonObj.globalPoints = 0
                                                        jsonObj.pointsInOrganisation = 0
                                                    }else{
                                                        jsonObj.userid = globalPoints.userid
                                                        // jsonObj.name = globalPoints.name
                                                        // jsonObj.email = globalPoints.email
                                                        // jsonObj.profileImg = globalPoints.profileImg
                                                        jsonObj.globalPoints = globalPoints.globalPoints
                                                        jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
                                                    }
                                                    
                                                    res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
                                                });
                                        }
                                    }); //end of getPointsGlobal calling function
                            
                                }); //end of addStepsCountforchallenge
                            }
                            else{
                                res.json({"status":'true',"msg":'Something went wrong!'});
                            }
                          }); 
    
                    }
                });
            });
                    
    
    
               })     
    
    }
    catch(ex){
    
    return next(ex);
    }
});

router.post('/AddStepsHistoryUser', middleware, function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    return new Promise(function(resolve,reject) { 
                               var insertquerydata ='';
                               var arrrylist = reqObj.data;
                              asyncLoop(arrrylist, function (qdata, next)
                              {
                                  if(insertquerydata == ''){
                                            insertquerydata = '('+reqObj.userid+','+qdata.StepCount+','+0+', '+0+','+0+', "'+qdata.StartTime+'","'+qdata.EndTime+'")';
                                           next();
                                  } else {
                                              insertquerydata += ',('+reqObj.userid+','+qdata.StepCount+', '+0+','+0+','+0+', "'+qdata.StartTime+'","'+qdata.EndTime+'")';
                                      next();
                                  }
                              }, function ()
                                  {
                                      if(insertquerydata!=''){
                                          var query = "insert into tb_steps_history(userid, stepscount, realstp, total_distance, total_calorie, starttime, endtime ) Values "+insertquerydata;
                                          conn.query(query, function (err, resultInsertHistory){
                                              if(err){
                                              res.json({"err": "error"})
                                              }
                                              res.json({"status": "true", "message": "data save successfully!"})
                                        });
                                      }
                                     
                                  }
                                  );
                              
                    })
               })     
    
    }
    catch(ex){
    
    return next(ex);
    }
});


router.get('/verifymobilepn', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_users", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS"){
                                         let deviceToken = v.device_token;
                                         
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "Validate your number to get 250 points.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android"){

                                        

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Validate your number to get 250 points."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Validate your number to get 250 points."
                                                }
                                        });
                                        message.addData({
                                                        message: "Validate your number to get 250 points."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});


router.get('/verifymobilepntwo', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_guestUsers", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS"){
                                         let deviceToken = v.device_token;
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "Validate your number to get 250 points.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android"){

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Validate your number to get 250 points."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Validate your number to get 250 points."
                                                }
                                        });
                                        message.addData({
                                                        message: "Validate your number to get 250 points."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});



router.get('/updateapp', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_users", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            { 
                                if(v.device_type == "Android"){

                                        

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "New Android update has come, please update."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "New Android update has come, please update."
                                                }
                                        });
                                        message.addData({
                                                        message: "New Android update has come, please update."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});


router.get('/ntForTopThrity', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id ORDER BY totalpoints DESC limit 30", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "Hurry, you are in top 30 on leaderboard. Walk more & be on top.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Hurry, you are in top 30 on leaderboard. Walk more & be on top."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Hurry, you are in top 30 on leaderboard. Walk more & be on top."
                                                }
                                        });
                                        message.addData({
                                                        message: "Hurry, you are in top 30 on leaderboard. Walk more & be on top."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});


router.get('/ntForToHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC limit 101", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "Hurry! you are in top 100. Make up to 20 rank to win cash prize. 2 days left.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Hurry! you are in top 100. Make up to 20 rank to win cash prize. 2 days left."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Hurry! you are in top 100. Make up to 20 rank to win cash prize. 2 days left."
                                                }
                                        });
                                        message.addData({
                                                        message: "Hurry! you are in top 100. Make up to 20 rank to win cash prize. 2 days left."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});


router.get('/ntForBelowHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id HAVING SUM(tb_points.points) < 100 ORDER BY totalpoints DESC", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "Have a quick walk around & earn your first 100 points.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Have a quick walk around & earn your first 100 points."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Have a quick walk around & earn your first 100 points."
                                                }
                                        });
                                        message.addData({
                                                        message: "Have a quick walk around & earn your first 100 points."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});



router.get('/ntForAboveHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id HAVING SUM(tb_points.points) > 100 ORDER BY totalpoints DESC", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         // Prepare the notifications
                                         let notification = new apn.Notification();
                                         notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                         notification.badge = 0;
                                         notification.sound = "default";
                                         notification.alert = "You are doing well. Walk more , earn more.";
                                         notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                         // Replace this with your app bundle ID:
                                         notification.topic = "Com.MindCrew.FitIndia";
                                         
                                         // Send the actual notification
                                         setTimeout(function () {
                                                apnProvider.send(notification, deviceToken).then( result => {
                                                        // Show the result of the send operation:
                                                        
                                                        
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){
                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "You are doing well. Walk more , earn more."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "You are doing well. Walk more , earn more."
                                                }
                                        });
                                        message.addData({
                                                        message: "You are doing well. Walk more , earn more."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});


router.get('/ntForPaytmGPay', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token from tb_users where device_type !='' and device_token!='undefined'", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            { 
                                if(v.device_type == "Android" && v.device_token != "undefined"){
                                        

                                        // Prepare a message to be sent
                                        var message = new gcm.Message({

                                            data: { key:  "Introducing Paytm and GooglePay cash rewards. Happy walking."},

                                                notification: {
                                                    title: "Walkify",
                                                    icon: "ic_launcher",
                                                    body: "Introducing Paytm and GooglePay cash rewards. Happy walking."
                                                }
                                        });
                                        message.addData({
                                                        message: "Introducing Paytm and GooglePay cash rewards. Happy walking."
                                                    });
                                        // Specify which registration IDs to deliver the message to
                                        var regTokens = [v.device_token];
                                         
                                        // Actually send the message

                                        
                                            

                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                    if (err) console.error(err);
                                                    else console.log(response);
                                                });


                                        

                                        



                                    }

                                
                              next();

                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                             
                                res.json({"status":'true',"msg":'Successful'});
                            });
                        }
                
                });

    }
    })
}
catch(ex){

return next(ex);
}
});

// current league and prviousleague
////changes date 30-08-2019
router.get('/nextandpreviousleague', (req, res, next)=>{
    try{
        req.getConnection((err, conn)=>{
          if(err) {
              
              res.json({"status":'false',"msg":'Something went wrong!'});
              }
              else {
                  conn.query("SELECT  DATE_FORMAT(previousdate, '%Y-%m-%d') as previous , DATE_FORMAT(nextdate, '%Y-%m-%d') as nextdat, DATE_FORMAT(NOW(), '%Y-%m-%d') as CurrentDate, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') AS CurrentTime FROM tb_organisations WHERE id = 0", (err, result)=>{
                      if(err){
                          res.json({"Error": 'Somthing went wrong'})
                      }
                      else {
                          res.json({"data": result, "DonateURL":"http://52.66.124.74/PaytmKit/paytm_payment.php","steppoints":50000});
                      }
                  });
              }
        });
    }
    catch(ex){
        return next(ex);
    }
  });


//start new updated 1.51
router.post('/usermapvfone', function(req,res,next){
    
    try{    
        var reqObj = req.body;     
        req.getConnection(function(err, conn){
        if(err)
        {
        
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
                var query = conn.query("SELECT * FROM tb_usermap WHERE userid = '"+reqObj.userid+"'", function (err, result){
                        if(err){
                        res.json({"status":'false',"msg":'Something went wrong! new history!'});
                        }
                           var arrrylist = reqObj.data;
                           if(arrrylist != ''){
                          asyncLoop(arrrylist, function (qdata, next)
                          {   
                            conn.query("SELECT userid, DATE_FORMAT(date, '%Y-%m-%d') AS newdate FROM tb_usermap  WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'", function (err, resultstepsavali){
                                if(err){
                                    res.json({"err": "error"})
                                }
                                if(resultstepsavali.length>0){
                                  if(resultstepsavali[0].newdate == qdata.date)
                                  {     
                                    conn.query("UPDATE `tb_usermap` SET stepsount = '"+qdata.stepsount+"' WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'", function (err, resultsteps){
                                        if(err){
                                            res.json({"err": "error"});
                                        }
                                    })
                                  }
                                  next();
                            } else {
                                conn.query("INSERT INTO tb_usermap( userid, organisation_id, stepsount, date) VALUES ('"+reqObj.userid+"',1, '"+qdata.stepsount+"', '"+qdata.date+"')", function (err, resultsteps){
                                    if(err){
                                        res.json({"err": "error"});
                                    }
                                })
                                next();
                            }
                            
                        }); 
                        
                        
                          }, function (err)
                              {
                                if (err)
                                {
                                    console.error('Error: ' + err.message);
                                    return;
                                }
                                conn.query("SELECT userid, organisation_id, stepsount, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM tb_usermap WHERE  date >= now() - INTERVAL 7 DAY and userid = '"+reqObj.userid+"'", function (err, resultnew){
                                    if(err){
                                        res.json({"err": "error"});
                                    }
                                    res.json({'status':"true", 'sevendays':resultnew })
                                });
                                
                                 
                              }
                              
                              );
                            }
                             else if(arrrylist == ''){
                                conn.query("SELECT userid, organisation_id, stepsount, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM tb_usermap WHERE  date >= now() - INTERVAL 7 DAY and userid = '"+reqObj.userid+"'", function (err, resultnew){
                                    if(err){
                                        res.json({"err": "error"});
                                    }
                                    res.json({'status':"true", 'sevendays':resultnew })
                                });
                             }
                        });
    
        }
        
        })
        
    }
    catch(ex){
    
    return next(ex);
    }
});

router.post('/HomeScreenDataVsOneSix', function(req,res,next){
    res.json({"status":"false", "message": "please update your app"})
});

router.post('/updateversionwalkify', function(req,res,next){
        
            try{
            var reqObj = req.body;        
           
              req.getConnection(function(err, conn){
              var query = conn.query("SELECT id FROM `tb_users` WHERE id = '"+reqObj.userid+"'" , function (err, result){
                        if(err){
                        
                        res.json({"status":'false',"msg":'Something went wrong!',"query":query});
                        }
                              
                        if(result.length> 0){
                            conn.query("UPDATE tb_users SET device_type = '"+reqObj.device_type+"',  version = '"+reqObj.version+"' where id = '"+reqObj.userid+"'", function(err, result1){
								conn.query("select version from tb_version", (err, result_vesion)=>{
                                    res.json({"status":'true', 'msg': 'Update successful', 'data': result_vesion[0].version});
                                    //res.json({"status":'true', 'msg': 'Update successful', 'data': ''});
								});
                                    
                            });
                            
                        }else{
                            res.json({"status":'false',"msg":'No record found', 'data': ""});
                        }
                        });
                        });
            
            }
            catch(ex){
            
            return next(ex);
            }
});



//13_septmber
router.post('/AdvertisementvfFiveFour', function(req,res,next){
    try{ 
            var reqObj = req.body;
            req.getConnection(function(err, conn){
                if(err)
                {
                  res.json({"status":'false',"message":'Something went wrong!1'});
                }
                else{ 
                    function leagueBonus(){
                        return new Promise(function(resolve, reject){
                            if(reqObj.userid == ""){
                                res.json({"status": "false","message":"user not register"})
                            }else{
                            if(reqObj.bonus_point<=50){
                                conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                    if(result_userid.length>0){
                                    var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+'"+reqObj.bonus_point+"', outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+reqObj.bonus_point+"' WHERE userid = '"+reqObj.userid+"'"
                                    conn.query(update_point, (err, result)=>{
                                    if(err){
                                    
                                    res.json({"status":'false',"message":'Something went wrong!2'});
                                    }else{
                                        conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+reqObj.bonus_point+"', 11, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                            if(err){
                                            
                                            res.json({"status":'false',"message":'Something went wrong!3'});
                                            }
                                                else{
                                                
                                                conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+reqObj.bonus_point+"', 11)", function (err, resultAddPoints){
                                                if(err){
                                                res.json({"status":'false',"message":'Something went wrong!4'});
                                                }
                                                else{
                                                    conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"message":'Something went wrong!5'});
                                                        }
                                                        else{
                                                        resolve(result_total);
                                                        }
                                                        });
                                                }
                                                }); 
                                               
                                                }
                                            });
                                    }
                                    })
                                    }
                                    else {
                                        var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', 0,'"+reqObj.bonus_point+"', 0, 0, 10 )"
                                        conn.query(insertpoint, (err, result)=>{
                                        if(err){
                                            
                                            res.json({"status":'false',"message":'Something went wrong!insert'});
                                          }
                                          else{
                                            conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+reqObj.bonus_point+"', 11,Now(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                                if(err){
                                                
                                                res.json({"status":'false',"message":'Something went wrong!3'});
                                                }
                                                    else{
                                                    
                                                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+reqObj.bonus_point+"', 11)", function (err, resultAddPoints){
                                                    if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!4'});
                                                    }else{
                                                        conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                            if(err){
                                                            
                                                            res.json({"status":'false',"message":'Something went wrong!5'});
                                                            }
                                                            else{
                                                             resolve(result_total)
                                                            }
                                                            });
                                                    }
                                                    }); 
                                                    
                                                    }
                                                });
                                          }
                                        }) 
                                    }
                                
                                });
                            }else{
                                conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                    if(result_userid.length>0){
                                    var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+'"+10+"', outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+10+"' WHERE userid = '"+reqObj.userid+"'"
                                    conn.query(update_point, (err, result)=>{
                                    if(err){
                                    
                                    res.json({"status":'false',"message":'Something went wrong!2'});
                                    }else{
                                        conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+10+"', 11,'"+reqObj.date+"', '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                            if(err){
                                            
                                            res.json({"status":'false',"message":'Something went wrong!3'});
                                            }
                                                else{
                                                
                                                conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+10+"', 11)", function (err, resultAddPoints){
                                                if(err){
                                                res.json({"status":'false',"message":'Something went wrong!4'});
                                                }
                                                else{
                                                    conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                        if(err){
                                                        
                                                        res.json({"status":'false',"message":'Something went wrong!5'});
                                                        }
                                                        else{
                                                        resolve(result_total);
                                                        }
                                                        });
                                                }
                                                }); 
                                               
                                                }
                                            });
                                    }
                                    })
                                    }
                                    else {
                                        var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', 0,'"+10+"', 0, 0, 10 )"
                                        conn.query(insertpoint, (err, result)=>{
                                        if(err){
                                            
                                            res.json({"status":'false',"message":'Something went wrong!insert'});
                                          }
                                          else{
                                            conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+10+"', 11,'"+reqObj.date+"', '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                                if(err){
                                                
                                                res.json({"status":'false',"message":'Something went wrong!3'});
                                                }
                                                    if(result){
                                                    
                                                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+10+"', 11)", function (err, resultAddPoints){
                                                    if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!4'});
                                                    }else{
                                                        conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                            if(err){
                                                            
                                                            res.json({"status":'false',"message":'Something went wrong!5'});
                                                            }
                                                            else{
                                                                resolve(result_total)
                                                            }
                                                            });
                                                    }
                                                    }); 
                                                    
                                                    }
                                                });
                                          }
                                        }) 
                                    }
                                
                                });
                               }
                             }
                        })
                    }
                    function challengeBonus(){
                        if(reqObj.bonus_point>50){
                            reqObj.bonus_point = 10;
                        }
                        return new Promise(function(resolve,reject) {
                            conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                                if(err){
                                    
                                    res.json({"status":"false","msg":"SOmething went wrong12!"});
        
                                }else{
                                    //challenages start if
                                    if(challengeresult.length>0){
                                        
                                        conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                            if(err){
                                                res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                            }else{
                                                if(chlngpointresult.length>0){  
                                                    conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"','"+reqObj.bonus_point+"',11, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                        if(err){    
                                                            res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                        }
                                                        conn.query("UPDATE tb_challengepoints SET bonus_points= bonus_points+'"+reqObj.bonus_point+"',total_challenge_points = total_challenge_points+'"+reqObj.bonus_point+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                            if(err){
                                                                
                                                                res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                            }
                                                        resolve(true);
                                                    });// end of updatesteppoints query
                                                    });// end of insertstepchlgpoints query
                                             }
                                             else{
                                               conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id,points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"', '"+reqObj.bonus_point+"',10, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                   if(err){    
                                                       res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                                   }
                                                   conn.query("insert into tb_challengepoints (userid, challenge_id, step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"',0,'"+reqObj.bonus_point+"',0,'"+reqObj.bonus_point+"',NOW())",function(err,inserted){
                                                       if(err){
                                                           
                                                           res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                       }
                                                      resolve(true);
                                                       
                                                   });// end of inserted query
                                                 });// end of insertstepchlgpoints query
                                               } // else if no data found 
                                            }
        
                                            });
                                    }else{
                                        resolve(true);
                                    }
                                    //challenages end if
                                }
                            }); 
                            //close challenges   
                        
                        });
                        //return promise
           }
                  leagueBonus().then(function(data){
     
                      var result_total = data;
                      if(data){
                        challengeBonus().then(function(data){
                            res.json({"status": "true","message":"Thank you for watching video. '"+reqObj.bonus_point+"' bonus points added successfully.", result_total})
                        })
                        
                      }
                  });


                }
            })
    }
    catch(ex){
    
    return next(ex);
    }
});
//15_sept
router.post('/VideoValidationTime', function(req,res,next){
    //	/Servertime
    try{
        var reqObj = req.body;
        
        //DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
        
        req.getConnection(function(err, conn){
            var query = conn.query("SELECT NOW() as servertime", function (err, resultserver){
                if(err){
                
                res.json({"status":'false',"message":'Something went wrong!'});
                }
                
                conn.query("select created_at as videotime from tb_bonuspoint where userid= '"+reqObj.userid+"' and rewardName = 'video' order by id desc limit 1", function (err, result){
                    if(err){
                    
                    res.json({"status":'false',"message":'Something went wrong!0'});
                    }
                    
                    var fromTime = new Date(resultserver[0].servertime); 

                    
                    var toTime;
                    if(result.length>0){
                    toTime = new Date(result[0].videotime);
                    }
                    else{
                    toTime =fromTime;
                    }
                    
                    var differenceTravel = fromTime.getTime()- toTime.getTime();
                    var minut = (differenceTravel/(1000));
                    var secondcheck = (differenceTravel/1000);
                    var msgtrue = Math.floor(secondcheck);
                    var valusesnew = Math.floor(secondcheck);
                    if(valusesnew==0)
                    {
                    valusesnew = 30;
                    }
                    else{
                    valusesnew = 30-valusesnew;
                    }
                    
                    var zmsg="You need to wait "+valusesnew+" seconds for watching next video";
                    //"You need to wait 6 minutes for watching next video"
                    if(minut>=30 || differenceTravel==0){
                    var snumber = (Math.floor(Math.random() * (5 - 1 + 1) + 1))*10;
                    res.json({"status":'true',"data":msgtrue,"message":"true","videobonus":snumber});
                    }
                    else{
                    var snumber = (Math.floor(Math.random() * (5 - 1 + 1) + 1))*10;
                    res.json({"status":'flase',"data":msgtrue,"message":zmsg,"videobonus":snumber});
                    }
                    
                }); //query end c1
            });//query end p1
        });//connection end
    
    }
    
    catch(ex){
    
    return next(ex);
    }
});
//15_septmber
router.post('/DailyScratchBonusFiveSix', function(req,res,next){
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                function leagueBonus(){
                    return new Promise(function(resolve, reject){

                    
                var query = conn.query("SELECT id, imei FROM `tb_users` WHERE id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function (err, result){
                if(err){
                
                res.json({"status":'false',"msg":'Something went wrong!1'});
                }
                //imei check start
                else{
                     if(result[0].id == reqObj.userid && result[0].imei == reqObj.imei){
                         conn.query("SELECT created_at FROM tb_bonuspoint WHERE userid = '"+reqObj.userid+"' and rewardName = 'dailybonus' and month(created_at) = month(now()) and year(created_at) = year(now()) and date(created_at) = date(now()) LIMIT 1", function(err, resultdaily){
                            if(err){
                                res.json({"status":'false',"msg":'Something went wrong!2'});
                                }
                                if(resultdaily.length>0){
                                    var snumber = (Math.floor(Math.random() * (10 - 1 + 1) + 1))*10;
                                    res.json({"status": "false", "randomnumber": snumber})
                                    
                                }
                                else{
                                    var snumber = (Math.floor(Math.random() * (10 - 1 + 1) + 1))*10;
                                    conn.query("INSERT INTO `tb_bonuspoint`(`userid`, `points`, `point_type`, `created_at`, `rewardName`, `rewardValue`, `surveyCPA`) VALUES ('"+reqObj.userid+"', '"+snumber+"', 13, NOW(), 'dailybonus', '"+snumber+"', 'dailybonus' )", function(err, resultinsert){
                                        if(err){
                                            res.json({"status":'false',"msg":'Something went wrong!3'});
                                        }

                                        conn.query("SELECT userid FROM `tb_newpoint` WHERE userid ='"+reqObj.userid+"'", function(err, resultiseridcheck){
                                            if(err){
                                                res.json({"status":'false',"msg":'Something went wrong!4'});
                                            }
                                            if(resultiseridcheck.length>0){
                                                conn.query("UPDATE `tb_newpoint` set bonus_point = bonus_point+'"+snumber+"', total_league_point= total_league_point+'"+snumber+"' where userid = '"+reqObj.userid+"'" , function(err, resultinsertnew){
                                                    if(err){
                                                        res.json({"status":'false',"msg":'Something went wrong!5'});
                                                    }
                                                    conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+snumber+"', 13, 0, 0, Now(), 1  )", function(err, resultinsert){
                                                        if(err){
                                                            res.json({"status":'false',"msg":'Something went wrong!6'});
                                                        }
                                                        //res.json({"status": "true", "randomnumber": snumber})
                                                        resolve(snumber)
                                                    });
                                                });
                                            }
                                            else{
                                                conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"', 0, '"+snumber+"', 0 , 0, '"+snumber+"', NOW() )", function(err, resultinsertnew){
                                                    if(err){
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+snumber+"', 13, 0, 0, Now(), 1  )", function(err, resultinsert){
                                                        if(err){
                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        //res.json({"status": "true", "randomnumber": snumber})
                                                        resolve(snumber)
                                                    });
                                                });
                                            }

                                    });
                                        

                                    });

                                }
                         });
                     }
                     //user not exi
                     else{
                         resolve(true)
                         res.json({"status": "flase", "msg": "Invaild user"})
                     }
                     ////user not exi
                }
                //imei check end

                });
            });
            }
                function challengeBonus(snumber){
                    return new Promise(function(resolve,reject) {
                        conn.query("select a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id  where a.userid='"+reqObj.userid+"' and b.challenge_status=1",function(err,challengeresult){
                            if(err){
                                
                                res.json({"status":"false","msg":"SOmething went wrong12!"});
    
                            }else{
                                //challenages start if
                                if(challengeresult.length>0){
                                    
                                    conn.query("SELECT step_points,created_at FROM tb_challengepoints where userid ='"+reqObj.userid+"'",function(err,chlngpointresult){
                                        if(err){
                                            res.json({"status": "false", "msg": "Somthing Went Wrong13"})
                                        }else{
                                            if(chlngpointresult.length>0){  
                                                conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"','"+snumber+"',13, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                                    if(err){    
                                                        res.json({"status": "false", "msg": "Somthing Went Wrong15"})
                                                    }
                                                    conn.query("UPDATE tb_challengepoints SET bonus_points= bonus_points+'"+snumber+"',total_challenge_points = total_challenge_points+'"+snumber+"' WHERE userid = '"+reqObj.userid+"'",function(err,updatestepsresult){
                                                        if(err){
                                                            
                                                            res.json({"status": "false", "msg": "Somthing Went Wrong16"})	
                                                        }
                                                    resolve(true);
                                                });// end of updatesteppoints query
                                                });// end of insertstepchlgpoints query
                                         }
                                         else{
                                           conn.query("INSERT INTO tb_challengepointsontime(userid, challenge_id, points,points_type,is_loggedIn,status,created_at) VALUES ('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"', s'"+snumber+"',13, 0, 0, NOW())",function(err,insertstepchlgpoints){
                                               if(err){    
                                                   res.json({"status": "false", "msg": "Somthing Went Wrong19"})
                                               }
                                               conn.query("insert into tb_challengepoints (userid, challenge_id, step_points,bonus_points,outdoor_points,total_challenge_points,created_at) values('"+reqObj.userid+"', '"+challengeresult[0].challenge_id+"',0,'"+snumber+"',0,'"+snumber+"',NOW())",function(err,inserted){
                                                   if(err){
                                                       
                                                       res.json({"status": "false", "msg": "Somthing Went Wrong20"})	
                                                   }
                                                  resolve(true);
                                                   
                                               });// end of inserted query
                                             });// end of insertstepchlgpoints query
                                           } // else if no data found 
                                        }
    
                                        });
                                }
                                else{
                                    resolve(true)
                                }
                                //challenages end if
                            }
                        }); 
                        //close challenges   
                    
                    });
                    //return promise
                }
                leagueBonus().then(function(data){
                    var league_data = data;
                    if(data){
                        challengeBonus(league_data).then(function(data){
                            var challenge_data = data;
                            res.json({"status": "true", "randomnumber": league_data})
                        })
                        ////challeng bonus end
                    }
                    //league bonus end if
          });    
                });
    
    }
    catch(ex){
    
    return next(ex);
    }
});

//New API
router.post('/ProductInsertEcomm', function(req,res,next){
    var reqObj = req.body;
 
     try{    
         req.getConnection(function(err, conn){
             //if connection start check
         if(err)
                {
                 res.json({"status":'false',"msg":'Something went wrong!'});
                }
       else
             {    
                 //image insert start 
                 
                var updateString ;
                var imagesFile = new Buffer(reqObj.pro_img, 'base64');
                    var timestamp  =  Date.now();
                    fs.writeFileSync("./Images/"+timestamp+".jpg", imagesFile);
                    if(updateString == ""){
                        updateString = "'"+defaultUrl+timestamp+".jpg'";
                    }
                    else{
                        updateString = "'"+defaultUrl+timestamp+".jpg'";
                    }
                    
                     //image insert end
                //insert product
                 conn.query("INSERT INTO `tb_product`(`product_name`, `pro_discription`, `qty`, `price`, `redeem_points`, `pro_img`, `offer`, `color`,`created_at`, `soldout` ) VALUES ('"+reqObj.product_name+"', '"+reqObj.pro_discription+"', '"+reqObj.qty+"','"+reqObj.price+"', '"+reqObj.redeem_points+"', "+updateString+", '"+reqObj.color+"', '"+reqObj.offer+"', NOW(), '"+reqObj.soldout+"')", (err, result_product)=>{
                    if(err){
                        res.json({"status": "false", "msg":"somthing went wrong"})
                    }
                    else{
                        res.json({"status":"true", "msg": "Product update"})
                    }
                  
                 });
                 //end insert product
             }
           //if connection end
         })
     }
     catch(ex){
     
     return next(ex);
     }
 });

//product select API 
router.post('/GetProductList', function(req,res,next){
    var reqObj = req.body;
 
     try{    
         req.getConnection(function(err, conn){
             //if connection start check
         if(err)
                {
                 res.json({"status":'false',"msg":'Something went wrong!'});
                }
       else
             {    
                //insert product
                 conn.query("SELECT imei FROM `tb_users` WHERE id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_usercheck){
 

                     if(err){
                         res.json({"status": "false", "msg":"somthing went wrong"})
                     }
                     else{
                         if(result_usercheck.length>0){
                            conn.query("select * from tb_product order by redeem_points desc", (err, result_product)=>{
                              if(err){
                                res.json({"status": "false", "msg":"somthing went wrong"})
                              }
                              else{
                                res.json({"status": "true", "result":result_product})
                              }
                            });
                         }
                         else{
                             res.json({"status": "false", "msg": "user is not register"})
                         }
                         
                     }
                         
                     
                 });
                 //end insert product
             }
           //if connection end
         })
     }
     catch(ex){
     
     return next(ex);
     }
 });
 //product select End API
 
 router.post('/updateversionandroid', function(req,res,next){

try{
var reqObj = req.body; 

req.getConnection(function(err, conn){
// var query = conn.query("SELECT * FROM `tb_version` " , function (err, result){
// if(err){
// 
// res.json({"status":'true',"msg":'display version',"query":query,"data":result});
// }

// if(result.length> 0){
var query = conn.query("UPDATE tb_version SET version = '"+reqObj.version+"'", function(err, result1){
res.json({"status":'true', 'msg': 'Update successful',"data":result1}); 
});

// }else{
// res.json({"status":'false',"msg":'No record found'});
// }

});

}
catch(ex){
// 
// return next(ex);
}
});
         
     
 router.post('/UserMctInsert', function(req,res,next){
             try{
                 var reqObj = req.body; 
                 req.getConnection(function(err, conn){ 
             
 
        var query = conn.query("SELECT userid from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
         // 
          if(err){
          
          res.json({"status":'false',"msg":'Something went wrong!'});
          }   
          if(result.length == 0){
         var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token,referral_code,is_loggedIn, disease, imei, isFbLogin) Values('"+reqObj.name+"','"+reqObj.email+"','','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+reqObj.referral_code+"', 1, '', '"+reqObj.imei+"', 1)", function (err, resultUpdate){
             if(err){
             
             res.json({"status":'false',"msg":'Something went wrong!'});
             }                       
             var insert_newtable = "insert into tb_newpoint(userid, points, bonus_point, outdoor_point, total_league_steps, total_league_point) Values('"+resultUpdate.insertId+"', 0, 0,0,0,0)"
             conn.query(insert_newtable, (err, resultnewp)=>{
                 if(err){
                     res.json({"status":'false',"msg":'Something went wrong1!'});
                 }
             });
             var insert_globalpoint = "insert into tb_globalpoint(userid, globalpoint) Values('"+resultUpdate.insertId+"',5)"
             conn.query(insert_globalpoint, (err, resultglobal)=>{
                 if(err){
                 
                 }
             });
             var userid=resultUpdate.insertId;
             res.json({"status":'true',"msg":'inserted!',"userid":userid});
          })
          }
          else{
             res.json({"status":'false',"msg":'Something went wrong2!'});
          }
          })
        // }//insert query
       })
             }catch(ex){
                 
             }
 })


 //user app information get
 router.post('/UserAppInfo', function(req,res,next){
     res.json({"status": "false", "message": "smothing went wrong"})
     return false;
    // try{
    //     var reqObj = req.body;
    //            req.getConnection(function(err, conn){
    //         var query = conn.query("select * from tb_usersapp where userid ='"+reqObj.userid+"'", function (err, resultApp){
    //             if(err){
    //             res.json({"status":'false',"message":'Something went wrong!'});
    //             }else{
    //                 //if check users already
    //                 if(resultApp.length>0){
    //                                     var newstring = reqObj.apps_name
    //                    conn.query('UPDATE `tb_usersapp` SET  apps_name = "'+newstring+'", updatedate =NOW() where userid = "'+reqObj.userid+'"', function(err, resultappchaild){
    //                        if(err){
    //                         res.json({"status":'false',"message":'Something went wrong!'});
    //                        }
    //                        else{
    //                         res.json({"status": "true", "message": "Record Successful Update" })
    //                        }
 
    //                    })
    //                 }//ifend length
    //                 else{

    //                     var newstring = reqObj.apps_name
    //                     conn.query('INSERT INTO `tb_usersapp`(`userid`, `apps_name`, `create_at`, `updatedate`) VALUES ("'+reqObj.userid+'", "'+newstring+'", NOW(), NOW())', function(err, resultappchaild){
    //                         if(err){
    //                          res.json({"status":'false',"message":'Something went wrong!22'});
    //                         }
    //                         else{
    //                             res.json({"status": "true", "message": "Record Successful Insert" })
    //                         }
  
    //                     })
    //                 }//else end
    //             }
    //         });//query end p1
    //     });//connection end
    
    // }
    
    // catch(ex){
    // 
    // return next(ex);
    // }
});

// dummy user points for challenge and league
router.post('/MCTUserUpdatePoint2', function(req,res,next){
    try{
     var reqObj = req.body;
	if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.points==undefined || reqObj.points==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.bonus_point==undefined || reqObj.bonus_point==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.outdoor_point==undefined || reqObj.outdoor_point==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
			}else if(reqObj.total_league_steps==undefined || reqObj.total_league_steps==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }
			else{
                    req.getConnection(function(err, conn){
                    var addpoint = (parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point));
                    //select start
                    var query = conn.query("SELECT userid,points from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
                        if(err){
                        res.json({"status":'false',"msg":'Something went wrong!'});
                        }else{
                            if(result.length>0){            
                                    var query = conn.query("Update tb_newpoint set points =  points+'"+reqObj.points+"', bonus_point =  bonus_point+'"+reqObj.bonus_point+"', outdoor_point =  outdoor_point+'"+reqObj.outdoor_point+"',total_league_steps =  '"+reqObj.total_league_steps+"', total_league_point= total_league_point+'"+addpoint+"' where userid = '"+reqObj.userid+"'", function (err, resultUpdate){
                                    if(err){
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                    else{
                                            var query = conn.query("update tb_challengepoints set step_points=step_points+'"+reqObj.points+"',bonus_points=bonus_points+'"+reqObj.bonus_point+"',outdoor_points=outdoor_points+'"+reqObj.outdoor_point+"',total_challenge_points=total_challenge_points+'"+addpoint+"' where userid='"+reqObj.userid+"'",function(err,result){
                                                if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else{
                                                    if(result.affectedRows===1){
                                                        res.json({"status":'true',"message":'Updated challenge and league points!'});
                                                    }else{
                                                        res.json({"status":'true',"message":'Updated league points!'});
                                                    }    
                                                }
                                            }) //end of query
                                                                 
                                    }
                                            
                                });//end update
                                        
                            }else{
                                conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"','"+reqObj.points+"','"+reqObj.bonus_point+"', '"+reqObj.outdoor_point+"','"+reqObj.total_league_steps+"','"+addpoint+"', NOW())",function(err,insert_tb_newpoint){
                                    if(err){
                                        res.json({"status":'false',"msg":'Something went wrong8!'});
                                    }else{
                                        var query = conn.query("update tb_challengepoints set step_points=step_points+'"+reqObj.points+"',bonus_points=bonus_points+'"+reqObj.bonus_point+"',outdoor_points=outdoor_points+'"+reqObj.outdoor_point+"',total_challenge_points=total_challenge_points+'"+addpoint+"' where userid='"+reqObj.userid+"'",function(err,result){
                                            if(err){
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else{
                                                if(result.affectedRows===1){
                                                    res.json({"status":'true',"message":'Updated challenge and insert league points!'});
                                                }else{
                                                    res.json({"status":'true',"message":'insert league points!'});
                                                }
                                                
                                            }
                                        }) //end of query
                                    }
                                        
                                }); // insert end

                            } // result.length else
                        } //end of else
                    }); // tb_newpoints user exist or not
                    
                    
                });// end of connection
			}
 }    
     catch(ex){
         
     }
 })
//dummy users bonus point
router.post('/MCTUserUpdatePointOnlyBonus', function(req,res,next){
    try{
     var reqObj = req.body;
	if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.points==undefined || reqObj.points==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.bonus_point==undefined || reqObj.bonus_point==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.outdoor_point==undefined || reqObj.outdoor_point==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
			}else if(reqObj.total_league_steps==undefined || reqObj.total_league_steps==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }
			else{
                    req.getConnection(function(err, conn){
                    var addpoint = (parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point));
                    //select start
                    var query = conn.query("SELECT userid,points from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
                        if(err){
                        res.json({"status":'false',"msg":'Something went wrong!'});
                        }else{
                            if(result.length>0){            
                                    var query = conn.query("Update tb_newpoint set points =  points+'"+reqObj.points+"', bonus_point =  bonus_point+'"+reqObj.bonus_point+"', outdoor_point =  outdoor_point+'"+reqObj.outdoor_point+"',total_league_steps =  '"+reqObj.total_league_steps+"', total_league_point= total_league_point+'"+addpoint+"' where userid = '"+reqObj.userid+"'", function (err, resultUpdate){
                                    if(err){
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                    else{
                                            var query = conn.query("update tb_challengepoints set step_points=step_points+'"+0+"',bonus_points=bonus_points+'"+reqObj.bonus_point+"',outdoor_points=outdoor_points+'"+0+"',total_challenge_points=total_challenge_points+'"+reqObj.bonus_point+"' where userid='"+reqObj.userid+"'",function(err,result){
                                                if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else{
                                                    if(result.affectedRows===1){
                                                        res.json({"status":'true',"message":'Updated challenge and league points!'});
                                                    }else{
                                                        res.json({"status":'true',"message":'Updated league points!'});
                                                    }    
                                                }
                                            }) //end of query
                                                                 
                                    }
                                            
                                });//end update
                                        
                            }else{
                                conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"','"+reqObj.points+"','"+reqObj.bonus_point+"', '"+reqObj.outdoor_point+"','"+reqObj.total_league_steps+"','"+addpoint+"', NOW())",function(err,insert_tb_newpoint){
                                    if(err){
                                        res.json({"status":'false',"msg":'Something went wrong8!'});
                                    }else{
                                        var query = conn.query("update tb_challengepoints set step_points=step_points+'0',bonus_points=bonus_points+'"+reqObj.bonus_point+"',outdoor_points=outdoor_points+'0',total_challenge_points=total_challenge_points+'"+reqObj.bonus_point+"' where userid='"+reqObj.userid+"'",function(err,result){
                                            if(err){
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else{
                                                if(result.affectedRows===1){
                                                    res.json({"status":'true',"message":'Updated challenge and insert league points!'});
                                                }else{
                                                    res.json({"status":'true',"message":'insert league points!'});
                                                }
                                                
                                            }
                                        }) //end of query
                                    }
                                        
                                }); // insert end

                            } // result.length else
                        } //end of else
                    }); // tb_newpoints user exist or not
                    
                    
                });// end of connection
			}
 }    
     catch(ex){
         
     }
 })

 //mct insentive users 
 
//01_oct
router.post('/HomeScreenDataVsOneSeven', function(req,res,next){
    try{    
       var reqObj = req.body;
        req.getConnection(function(err, conn){
        if(err)
        {
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
              conn.query("SELECT (SELECT COUNT(*)+1 FROM tb_newpoint WHERE total_league_point>a.total_league_point)as rank,a.userid, ifnull(a.total_league_point,0) as leaguepoints, ifnull(a.points,0) as leaguestepscount,ifnull(a.outdoor_point,0) as outdoor_point, ifnull(a.bonus_point,0) as bonus_point FROM tb_newpoint as a right join tb_users as b on b.id=a.userid WHERE a.userid='"+reqObj.userid+"'", function (err, data){
                    if(err){
                    res.json({"status":'false',"msg":'Something went wrong!2'});
                     }
                          conn.query("SELECT IFNULL(SUM(points),0) as globalpoint from tb_points WHERE userid = '"+reqObj.userid+"'",(err, result1)=>{
                            if(err){
                                res.json({"status": "false"})
                             }
                              var global_point = parseFloat((result1[0].globalpoint/10000).toFixed(2));
                              var update_globalpoint = (global_point+5).toFixed(2);
                              conn.query("select userid  from tb_globalpoint where userid = '"+reqObj.userid+"'", function(err, resultcoin){
                                           if(err){
                                               res.json({"status": "false"})
                                           } 
                                           else{
                                               if(resultcoin.length>0){
                                                   conn.query("UPDATE `tb_globalpoint` SET globalpoint ='"+result1[0].globalpoint+"', walkifycoin = '"+update_globalpoint+"' where userid = '"+reqObj.userid+"'", function(err, resultupdate){
                                                       if(err){
                                                        res.json({"status": "false3"})
                                                       }
                                                   })
                                               }else{
                                                conn.query("INSERT INTO `tb_globalpoint` (`userid`, `globalpoint`, `walkifycoin`, `created_at`) VALUES ('"+reqObj.userid+"', '"+update_globalpoint+"', '"+update_globalpoint+"', NOW())", function(err, resultupdate){
                                                    if(err){
                                                     res.json({"status": "false2"})
                                                    }
                                                })
                                               }
                                               
                                           }
                              })
                                conn.query("SELECT COUNT(userid) as videocount, COUNT(userid) as leaguevideocount FROM `tb_bonuspoint` WHERE  DATE(created_at) = CURDATE() and userid ='"+reqObj.userid+"' and rewardName='video'",(err, result3)=>{
                                    if(err){
                                        res.json({"status": "false2"})
                                     }
                                      conn.query("SELECT * FROM `tb_notwinner` WHERE claim_status = 1 AND userid = '"+reqObj.userid+"'",(err, result4)=>{
                                        if(err){
                                            res.json({"status": "false2"})
                                         }
                                         conn.query("SELECT COUNT(userid) as leaguevideocount FROM `tb_bonuspoint` WHERE  userid ='"+reqObj.userid+"' and rewardName='video'",(err, result5)=>{
                                            if(err){
                                                
                                             }

                                             conn.query("SELECT userid FROM `tb_notwinner` WHERE userid = '"+reqObj.userid+"'",(err, result6)=>{
                                                if(err){
                                                    
                                                 }

                                    var responseData = {};
                                    if(data.length>0){
                                        responseData.rank = data[0].rank;
                                    } else {
                                        responseData.rank = 0;
                                    }
                                                
                                    if(data.length>0){
                                        responseData.leaguepoints = data[0].leaguestepscount;
                                        responseData.leaguestepscount = data[0].leaguestepscount;
                                    }
                                    else{
                                        responseData.leaguestepscount = 0;
                                    }
                                    if(result1.length>0){
                                        responseData.globalpoint = result1[0].globalpoint;
                                    }
                                    else{
                                        responseData.globalpoint = 0;
                                    }
                 
                                    
                                     if(data.length>0){
                                        responseData.outdoorpoint = data[0].outdoor_point;
                                        responseData.bonuspoint = data[0].bonus_point;
                                     }else{
                                        responseData.outdoorpoint = 0;
                                        responseData.bonuspoint = 0;
                                     }
                                    
                                     responseData.videocount = result3[0].videocount;
                                     responseData.leaguevideocount = result5[0].leaguevideocount;
                                    
                                    responseData.videodigit=10
                                    responseData.surveydigit = 2000;
                                    responseData.maxvideolimit = 0;
                                    responseData.dailymaxvideolimit = 100;
                                    responseData.walkifycoin = update_globalpoint.toString();
									 responseData.accuracy = 70;
									responseData.speed = 1;
                                    responseData.mapscreen = 1;
                                    responseData.LocationSpeedios  = 3.0;
                                    responseData.LocationAccuracyios = 40.0;
                                    responseData.speedlimitandroid = 6;
                                    responseData.rupee = 2;
                                    if(result4.length>0){
                                        
                                        responseData.walkifyclaim = 1;
                                    }
                                    else{
                                        if(result6.length>0){
                                            responseData.walkifyclaim = 0;
                                        }else{
                                            responseData.walkifyclaim = 1;
                                        }
                                        
                                    }

                                     res.json({"status":'true', "data": responseData });
                                    });
                                });
                                });
                                });
                          });
                    });
        }
        })
    }
    catch(ex){
    
    return next(ex);
    }
});

router.post('/WalkifyWinnerPrice', function(req,res,next){    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    conn.query("select imei from tb_users  where id= '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", (err, ressulimei)=>{
                        if(err){
                          res.json({"status": "false", "message": err})
                        }else{
                            if(ressulimei.length>0){
                                conn.query("select * from tb_notwinner where claim_status = 0 and userid = '"+reqObj.userid+"'", (err, resultcheck)=>{
                                    if(err){
                                        res.json({"status": "false", "message": err})
                                      }else{
                                          if(resultcheck.length>0){
                                                    conn.query("SELECT userid FROM `tb_challenge_wallet` where userid = '"+reqObj.userid+"'", (err, resultuserid)=>{
                                                        if(err){
                                                            res.json({"status": "false", "message": err})
                                                        }
                                                        else{
                                                            if(resultuserid.length>0){
                                                                conn.query("UPDATE `tb_challenge_wallet` SET `amount` = amount+'2', updated_at = NOW() WHERE `userid` = '"+reqObj.userid+"'", function(err, resultudpatewallet){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": err})
                                                                     }
                                                                     else{
                                                                        var query = conn.query("insert into tb_wallet(userid, amount) Values('"+reqObj.userid+"', '2')", function (err, result){
                                                                            if(err){
                                                                                res.json({"status": "false", "message": err})
                                                                            }
                                                                            else{
                                                                                conn.query("UPDATE tb_notwinner set claim_status = 1 WHERE userid = '"+reqObj.userid+"'", (err, resultupdate)=>{
                                                                                    if(err){
                                                                                        res.json({"status": "false", "message": err})
                                                                                    }else{
                                                                                        res.json({"status": "true", "message": "league participation price 2 rupees"})
                                                                                    }
                                                                                });
                                                                                
                                                                            }
                                                                            });
                                                                     }
                                                                 });
                                                            }else{
                                                                conn.query("INSERT INTO `tb_challenge_wallet` (`userid`, `amount`, `created_at`, `updated_at`) VALUES ('"+reqObj.userid+"', '2', NOW(), NOW())", function(err, resultudpatewallet){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": err})
                                                                     }
                                                                     else{
                                                                        var query = conn.query("insert into tb_wallet(userid, amount) Values('"+reqObj.userid+"','2')", function (err, result){
                                                                            if(err){
                                                                                res.json({"status": "false", "message": err})
                                                                            }else{
                                                                                conn.query("UPDATE tb_notwinner set claim_status = 1 WHERE userid = '"+reqObj.userid+"'", (err, resultupdate)=>{
                                                                                    if(err){
                                                                                        res.json({"status": "false", "message": err})
                                                                                    }else{
                                                                                        res.json({"status": "true", "message": "league participation price 2 rupees"})
                                                                                    }
                                                                                });
                                                                            }
                                                                            });
                                                                     }
                                                                 });
                                                            }
                                                        }
                                                    })
                                            
                                            
                                          }else{
                                             res.json({"status": "false", "message": "Already claim"})
                                          }
                                           
                                      }

                                }) //user claim already
                            }
                            else{
                                res.json({"status": "false", "message": "Not Register users"})
                            }
                        }
                    })
               })     
    
    }
    catch(ex){
    
    return next(ex);
    }
});

//Mct insentive user check if have or not
router.post('/InsentiveUser', function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){  
                conn.query("select id, imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"' and incentive = '1'", function (err, result){
                  if(err){
                     res.json({"status":'false',"msg":err});
                  }else{
                      if(result.length>0){
                        res.json({"status": "true", "message": "Mct insentive users"})  
                      }else{
                         res.json({"status": "false", "message": "Not Mct insentive users"})
                       }
                  }
                  });
                });
    
    }
    catch(ex){
    
    return next(ex);
    }
});
//check QR code valid
router.post('/checkValidQRCode', function(req,res,next){
    try{
         var reqObj = req.body;
         if(reqObj.userid==undefined || reqObj.userid==''){
             res.json({"status":'false',"message":'Request parameter is missing1'});
             return false;
         }else if(reqObj.imei==undefined || reqObj.imei==''){
             res.json({"status":'false',"message":'Request parameter is missing2'});
             return false;
         }else if(reqObj.qr_code==undefined || reqObj.qr_code==''){
             res.json({"status":'false',"message":'Request parameter is missing3'});
             return false;    
         }else{
         req.getConnection(function(err, conn){
             
         var query = conn.query("select * from tb_users where id ='"+reqObj.userid+"' and imei='"+reqObj.imei+"'", function (err, resultApp){ 
           //  console.log(resultApp); 
             if(err){
                 res.json({"status":'false',"message":'Something went wrong!1'});
             }else{
                     if(resultApp.length>0  && resultApp[0].incentive == 1 && resultApp[0].imei == reqObj.imei){
                         if(resultApp[0].id== reqObj.userid){
                         conn.query("select * from tb_merchant where merchant_code='"+reqObj.qr_code+"'",function(err,resultmerchant){
                             if(err){          
                                     res.json({"status":"true","message":"Something went wrong!1"})
                             }else{
                                 if(resultmerchant.length>0){
                                     if(resultmerchant[0].merchant_code == reqObj.qr_code){
                                         res.json({"status":"true","message":"your Qr code code is valid"})
                                     }else{ 
                                         res.json({"status":"false","message":"Qr code is not matched"})
                                     }                                  
                             }else{
                                 res.json({"status":"false","message":"your Qr code is Invalid"})
                             }
                              //end of else 8131
                             }
                         }) //end of query 8119
                     }else{
                         res.json({"status":"false","message":"userid not matched"})
                     }
                     }else{
                         res.json({"status":"false","message":"org id and imei is wrong"})
                     }
         } //end of else 8115
          
         }) // end of 8112
            //query end p1
         
         });//connection end
         } //end of else 8110
     }    
     catch(ex){
     
     return next(ex);
     }
 });
 
 //check insentive balance
 router.post('/IncentiveAvailableBalance',function(req,res,next){
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing1'});
            return false;
        }else if(reqObj.imei==undefined || reqObj.imei==''){
            res.json({"status":'false',"message":'Request parameter is missing2'});
            return false;
        }else{
        req.getConnection(function(err, conn){     
        var query = conn.query("select * from tb_mindcrew where userid ='"+reqObj.userid+"'", function (err, resultApp){ 
            
            if(err){
                res.json({"status":'false',"message":'Something went wrong!1'});
            }else{
                if(resultApp.length>0){
                    conn.query("select imei from tb_users where id='"+reqObj.userid+"' and  incentive= 1",function(err,resultimei){
                    if(resultimei[0].imei == reqObj.imei){
                        //total_amount
                        var bal = resultApp[0].total_amount
                        res.json({"status":"true","balance":bal,"message":"Insufficent Balance"})
                                
            }else{
                        res.json({"status":"false","balance":"0.00","message":"imei not match"})
                    }
             })// end of query
            }else{
                res.json({"status":"false","balance":"0.00","message":"Insufficent Balance"})
            }
                }        
            })         
        }) // end of 8112
           //query end p1
    }
         //end of else 8110
    }catch(ex){
    
    return next(ex);
    }    
})
 
 //check insentive amount
 
// router.post('/IncentiveSpendAmount',function(req,res,next){ 
//     try{
//         var reqObj = req.body;
//         if(reqObj.userid==undefined || reqObj.userid==''){
//             res.json({"status":'false',"message":'Request parameter is missing1'});
//             return false;
//         }else if(reqObj.imei==undefined || reqObj.imei==''){
//                 res.json({"status":'false',"message":'Request parameter is missing2'});
//                 return false;    
//         }else if(reqObj.qr_code==undefined || reqObj.qr_code==''){
//             res.json({"status":'false',"message":'Request parameter is missing2'});
//             return false;
//         }else if(reqObj.amount==undefined || reqObj.amount==''){
//             res.json({"status":'false',"message":'Request parameter is missing2'});
//             return false;
//         }else{
//             req.getConnection(function(err, conn){     
//                 var query = conn.query("select * from tb_mindcrew where userid ='"+reqObj.userid+"'",function (err, resultApp){ 
//                     if(err){
//                         res.json({"status":"false","msg":"something went wrong1"})
//                     }else{
//                     if(resultApp.length>0){
//                         conn.query("select imei from tb_users where id='"+reqObj.userid+"' and incentive =1",function(err,resultimei){
//                             if(err){
//                                 res.json({"status":"false","msg":"something went wrong2"})
//                             }else{
//                             if(resultimei[0].imei == reqObj.imei){
//                                 conn.query("select merchant_code from tb_merchant",function(err,resqr_code){
//                                     if(err){
//                                         res.json({"status":"false","msg":"something went wrong2"})
//                                     }else{
//                                     if(resqr_code[0].merchant_code == reqObj.qr_code){
//                                         if(resultApp[0].total_amount!=0){
//                                             if(resultApp[0].total_amount>=reqObj.amount){
//                                         var balance = (parseFloat((resultApp[0].total_amount-reqObj.amount)).toFixed(2));
//                                         conn.query("update tb_mindcrew set total_amount='"+balance+"', spend_amount=spend_amount+'"+reqObj.amount+"' where userid='"+reqObj.userid+"'",function(err,restoat){
//                                             if(err){
//                                                 res.json({"status":"false","message":err});
//                                             }  else{
//                                                 conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '0', '"+reqObj.amount+"', '1', NOW())", (err, resultinsert)=>{
//                                                     if(err){
//                                                         res.json({"status":"false","message":err});
//                                                     }else{
//                                                         conn.query("update tb_contratct set merchant_amount	= merchant_amount+'"+reqObj.amount+"'", (err, resultupdatecontract)=>{
//                                                             if(err){
//                                                                 res.json({"status":"false","message":err});
//                                                             }else{
//                                                                 res.json({"status":"true","message":"Thanks for spending money at Canteen"});
//                                                             }
//                                                         });
//                                                     }
//                                                 });
//                                             }
//                                         })
//                                         }else{
//                                             res.json({"status":"false","message":"Total amount is greater than amount"});    
//                                         }
//                                     }else{
//                                         res.json({"status":"false","message":"You have zero in wallet"});
//                                     }
//                                     }else{
//                                         res.json({"status":"false","message":"Qrcode is invalid"});
//                                     }
//                                 }
//                                 })
//                             }else{
//                                 res.json({"status":"false","message":"Imei is wrong"});
//                             }
//                         }
//                         })
//                     }else{
//                         res.json({"staus":"false","message":"Result not found"});
//                     }
//                 }
//                 })   
//             })
//         }
//     }catch(err){
    
//     return next(ex);
//     }
// })
//01_oct
//mct steps 

router.post('/MctUserStepsPoint', function(req,res,next){    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    
                          
                    function addStepsCount1() {
    return new Promise(function(resolve,reject) { 
        conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"' and incentive = 1", function(err, result_imei){
                 if(err){
                     res.json({"status": "false", "message": "Somthing Went Wrong"})
                 }
                 //imei check
                 else{
                     //imei check > 0
                     var d = new Date();
                     if((d.getMonth()+1)<10){
                        if(d.getDate()<10){
                            var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-0" +d.getDate();
                        }
                        else{
                            var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
                        }
                       
                    } 
                    else{
                        
                        if(d.getDate()<10){
                            var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-0" +d.getDate();
                        }
                        else{
                            var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
                        }
                    }
                        if(datestring == reqObj.CurrentDate){
                     if(result_imei.length>0){
                         conn.query("SELECT userid FROM `tb_mindcrew` where userid = '"+reqObj.userid+"'", function(err, result_userid){
                             if(err){
                                res.json({"status": "false", "message": "Somthing Went Wrong"})     
                             }
                             else{
                                 //point table check last date
                                 if(result_userid.length > 0){
                                     conn.query("SELECT IFNULL(sum(points), 0) as points, IFNULL(DATE_FORMAT(create_at, '%Y,-%m-%d'), 0) as created_at FROM tb_mctpointhistory WHERE userid = '"+reqObj.userid+"' and status = 0 and create_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1", function(err, result_lasttime){
                                        if(result_lasttime.length>0){
                                            if(reqObj.StepCount>result_lasttime[0].points){
                                                
                                                conn.query("select * from tb_mindcrew  WHERE userid = '"+reqObj.userid+"'", function(err, point_check){
                                                    if(err){
                                                        res.json({"status": "false", "message": err})
                                                    }else{
                                                        if(point_check.length>0){
                                                            

                                                          var point_table =   point_check[0].steps
                                                          if(point_table<60000){
                                                            var old_steps = result_lasttime[0].points;
                                                            var new_steps = reqObj.StepCount;
                                                            var updated_stps = (new_steps - old_steps);
                                                            console.log(updated_stps,"7497");

                                                            var minussteps = 60000-point_table;
                                                             if(updated_stps>minussteps){
                                                                updated_stps = minussteps;
                                                                console.log(updated_stps,"7502");
                                                                var newmony = parseFloat(updated_stps*0.005).toFixed(2)
                                                             }
                                                             else{
                                                                var old_steps = result_lasttime[0].points;
                                                                console.log(result_lasttime[0].points);
                                                                var new_steps = reqObj.StepCount;
                                                                var updated_stps = (new_steps - old_steps);
                                                                console.log(updated_stps);
                                                                updated_stps = updated_stps
                                                                console.log(updated_stps,"updated_stps");
                                                                var newmony = parseFloat(updated_stps*0.005).toFixed(2)
                                                             }
                                                          }
                                                          else if(point_table>=60000){
                                                         var   newmony = 0;
                                                          var  updated_stps = 0;
                                                           resolve(true)
                                                          }
                                                          conn.query("UPDATE tb_mindcrew SET total_amount=total_amount+'"+newmony+"', ern_amount = ern_amount+'"+newmony+"', steps = steps+'"+updated_stps+"'  WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                            
                                                            if(err){
                                                                res.json({"status": "false", "message": err})
                                                            }
                                                            else{
                                                                var newinsert = conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+updated_stps+"', '"+newmony+"', '0', NOW())", function(err, result_update)
                                                                {
                                                                console.log("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+updated_stps+"', '"+newmony+"', '0', NOW())")
                                                                    resolve(true)
                                                                });
                                                            }
                                                                
                                                        });
                                                        }
                                                        
                                                
                                                    }
                                                
                                            });
                                            }else{
                                                res.json({"status": "false", "message": "steps not correct or same"});
                                            }
                                            
                                        }
                                        //point table check last date
                                        //else last date 
                                        else{
                                            
                                               conn.query("select * from tb_mindcrew  WHERE userid = '"+reqObj.userid+"'", function(err, point_check){
                                                if(err){
                                                    res.json({"status": "false", "message": err})
                                                }else{
                                                    if(point_check.length>0){
                                                      var point_table =   point_check[0].steps
                                                      if(point_table<60000){
                                                        var old_steps = result_lasttime[0].points;
                                                        var new_steps = reqObj.StepCount;
                                                        var updated_stps = (new_steps - old_steps);
                                                        var minussteps = 60000-point_table;
                                                         if(updated_stps>minussteps){
                                                            var old_steps = result_lasttime[0].points;
                                                            var new_steps = reqObj.StepCount;
                                                            var updated_stps = (new_steps - old_steps);
                                                            updated_stps = minussteps;
                                                            var newmony = parseFloat(updated_stps*0.005).toFixed(2)
                                                         }else{
                                                            updated_stps = updated_stps
                                                            var newmony = parseFloat(updated_stps*0.005).toFixed(2)
                                                         }
                                                      }
                                                      else if(point_table>60000){
                                                      resolve(true)
                                                      }
                                                    }
                                                }
                                            
                                        
                                               
                                        conn.query("UPDATE tb_mindcrew SET total_amount=total_amount+'"+newmony+"', ern_amount = ern_amount+'"+newmony+"', steps = steps+'"+updated_stps+"'  WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                            if(err){
                                                res.json({"status": "false", "message": "Somthing Went Wrong"})
                                            }
                                            conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+updated_stps+"', '"+newmony+"', '0', NOW())", function(err, result_update)
                                                    {
                                                        if(err){    
                                                            res.json({"status": "false", "message": "Somthing Went Wrong2"})
                                                        }
                                                    });
                                            
                                               resolve(true);
                                        });
                                    });
                                         //
                                        }
                                        //else last date
                                     });
                                  
                                }
                                 else{
                                    if(reqObj.StepCount>=60000){
                                        reqObj.StepCount=60000;
                                    }
                                    var newmony = parseFloat(reqObj.StepCount*0.005).toFixed(2)
                                    conn.query("INSERT INTO `tb_mindcrew` (`userid`, `total_amount`, `spend_amount`, `ern_amount`, `created_at`, `steps`) VALUES ('"+reqObj.userid+"', '"+newmony+"', 0, '"+newmony+"',  NOW(), '"+reqObj.StepCount+"');", function(err, result_insert){
                                        if(err){
                                            res.json({"status": "false", "message": err})
                                        }
                                        conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+reqObj.StepCount+"', '"+newmony+"', '0', NOW())", function(err, result_update){
                                            if(err){    
                                                res.json({"status": "false", "message": err})
                                            }
                                            resolve(true)
                                        });
                                      

                                    });  
                                    
                                 }
                             }
                             
                         });
                         
                         
                     }else{
                        res.json({"status": "false", "message": "user is not organisation"})
                     }
                    }
                     
                     //imei check > 0
                     else{
                         res.json({"status": "false", "message": "user not exist"})
                     }
                 }
                 //imei check
        });
    })
                         }      
                        addStepsCount1().then(function(data) {
                          if(data== true){  
                            res.json({"status":'true',"message":'Update steps'});
                            }
                            else{
                                res.json({"status":'false',"message":'Something went wrong!'});
                            }
                          }); 
               })     
    
    }
    catch(ex){
    
    return next(ex);
    }
});



// router.post('/MctUserStepsPoint', function(req,res,next){    
//     try{
//     var reqObj = req.body;        
//             req.getConnection(function(err, conn){
                    
                          
//                     function addStepsCount1() {
//     return new Promise(function(resolve,reject) { 
//         conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"' and incentive = 1", function(err, result_imei){
//                  if(err){
//                      res.json({"status": "false", "message": "Somthing Went Wrong"})
//                  }
//                  //imei check
//                  else{
//                      //imei check > 0
//                      var d = new Date();
//                      if((d.getMonth()+1)<10){
//                         if(d.getDate()<10){
//                             var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-0" +d.getDate();
//                         }
//                         else{
//                             var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
//                         }
                       
//                     } 
//                     else{
                        
//                         if(d.getDate()<10){
//                             var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-0" +d.getDate();
//                         }
//                         else{
//                             var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
//                         }
//                     }
//                         if(datestring == reqObj.CurrentDate){
//                      if(result_imei.length>0){
//                          conn.query("SELECT userid FROM `tb_mindcrew` where userid = '"+reqObj.userid+"'", function(err, result_userid){
//                              if(err){
//                                 res.json({"status": "false", "message": "Somthing Went Wrong"})     
//                              }
//                              else{
//                                  //point table check last date
//                                  if(result_userid.length > 0){
//                                      conn.query("SELECT IFNULL(sum(points), 0) as points, IFNULL(DATE_FORMAT(create_at, '%Y,-%m-%d'), 0) as created_at FROM tb_mctpointhistory WHERE userid = '"+reqObj.userid+"' and status = 0 and create_at LIKE '%"+reqObj.CurrentDate+"%' ORDER BY id DESC LIMIT 1", function(err, result_lasttime){
//                                         if(result_lasttime.length>0){
//                                             if(reqObj.StepCount>result_lasttime[0].points){
                                                
                                                        
                                                       
//                                                 conn.query("select * from tb_mindcrew  WHERE userid = '"+reqObj.userid+"'", function(err, point_check){
//                                                     if(err){
//                                                         res.json({"status": "false", "message": err})
//                                                     }else{
//                                                         if(point_check.length>0){
                                                            

//                                                           var point_table =   point_check[0].steps
//                                                           if(point_table<60000){
//                                                             var old_steps = result_lasttime[0].points;
//                                                             var new_steps = reqObj.StepCount;
//                                                             var updated_stps = (new_steps - old_steps);

//                                                             var minussteps = 60000-point_table;
//                                                              if(updated_stps>minussteps){
//                                                                 updated_stps = minussteps;
//                                                                 var newmony = parseFloat(updated_stps*0.005).toFixed(2)
//                                                              }
//                                                              else{
//                                                                 var old_steps = result_lasttime[0].points;
//                                                                 var new_steps = reqObj.StepCount;
//                                                                 var updated_stps = (new_steps - old_steps);
//                                                                 updated_stps = updated_stps
//                                                                 var newmony = parseFloat(updated_stps*0.005).toFixed(2)
//                                                              }
//                                                           }
//                                                           else if(point_table>60000){
//                                                            resolve(true)
//                                                           }
//                                                         }
//                                                     }
                                                
                                                  
                                                       
//                                                 conn.query("UPDATE tb_mindcrew SET total_amount=total_amount+'"+newmony+"', ern_amount = ern_amount+'"+newmony+"', steps = steps+'"+updated_stps+"'  WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
//                                                     if(err){
//                                                         res.json({"status": "false", "message": err})
//                                                     }
//                                                     conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+updated_stps+"', '"+newmony+"', '0', NOW())", function(err, result_update)
//                                                     {
//                                                         if(err){    
//                                                             res.json({"status": "false", "message": "Somthing Went Wrong2"})
//                                                         }
//                                                     });
                                                    
//                                                         resolve(true);
//                                                 });
//                                             });
//                                             }else{
//                                                 res.json({"status": "false", "message": "steps not correct league"});
//                                             }
                                            
//                                         }
//                                         //point table check last date
//                                         //else last date 
//                                         else{
                                            
//                                                conn.query("select * from tb_mindcrew  WHERE userid = '"+reqObj.userid+"'", function(err, point_check){
//                                                 if(err){
//                                                     res.json({"status": "false", "message": err})
//                                                 }else{
//                                                     if(point_check.length>0){
//                                                       var point_table =   point_check[0].steps
//                                                       if(point_table<60000){
//                                                         var old_steps = result_lasttime[0].points;
//                                                         var new_steps = reqObj.StepCount;
//                                                         var updated_stps = (new_steps - old_steps);
//                                                         var minussteps = 60000-point_table;
//                                                          if(updated_stps>minussteps){
//                                                             var old_steps = result_lasttime[0].points;
//                                                             var new_steps = reqObj.StepCount;
//                                                             var updated_stps = (new_steps - old_steps);
//                                                             updated_stps = minussteps;
//                                                             var newmony = parseFloat(updated_stps*0.005).toFixed(2)
//                                                          }else{
//                                                             updated_stps = updated_stps
//                                                             var newmony = parseFloat(updated_stps*0.005).toFixed(2)
//                                                          }
//                                                       }
//                                                       else if(point_table>60000){
//                                                       resolve(true)
//                                                       }
//                                                     }
//                                                 }
                                            
                                        
                                               
//                                         conn.query("UPDATE tb_mindcrew SET total_amount=total_amount+'"+newmony+"', ern_amount = ern_amount+'"+newmony+"', steps = steps+'"+updated_stps+"'  WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
//                                             if(err){
//                                                 res.json({"status": "false", "message": "Somthing Went Wrong"})
//                                             }
//                                             conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+updated_stps+"', '"+newmony+"', '0', NOW())", function(err, result_update)
//                                                     {
//                                                         if(err){    
//                                                             res.json({"status": "false", "message": "Somthing Went Wrong2"})
//                                                         }
//                                                     });
                                            
//                                                resolve(true);
//                                         });
//                                     });
//                                          //
//                                         }
//                                         //else last date
//                                      });
                                  
//                                 }
//                                  else{
//                                     if(reqObj.StepCount>=60000){
//                                         reqObj.StepCount=60000;
//                                     }
//                                     var newmony = parseFloat(reqObj.StepCount*0.005).toFixed(2)
//                                     conn.query("INSERT INTO `tb_mindcrew` (`userid`, `total_amount`, `spend_amount`, `ern_amount`, `created_at`, `steps`) VALUES ('"+reqObj.userid+"', '"+newmony+"', 0, '"+newmony+"',  NOW(), '"+reqObj.StepCount+"');", function(err, result_insert){
//                                         if(err){
//                                             res.json({"status": "false", "message": err})
//                                         }
//                                         conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '"+reqObj.StepCount+"', '"+newmony+"', '0', NOW())", function(err, result_update){
//                                             if(err){    
//                                                 res.json({"status": "false", "message": err})
//                                             }
//                                             resolve(true)
//                                         });
                                      

//                                     });  
                                    
//                                  }
//                              }
                             
//                          });
                         
                         
//                      }else{
//                         res.json({"status": "false", "message": "user is not organisation"})
//                      }
//                     }
                     
//                      //imei check > 0
//                      else{
//                          res.json({"status": "false", "message": "user not exist"})
//                      }
//                  }
//                  //imei check
//         });
//     })
//                          }      
//                         addStepsCount1().then(function(data) {
//                           if(data== true){  
//                             res.json({"status":'true',"message":'Update steps'});
//                             }
//                             else{
//                                 res.json({"status":'false',"message":'Something went wrong!'});
//                             }
//                           }); 
//                })     
    
//     }
//     catch(ex){
    
//     return next(ex);
//     }
// });


router.post('/IncentiveEarnHistory', function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){  
                conn.query("select id, imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"' and incentive = '1'", function (err, result){
                  if(err){
                     res.json({"status":'false',"msg":err});
                  }else{
                      if(result.length>0){
                        conn.query("SELECT CAST(points as char(255)) as steps, IFNULL(earn_amount, '0') AS earnamount, DATE_FORMAT(create_at, '%Y-%m-%d %H:%i:%s')  as earndate from tb_mctpointhistory  WHERE userid =  '"+reqObj.userid+"' and status =0 and points<>0 and earn_amount<>0 order by earndate desc", (err, result)=>{
                              if(err){
                                  res.json({"status": "false", "message": err})
                              }else{
                                conn.query("SELECT ern_amount from tb_mindcrew  WHERE userid ='"+reqObj.userid+"'", (err, resultearn)=>{
                                    if(err){
                                        res.json({"status": "false", "message": err})
                                    }else{
                                        if(result.length>0 && resultearn.length>0){
                                            res.json({"status":"true","data":(result),"totalearn":(resultearn[0].ern_amount).toString()})
                                        }
                                        else{
                                            res.json({"status":"false","data":(result),"totalearn":"0"})
                                        }
                                        
                                    }     
                                })
                                
                              }
                        });
                      }else{
                         res.json({"status": "false", "message": "Not Mct insentive users"})
                       }
                  }
                  });
                });
    
    }
    catch(ex){
    
    return next(ex);
    }
});


router.post('/IncentiveSpendHistory', function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){  
                conn.query("select id, imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"' and incentive = '1'", function (err, result){
                  if(err){
                     res.json({"status":'false',"msg":err});
                  }else{
                      if(result.length>0){
                        conn.query("SELECT IFNULL(earn_amount, '0') AS spendamount, DATE_FORMAT(create_at, '%Y-%m-%d %H:%i:%s')  as spenddate FROM tb_mctpointhistory WHERE userid = '"+reqObj.userid+"' and status = 1 and status =1 and earn_amount<>0 order by create_at desc", (err, resultspend)=>{
                              if(err){
                                  res.json({"status": "false", "message": err})
                              }else{
                            conn.query("SELECT spend_amount from tb_mindcrew  WHERE userid ='"+reqObj.userid+"'", (err, result)=>{
                                if(err){
                                    res.json({"status": "false", "message": err})
                                }else{
                                    if(resultspend.length>0 && result.length>0){
                                        res.json({"status": "true", "data": (resultspend),"totalspend":(result[0].spend_amount).toString()})
                                    }else{
                                        res.json({"status": "false", "data": (resultspend),"totalspend":"0"})
                                    }
                                    
                                }
                                })
     
                              }
                        });
                      }else{
                         res.json({"status": "false", "message": "Not Mct insentive users"})
                       }
                  }
                  });
                });
    
    }
    catch(ex){
    
    return next(ex);
    }
});


router.post('/getleagueandchallengePoints', function(req,res,next){
    try{
            var reqObj = req.body;
            if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){ 
                     var query = conn.query("select userid,points,bonus_point,outdoor_point,total_league_point from tb_newpoint where userid='"+reqObj.userid+"'",function(err,result){
                             if(err){
                                res.json({"status":'false',"message":'Something went wrong1!'});
                              }else{
                                  if(result.length>0){
                                      conn.query("select userid,step_points,bonus_points,outdoor_points,total_challenge_points from tb_challengepoints where userid='"+reqObj.userid+"'",function(err,result2){
                                          if(err){
                                            res.json({"status":'false',"message":'Something went wrong2!'});
                                          }else{
                                              if(result2.length>0){
                                                  res.json({"status":"true","leaguedata":result,"challengedata":result2});
                                              }else{
                                                  res.json({"status":"true","leaguedata":result});
                                              }
                                          }
                                      }) //end of result2 query
                                  }else{
                                      res.json({"status":"false","message":"user not available"});
                                  }
                              }

                     })
                }); //end of getconnection
  
            }
            
        }
        catch(ex){
        
        return next(ex);
        }
}) 
router.post('/donation',function(req,res,next){
    try{
    
    var reqObj = req.body; 
    req.getConnection(function(err, conn){ 
    var orderId =shortid.generate();
    var query =conn.query("INSERT INTO `tb_donation` (`order_id`,userid,donation_amount) VALUES('"+orderId+"','"+reqObj.userid+"','"+reqObj.donation_amount+"')",function(err,intiatepay){
    if(intiatepay.affectedRows===1){
    
    if(reqObj.donation_amount>0){
    
    if(reqObj.donation_amount>20000){
    reqObj.donation_amount=20000;
    res.json({"status":'true',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?action=donation&orderId="+orderId+"&userid="+reqObj.userid+"&amount="+reqObj.donation_amount+"","redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","message":'Donating us is not available right now'});
    }else{
    res.json({"status":'true',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?action=donation&orderId="+orderId+"&userid="+reqObj.userid+"&amount="+reqObj.donation_amount+"","redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","message":'Donating us is not available right now'});
    }
    }else{
    res.json({"status":'false',"message":'Donation amount is zero'});
    } 
    } else {
    res.json({"status":'false',"message":'Donating us is not available right now'});
    }
    })
    })
    
    }catch(ex){
    
    return next(ex);
    }
    })
    
    // donation response 
router.post("/donationresponse", (req, res) => {
            var reqObj = req.body;
            req.getConnection(function(err,conn){
                if(err){
                    res.json({"status": "false", "msg": "Somthing wnet wrong"})
                }
                else{
                        if(reqObj.STATUS != 'TXN_FAILURE'){
                            var query =conn.query("update `tb_donation` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',paytm_status='"+reqObj.STATUS+"',status=1 where order_id='"+reqObj.ORDERID+"'",function(err,pay){
                                if(err){
                                    res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                                }
                                else{
                                    if(pay.affectedRows===1){
                                        responsePayment(req.body).then(
                                            success => {
                                                res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                                            },
                                            error => {
                                                res.send(error);
                                            }
                                        );
                                            
                                    }
                                
                                } sss
                                
                            })
                } else if(reqObj.STATUS == 'TXN_FAILURE') {
                        var query =conn.query("update `tb_donation` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',paytm_status='"+reqObj.STATUS+"',status=0 where order_id='"+reqObj.ORDERID+"'",function(err,pay){
                            if(err){
                                res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                            } 
                            if(pay.affectedRows===1){
                            
                                responsePayment(req.body).then(
                                    success => {
                                        res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                                    },
                                    error => {
                                        res.send(error);
                                    }
                                );
                                
                            }
                        })
                                            }
                }
              
            });
});

router.post('/paymentrequestCompleted', function(req,res,next){
	try{
	var reqObj = req.body;
		if(reqObj.userid==undefined || reqObj.userid==''){
			res.json({"status":'false',"message":'Request parameter is missing'});
			return false;
		}else{
				req.getConnection(function(err, conn){  
					var query = conn.query("update tb_challenge_wallet as a left join tb_wallet as b on a.userid=b.userid set a.amount=0,a.payment_by=null,a.phone=null,a.is_withdrawn_resuested_generated=0,a.updated_at=NOW(),b.is_withdrawal=1,b.is_withdrawn_resuested_generated=1 where a.userid='"+reqObj.userid+"' and a.is_withdrawn_resuested_generated=1", function (err, result){    
						if(err){
						console.error('SQL error: ', err);
						res.json({"status":'false',"msg":'Something went wrong!'});
						}
						else{
							res.json({"status":'true',"msg":'Great JOB! Done.'});
						}
					});
				});

		}// end of else block        
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
    });
    
router.post('/CombineAmountLeagueandIncentive', (req, res, next)=>{
    try{
        var reqObj= req.body;
        if(reqObj.userid=="" || reqObj.userid=="undefined"){
                    res.json({"status": "false", "message": "Invalid user"})
        }else if(reqObj.imei=="" || reqObj.imei=="undefined"){
            res.json({"status": "false", "message": "Invalid user"})
        }else{
            req.getConnection((err, conn)=>{
                    conn.query("select incentive from tb_users where id ='"+reqObj.userid+"'", (err, incentivecheck)=>{
                        
                                if(err){
                                    res.json({"status":"false", "message": "Something went wrong"})
                                }else{
                                    if(incentivecheck.length>0){
                                    if(incentivecheck[0].incentive===1){
                                        conn.query("select (CAST(a.amount as CHAR))as amt, (cast(b.total_amount as char)) as tamt from tb_challenge_wallet AS a RIGHT JOIN tb_mindcrew AS b ON a.userid=b.userid where a.userid ='"+reqObj.userid+"'", (err, amount)=>{
                                            if(err){
                                                res.json({"status":"false","message":"Something went wrong"})
                                            }else{
                                                if(amount.length>0){
                                                    var responseData = {};
                                                responseData.leagueamount = amount[0].amt;
                                                responseData.incentivebalance = amount[0].tamt;
                                                responseData.incentiveenable = "1";
                                                res.json({"status":"true","data":responseData,"organisation_name":"Sewa","organisation_image":"http://52.66.124.74/sewa_img/sewa_image.jpg"})
                                                }else{
                                                    var responseData = {};
                                                responseData.leagueamount = "0";
                                                responseData.incentivebalance = "0";
                                                responseData.incentiveenable = "0";
                                                res.json({"status":"true","data":responseData,"organisation_name":"Sewa","organisation_image":"http://52.66.124.74/sewa_img/sewa_image.jpg"})
                                                }
                                            }
                                            
                                            
                                        });
                                    }else{
                                    
                                        conn.query("select (cast(amount as char))as amt  from tb_challenge_wallet where userid ='"+reqObj.userid+"'", (err, amount)=>{
                                        if(err){
                                            res.json({"status":"false","message":"Something went wrong"})   
                                        }else{
                                            if(amount.length>0){
                                                var responseData = {}; 
                                                responseData.leagueamount = amount[0].amt;
                                                responseData.incentivebalance = "0";
                                                responseData.incentiveenable = "0";
                                                    res.json({"status":"true","data":responseData,"organisation_name":"Sewa","organisation_image":"http://52.66.124.74/sewa_img/sewa_image.jpg"})
                                            }else{
                                                var responseData = {}; 
                                                responseData.leagueamount = "0";
                                                responseData.incentivebalance = "0";
                                                responseData.incentiveenable = "0";
                                                    res.json({"status":"true","data":responseData,"organisation_name":"Sewa","organisation_image":"http://52.66.124.74/sewa_img/sewa_image.jpg"})   
                                            }
                                        }
                                        
                                    
                                    })
                                    }
                                    }else{
                                        res.json({"message":"Not found"})
                                    }
                                    
                                }//check userincentive or not
                    });
            })//connection end
        }
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
    })      
        
router.post('/IncentiveSpendAmount1',function(req,res,next){ 
    
            try{
                var reqObj = req.body;
                if(reqObj.userid==undefined || reqObj.userid==''){
                    res.json({"status":'false',"message":'Request parameter is missing1'});
                    return false;
                }else if(reqObj.imei==undefined || reqObj.imei==''){
                        res.json({"status":'false',"message":'Request parameter is missing2'});
                        return false;    
                }else if(reqObj.qr_code==undefined || reqObj.qr_code==''){
                    res.json({"status":'false',"message":'Request parameter is missing2'});
                    return false;
                }else if(reqObj.amount==undefined || reqObj.amount==''){
                    res.json({"status":'false',"message":'Request parameter is missing2'});
                    return false;
                }else{
                    
                        req.getConnection(function(err, conn){
                        function spendamount(){
                            return new Promise(function(resolve,reject) { 
                            var query = conn.query("select * from tb_mindcrew where userid ='"+reqObj.userid+"'",function (err, resultApp){ 
                                if(err){
                                    res.json({"status":"false","msg":"something went wrong1"})
                                }else{
                                if(resultApp.length>0){
                                    conn.query("select imei from tb_users where id='"+reqObj.userid+"' and incentive =1",function(err,resultimei){
                                        if(err){
                                            res.json({"status":"false","msg":"something went a wrong2"})
                                        }else{
                                        if(resultimei[0].imei == reqObj.imei){
                                            conn.query("select merchant_code from tb_merchant",function(err,resqr_code){
                                                if(err){
                                                    res.json({"status":"false","msg":"something went wrong3"})
                                                }else{
                                                if(resqr_code[0].merchant_code == reqObj.qr_code){
                                                    if(resultApp[0].total_amount!=0){
                                                       
                                                        if(resultApp[0].total_amount>=reqObj.amount){
                                                    var balance = (parseFloat((resultApp[0].total_amount-reqObj.amount)).toFixed(2));
                                                    conn.query("update tb_mindcrew set total_amount='"+balance+"', spend_amount=spend_amount+'"+reqObj.amount+"' where userid='"+reqObj.userid+"'",function(err,restoat){
                                                        if(err){
                                                            res.json({"status":"false","message":err});
                                                        }  else{
                                                            conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '0', '"+reqObj.amount+"', '1', NOW())", (err, resultinsert)=>{
                                                                if(err){
                                                                    res.json({"status":"false","message":err});
                                                                }else{
                                                                    conn.query("update tb_contratct set merchant_amount	= merchant_amount+'"+reqObj.amount+"'", (err, resultupdatecontract)=>{
                                                                        if(err){
                                                                            res.json({"status":"false","message":err});
                                                                        }else{
                                                                            // res.json({"status":"true","message":"Thanks for spending money at Canteen"});
                                                                            resolve(reqObj.amount);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                    }else{
                                                        res.json({"status":"false","message":"Total amount is greater than amount"});    
                                                    }
                                                }else{
                                                    res.json({"status":"false","message":"You have zero in wallet"});
                                                }
                                                }else{
                                                    res.json({"status":"false","message":"Qrcode is invalid"});
                                                }
                                            }
                                            })
                                        }else{
                                            res.json({"status":"false","message":"Imei is wrong"});
                                        }
                                    }
                                    })
                                }else{
                                    res.json({"staus":"false","message":"Result not found"});
                                }
                            }
                            })   
                        })// function end
                        }    
                    //})
                    
                //})//. 
        
                   function sms(deviceData){
                    
                return new Promise(function(resolve,reject) {     
                if(err){
                    res.json({"status": "false", "msg": err});
                }
                else{
                conn.query("select name from tb_users where id = '"+reqObj.userid+"'", (err, resultname)=>{
                    if(err){
                        res.json({"status": "false", "message": err})
                    }else{
                        if(resultname.length>0){
                                    
                        var accountSid = 'AC3bbb234bc113fdbcd76b3470751228bf'; // Your Account SID from www.twilio.com/console ACcc192d9108e5fbc863414f59f9822097
                        var authToken = 'f47d9e466d0b2de6cdbe0e0131da1750';   // Your Auth Token from www.twilio.com/console 008d411dbb16b91029d6afd290a5b3e0
                        var client = new twilio(accountSid, authToken);
                        client.messages.create({
                        body: ""+resultname[0].name+" has paid INR "+deviceData+" to you from walkify App",
                        to: '+919179237479',  // Text this number
                        from: '+13105041939' // From a valid Twilio number
                        })
                        .then((message) => console.log(message.sid));
                        
                        resolve(true)
                        }else{
                            res.json({"status": "false", "message": "users not vaild"})
                        }
        
                    }
                })
                }//else end
              })  
                   }
                   spendamount().then(function(data) {
                    var deviceData = data;
                        sms(deviceData).then((data)=>{
                            if(data==true){
                                res.json({"status":"true","message":"Thanks for spending money at Canteen"});
                            }
                            
                        })
                        
                      
                    })
        
                }) // conn end
                }// else end
            }catch(ex){
            console.error("Internal error:"+ex);
            return next(ex);
            }
        })        
   
router.post('/getuserid',function(req,res,next){
try{
    var reqObj = req.body;
            if(reqObj.email_id==undefined || reqObj.email_id==''){
                res.json({"status":'false',"message":'Request parameter is missing1'});
                return false;
            }else{
                req.getConnection(function(err, conn){
                    conn.query("select id from tb_users where email like '"+reqObj.email_id+"'",function(err,result){
                        if(err){
                            res.json({"status":"false","message":"something went wrong"})
                        }else{
                            res.json({"status":"true","data":result[0].id})
                        }
                    })
                })
            }    

}catch(ex){
    console.error("Internal error:"+ex);
    return next(ex)
}
})   

router.post('/IncentivespendAmount',function(req,res,next){ 

    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing1'});
            return false;
        }else if(reqObj.imei==undefined || reqObj.imei==''){
                res.json({"status":'false',"message":'Request parameter is missing2'});
                return false;    
        }else if(reqObj.qr_code==undefined || reqObj.qr_code==''){
            res.json({"status":'false',"message":'Request parameter is missing2'});
            return false;
        }else if(reqObj.amount==undefined || reqObj.amount==''){
            res.json({"status":'false',"message":'Request parameter is missing2'});
            return false;
        }else{
            
                req.getConnection(function(err, conn){
                    var transaction_id=shortid.generate();
                function spendamount(){
                    return new Promise(function(resolve,reject) { 
                    var query = conn.query("select * from tb_mindcrew where userid ='"+reqObj.userid+"'",function (err, resultApp){ 
                        if(err){
                            res.json({"status":"false","msg":"something went wrong1"})
                        }else{
                        if(resultApp.length>0){
                            conn.query("select imei from tb_users where id='"+reqObj.userid+"' and incentive =1",function(err,resultimei){
                                if(err){
                                    res.json({"status":"false","msg":"something went a wrong2"})
                                }else{
                                if(resultimei[0].imei == reqObj.imei){
                                    conn.query("select merchant_code from tb_merchant",function(err,resqr_code){
                                        if(err){
                                            res.json({"status":"false","msg":"something went wrong3"})
                                        }else{
                                        if(resqr_code[0].merchant_code == reqObj.qr_code){
                                            if(resultApp[0].total_amount!=0){
                                                
                                                if(resultApp[0].total_amount>=reqObj.amount){
                                                    
                                            var d = new Date();
                                            var gmt=d.toLocaleString();
                                            var balance = (parseFloat((resultApp[0].total_amount-reqObj.amount)).toFixed(2));
                                            var q=conn.query("update tb_mindcrew set total_amount='"+balance+"', spend_amount=spend_amount+'"+reqObj.amount+"',created_at=now(),transaction_id='"+transaction_id+"' where userid='"+reqObj.userid+"'",function(err,restoat){
                                                
                                                var responsedata ={}
                                                responsedata.amount=reqObj.amount;
                                                responsedata.date=gmt;
                                                responsedata.trans_id=transaction_id;
                                                responsedata.text="Paid to Canteen 87703xxxx9";
                                                if(err){
                                                    res.json({"status":"false","message":err});
                                                }else{
                                                    conn.query("INSERT INTO `tb_mctpointhistory` (`userid`, `points`, `earn_amount`, `status`, `create_at`) VALUES ('"+reqObj.userid+"', '0', '"+reqObj.amount+"', '1', NOW())", (err, resultinsert)=>{
                                                        if(err){
                                                            res.json({"status":"false","message":err});
                                                        }else{
                                                            conn.query("update tb_contratct set merchant_amount	= merchant_amount+'"+reqObj.amount+"'", (err, resultupdatecontract)=>{
                                                                if(err){
                                                                    res.json({"status":"false","message":err});
                                                                }else{
                                                                    // res.json({"status":"true","message":"Thanks for spending money at Canteen"});
                                                                    resolve(responsedata);
                                                                    console.log(responsedata);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            })
                                            }else{
                                                res.json({"status":"false","message":"Total amount is greater than amount"});    
                                            }
                                        }else{
                                            res.json({"status":"false","message":"You have zero in wallet"});
                                        }
                                        }else{
                                            res.json({"status":"false","message":"Qrcode is invalid"});
                                        }
                                    }
                                    })
                                }else{
                                    res.json({"status":"false","message":"Imei is wrong"});
                                }
                            }
                            })
                        }else{
                            res.json({"staus":"false","message":"Result not found"});
                        }
                    }
                    })   
                })// function end
                }    
            //})
            
        //})//. 

        function sms(deviceData){
        return new Promise(function(resolve,reject) {     
        if(err){
            res.json({"status": "false", "msg": err});
        }
        else{
        conn.query("select name as date from tb_users where id = '"+reqObj.userid+"'", (err, resultname)=>{
            if(err){
                res.json({"status": "false", "message": err})
            }else{
                if(resultname.length>0){
                            
                var accountSid = 'AC3bbb234bc113fdbcd76b3470751228bf'; // Your Account SID from www.twilio.com/console ACcc192d9108e5fbc863414f59f9822097
                var authToken = 'f47d9e466d0b2de6cdbe0e0131da1750';   // Your Auth Token from www.twilio.com/console 008d411dbb16b91029d6afd290a5b3e0
                var client = new twilio(accountSid, authToken);
                client.messages.create({
                body: ""+resultname[0].name+" has paid INR "+deviceData+" to you from walkify App",
                to: '+919179237479',  // Text this number
                from: '+13105041939' // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));
                
                resolve(true)
                }else{
                    res.json({"status": "false", "message": "users not vaild"})
                }

            }
        })
        }//else end
        })  
            }
            spendamount().then(function(data) {
                
            var deviceData = data;
                sms(deviceData).then((data)=>{
                    if(data==true){
                        res.json({"status":"true","message":"Thanks for spending money at Canteen","data":deviceData});
                    }
                    
                })
                
                
            })

        }) // conn end
        }// else end
    }catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
})           
