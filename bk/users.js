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


var cryptLib = require('cryptlib'),
    iv = 'mindcrewnewapp17', //16 bytes = 128 bit 
    key = cryptLib.getHashSha256('newapp17mindcrew', 32), //32 bytes = 256 bits 
    encryptedText = cryptLib.encrypt('159753', key, iv);
//decryptedText = cryptLib.decrypt('AHIpkwOPQ1JGhmwQpX9+PA==', key, iv);

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

  /*var mailOptions={
        to : 'sanjeev.gehlot.08@gmail.com',
        subject : 'Llena Test Mail',
        html : '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">        @import url(https://fonts.googleapis.com/css?family=Lato);  @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }.mj-column-per-50 { width:50%!important; }  }</style></head><body style="background: #FFFFFF;">    <div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:50px;white-space:nowrap;">&#xA0;</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:72px;"><img alt="" height="auto" src="'+defaultUrl+'logowalkify.jpg" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="72"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="center"><div style="cursor:auto;color:#FFFFFF;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:center;"><h1 style="font-family: &apos;Cabin&apos;, sans-serif; color: #FFFFFF; font-size: 32px; line-height: 100%;">Walkify</h1><p>Walk, Run and Earn</p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:35px 0px 35px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 21px 100px 9px;" align="left"><div style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><p><span style="font-size:14px;">This is your new text block with first paragraph.</span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#49a6e8;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;"><div style="font-size:1px;line-height:29px;white-space:nowrap;">&#xA0;</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="left"><div style="cursor:auto;color:#949494;font-family:Lato, Tahoma, sans-serif;font-size:14px;line-height:22px;text-align:left;"><p><span style="font-size:12px;">Copyright &#xA9; 2017&#xA0;Topol.io, All rights reserved.&#xA0;<br>You subscribed to our newsletter via our website, topol.io<br>&#xA0;<br><a draggable="false" href="http://*|UNSUB|*" style="color:#3498db;">Unsubscribe from this list</a></span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td><td style="vertical-align:top;width:300px;">      <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;" align="right"><div><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="undefined"><tr><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.facebook.com/PROFILE"><img alt="facebook" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/facebook.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.facebook.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://www.twitter.com/PROFILE"><img alt="twitter" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/twitter.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://www.twitter.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="right" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="font-size:0px;vertical-align:middle;width:35px;height:35px;"><a href="https://plus.google.com/PROFILE"><img alt="google" height="35" src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/outlined/google-plus.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td><td style="padding:4px 4px 4px 0;vertical-align:middle;"><a href="https://plus.google.com/PROFILE" style="text-decoration:none;text-align:left;display:block;color:#333333;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;border-radius:3px;"></a></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>'
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
        res.end("error");
      }else{
        console.log("Message sent: " + response);
        res.end("sent");
      }
    });*/

});

module.exports = router;


function middleware(req,res,next){
    console.log(req.headers.wakifykey)
     var reqObj = req.body;
     if(!reqObj.imei || reqObj.imei=="" || !req.headers.wakifykey || req.headers.wakifykey == ""){
         return res.json({"status":'false',"msg":'Something went wrong!'});
     } else{
    req.getConnection(function(err, conn){  
     console.log("SELECT * FROM `tb_ids` where  tb_ids.imei =  '"+reqObj.imei+"'");
     var queryChecktb_ids = conn.query("SELECT * FROM `tb_ids` where  tb_ids.imei =  '"+reqObj.imei+"'", function (err, resultChecktb_ids)
                             {
 
                             if(err){
                             console.error('SQL error: ', err);
                             res.json({"status":'false',"msg":'Something went wrong!'});
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
                                   console.log("matched")
                                     next();
                                   
                                    }else{
                                         return res.json({
                                              status:"false",
                                              msg:"You are doing something wrong!"
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



router.post('/getWalletAmount', middleware, function(req,res,next){
    console.log(1111111);
        try{
        var reqObj = req.body;        

        


        req.getConnection(function(err, conn){  
             var query = conn.query("SELECT IFNULL(sum(amount),0) as amount from tb_wallet WHERE  tb_wallet.userid =  '"+reqObj.userid+"' AND tb_wallet.is_withdrawn_resuested_generated = 0", function (err, result){
            
            //var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  ? AND tb_users.password =  ?  AND tb_users.status =1",[reqObj.email,encryptPasword], function (err, result){
           

            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            
            else{


                    res.json({"status":'true',"msg":'Successful',"response":result[0]});        
             
            }
            });
            });

            }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
});


router.post('/updateLocationAfterLogin', function(req,res,next){
    console.log(1111111);
        try{
        var reqObj = req.body;        

        


        req.getConnection(function(err, conn){  

             var query = conn.query("update tb_users set lat='"+reqObj.lat+"', lng='"+reqObj.lng+"', address='"+reqObj.address+"' where id='"+reqObj.userid+"' ", function (err, result){
            
            //var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  ? AND tb_users.password =  ?  AND tb_users.status =1",[reqObj.email,encryptPasword], function (err, result){
           

            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            
            else{


                    res.json({"status":'true',"msg":'Successful'});        
             
            }
            });
            });

            }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
});



router.post('/withdrawlAmount', middleware, function(req,res,next){
    console.log(1111111);
        try{
        var reqObj = req.body;        

        


        req.getConnection(function(err, conn){ 


        var query1 = conn.query("SELECT IFNULL(sum(amount),0) as amount FROM `tb_wallet` WHERE is_withdrawal=0 and is_withdrawn_resuested_generated=0 and userid='"+reqObj.userid+"'", function (err, result1){
            
            

            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            
            else{
                    if(result1[0].amount >= 250){

                    var query = conn.query("update tb_wallet set payment_by = '"+reqObj.payment_type+"', is_withdrawn_resuested_generated = 1, withdrawl_date = Now(), phone = '"+reqObj.phone+"' WHERE  tb_wallet.userid =  '"+reqObj.userid+"' AND tb_wallet.is_withdrawal = 0 AND tb_wallet.is_withdrawn_resuested_generated = 0", function (err, result){
                
                

                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                else{


                        res.json({"status":'true',"msg":'Withdrawl request generated'});        
                 
                }
                });   
                }  else{
                    res.json({"status":'false',"msg":'Minimum withdrawal amount is Rs.500. Walk and Earn more.'});
                }  
             
            }
           
                 
              }); 
            });

            }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
});


router.post('/authUser', middleware, function(req,res,next){
    console.log(1111111);
        try{
        var reqObj = req.body;        

        var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);


        req.getConnection(function(err, conn){  
             var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.password =  '"+encryptPasword+"'  AND tb_users.status =1", function (err, result){
            
            //var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  ? AND tb_users.password =  ?  AND tb_users.status =1",[reqObj.email,encryptPasword], function (err, result){
           

            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'Wrong username or password'});
                
            }
            else{


                            var query = conn.query("Update tb_users set device_type =  '"+reqObj.device_type+"', device_token =  '"+reqObj.device_token+"', imei =  '"+reqObj.imei+"', is_loggedIn = 1  where id = '"+result[0].id+"'", function (err, resultUpdate){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Unable to update Device Token.'});
                                    
                                }else{

                                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.password =  '"+encryptPasword+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    console.error('SQL error: ', err);
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
        console.error("Internal error:"+ex);
        return next(ex);
        }
});


// Fb login and signup

router.post('/fbAuth', middleware, function(req,res,next){
    res.json({"status":'false',"msg":'update app'});
    // console.log(1111111);
    //     try{
    //     var reqObj = req.body;        

    //     //var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);


    //     req.getConnection(function(err, conn){ 

    //         var parentID = 0;

    //             if(!reqObj.referral_code || reqObj.referral_code == ''){

    //                 parentID = 0;

    //             }
    //             else{
    //                     var queryCheckReferral = conn.query("SELECT * from tb_users WHERE  tb_users.referral_code =  '"+reqObj.referral_code+"'", function (err, resultCheckReferral)
    //                         {

    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                         }

    //                         if(resultCheckReferral==''){

    //                             res.json({"status":'false',"msg":'Invalid referral code!'});
    //                         }
    //                         else{

    //                             parentID = resultCheckReferral[0].id;
    //                         }

    //                     });

    //             }
         
            


    //         var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"' AND tb_users.status =1", function (err, result){
    //         if(err){
    //         console.error('SQL error: ', err);
    //         res.json({"status":'false',"msg":'Something went wrong!'});
    //         }
    //         if(result==''){

    //             var referral_code = cryptLib.encrypt(reqObj.email, key, iv);
                
    //             var query1 = conn.query("SELECT * from tb_users WHERE  tb_users.imei =  '"+reqObj.imei+"'  ", function (err, result1)
    //             {  

    //             // if(result1.length > 0){
    //             //     res.json({"status":'false',"msg":'Walkify do not allow multiple user registration from same phone!'});
    //             // } 
    //             var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token, referral_code, parent_id, is_loggedIn, disease, imei, isFbLogin) Values('"+reqObj.name+"','"+reqObj.email+"','','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+referral_code+"','"+parentID+"', 1, '', '"+reqObj.imei+"', 1)", function (err, resultUpdate){
    //                             if(err){
    //                             console.error('SQL error: ', err);
    //                             res.json({"status":'false',"msg":'Something went wrong!'});
    //                             }
    //                             console.log("test", resultUpdate)
    //                             if(resultUpdate==''){

    //                                 res.json({"status":'false',"msg":'Something went wrong.'});
                                    
    //                             }else{

    //                                     var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.email =  '"+reqObj.email+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                 console.log("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+result[0].id+"' ORDER BY `id` DESC LIMIT  1")
    //                                                 conn.query("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+resultUpdate[0].id+"' ORDER BY `id` DESC LIMIT  1", function (err, resultstepsla){
    //                                                     if(err){
    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                     }
    //                                                 if(resultSelect==''){

    //                                                     res.json({"status":'false',"msg":'Something went wrong.'});
                                                        
    //                                                 }else{

    //                                                         var responseData = {};

    //                                                         responseData.id = resultSelect[0].id;
    //                                                         responseData.name = resultSelect[0].name;
    //                                                         responseData.email = resultSelect[0].email;
    //                                                         responseData.profileImg = resultSelect[0].profileImg;
    //                                                         if(resultSelect[0].dob == '0000-00-00'){
    //                                                             responseData.dob = '';
    //                                                         responseData.dobn = '';
    //                                                         }else{
    //                                                             responseData.dob = resultSelect[0].dob;
    //                                                         responseData.dobn = resultSelect[0].dobn;
    //                                                         }
    //                                                         responseData.gender = resultSelect[0].gender;
    //                                                         responseData.phone = resultSelect[0].phone;
    //                                                         responseData.is_loggedIn = resultSelect[0].is_loggedIn;
    //                                                         responseData.disease = resultSelect[0].disease;
    //                                                         responseData.height_fit_inc = resultSelect[0].height_fit_inc;
    //                                                         responseData.weight_kg = resultSelect[0].weight_kg;
    //                                                         responseData.device_type = resultSelect[0].device_type;
    //                                                         responseData.referral_code = resultSelect[0].referral_code;
    //                                                         responseData.parent_id = resultSelect[0].parent_id;
    //                                                         responseData.organisation_id = resultSelect[0].organisation_id;
    //                                                         responseData.organisation_name = resultSelect[0].organisation_name;
    //                                                         responseData.organisation_code = resultSelect[0].organisation_code;
    //                                                         responseData.organisation_logo = resultSelect[0].organisation_logo;
    //                                                          if(resultstepsla.length<0){
    //                                                           responseData.endtime = " "; 
    //                                                          }

    //                                                    //insert point start change 13june
                                                       
    //                                                     var insert_newtable = "insert into tb_newpoint(userid, points, bonus_point, outdoor_point, total_league_steps, total_league_point) Values('"+responseData.id+"', 0, 0, 0, 0, 0)"
    //                                                     conn.query(insert_newtable, (err, result)=>{
    //                                                        if(err){
    //                                                         console.error('SQL error: ', err);
    //                                                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                        }
    //                                                        console.log("test123334");
    //                                                     })
    //                                                     //insert point end
    //                                                         res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
    //                                                 }
    //                                                 });
    //                                             });
                                    
    //                             }
    //                             })
    //                             });


                
    //         }
    //         else{


    //                         var query = conn.query("Update tb_users set device_type =  '"+reqObj.device_type+"', device_token =  '"+reqObj.device_token+"', imei =  '"+reqObj.imei+"', is_loggedIn = 1  where id = '"+result[0].id+"'", function (err, resultUpdate){
    //                             if(err){
    //                             console.error('SQL error: ', err);
    //                             res.json({"status":'false',"msg":'Something went wrong!'});
    //                             }
    //                             if(resultUpdate==''){

    //                                 res.json({"status":'false',"msg":'Unable to update Device Token.'});
                                    
    //                             }else{

    //                                     var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+result[0].id+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                 conn.query("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+result[0].id+"' ORDER BY `id` DESC LIMIT  1", function (err, resultstepsla){
    //                                                     if(err){
    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                     }
    //                                                     console.log("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+result[0].id+"' ORDER BY `id` DESC LIMIT  1")
    //                                                 if(resultSelect==''){

    //                                                     res.json({"status":'false',"msg":'Something went wrong.'});
                                                        
    //                                                 }else{

    //                                                         var responseData = {};

    //                                                         responseData.id = resultSelect[0].id;
    //                                                         responseData.name = resultSelect[0].name;
    //                                                         responseData.email = resultSelect[0].email;
    //                                                         responseData.profileImg = resultSelect[0].profileImg;
    //                                                         if(resultSelect[0].dob == '0000-00-00'){
    //                                                             responseData.dob = '';
    //                                                         responseData.dobn = '';
    //                                                         }else{
    //                                                             responseData.dob = resultSelect[0].dob;
    //                                                         responseData.dobn = resultSelect[0].dobn;
    //                                                         }
    //                                                         responseData.gender = resultSelect[0].gender;
    //                                                         responseData.phone = resultSelect[0].phone;
    //                                                         responseData.is_loggedIn = resultSelect[0].is_loggedIn;
    //                                                         responseData.disease = resultSelect[0].disease;
    //                                                         responseData.height_fit_inc = resultSelect[0].height_fit_inc;
    //                                                         responseData.weight_kg = resultSelect[0].weight_kg;
    //                                                         responseData.device_type = resultSelect[0].device_type;
    //                                                         responseData.referral_code = resultSelect[0].referral_code;
    //                                                         responseData.parent_id = resultSelect[0].parent_id;
    //                                                         responseData.organisation_id = resultSelect[0].organisation_id;
    //                                                         responseData.organisation_name = resultSelect[0].organisation_name;
    //                                                         responseData.organisation_code = resultSelect[0].organisation_code;
    //                                                         responseData.organisation_logo = resultSelect[0].organisation_logo;
    //                                                         if(resultstepsla.length>0){
    //                                                          responseData.endtime = resultstepsla[0].endtime;    
    //                                                         }
    //                                                         else{
    //                                                             responseData.endtime = "";
    //                                                         }
                                                                
    //                                                         res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
    //                                                 }
    //                                                 });
    //                                             });
                                    
    //                             }
    //                             });
                        
             
    //         }

        

    //         });
    //         });

    //         }
    //     catch(ex){
    //     console.error("Internal error:"+ex);
    //     return next(ex);
    //     }
});


router.post('/googleAuth', function(req,res,next){
    console.log(1111111);
        try{
        var reqObj = req.body;        

        //var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);


        req.getConnection(function(err, conn){ 

            var parentID = 0;

                if(!reqObj.referral_code || reqObj.referral_code == ''){

                    parentID = 0;

                }
                else{
                        var queryCheckReferral = conn.query("SELECT * from tb_users WHERE  tb_users.referral_code =  '"+reqObj.referral_code+"'", function (err, resultCheckReferral)
                            {

                            if(err){
                            console.error('SQL error: ', err);
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
            console.error('SQL error: ', err);
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
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }                       
                                                        var insert_newtable = "insert into tb_newpoint(userid, points, bonus_point, outdoor_point, total_league_steps, total_league_point) Values('"+resultUpdate.insertId+"', 0, 0,0,0,0)"
                                                        conn.query(insert_newtable, (err, result)=>{
                                                           if(err){
                                                            console.error('SQL error: ', err);
                                                           }
                                                        });
                                                        

                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Something went wrong.'});
                                    
                                }else{

                                              
                                                      
                                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.email =  '"+reqObj.email+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    conn.query("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+resultUpdate.insertId+"' ORDER BY `id` DESC LIMIT  1", function (err, resultstepsla){
                                                        if(err){
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        console.log("SELECT * FROM `tb_stepscount_newhistory` WHERE userid = '"+resultUpdate.insertId+"' ORDER BY `id` DESC LIMIT  1")

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
                                                            if(resultstepsla.length<0)
                                                            {
                                                                responseData.endtime=  "";
                                                            }

                                                            
                                                            
                                                            res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
                                                    }
                                                    });
                                                });
                                    
                                }
                                });

                        });
                
            }
            else{


                            var query = conn.query("Update tb_users set device_type =  '"+reqObj.device_type+"', device_token =  '"+reqObj.device_token+"', imei =  '"+reqObj.imei+"', is_loggedIn = 1  where id = '"+result[0].id+"'", function (err, resultUpdate){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                if(resultUpdate==''){

                                    res.json({"status":'false',"msg":'Unable to update Device Token.'});
                                    
                                }else{
                                            
                                        conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,dob,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, tb_users.gender, tb_users.disease, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id, tb_users.is_loggedIn,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+result[0].id+"'  AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    conn.query("SELECT DATE_FORMAT(endtime, '%Y-%m-%d %H:%i:%s') AS endtime  FROM `tb_stepscount_newhistory` WHERE userid = '"+resultSelect[0].id+"' ORDER BY `id` DESC LIMIT  1", function (err, resultstepsla){
                                                        if(err){
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        console.log("test",resultstepsla)
                                                          
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
                                                            if(resultstepsla.length>0){
                                                            responseData.endtime = resultstepsla[0].endtime;
                                                            }
                                                             else{
                                                                responseData.endtime = ""
                                                            }
                                                                                       
                                                                
                                                            res.json({"status":'true',"msg":'Authenication Successful',"response":responseData});
                                                     
                                                    }
                                                    });
                                                });
                                    
                                }
                                });

             
            }
            });
            });

            }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
});

// Api to add user
router.post('/addUser', middleware, function(req,res,next){

try{
var reqObj = req.body;
console.log(reqObj);    
req.getConnection(function(err, conn){
    console.log(conn)
if(err)
{
console.error('SQL Connection error: ', err);
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
                console.error('SQL error: ', err);
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
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"msg":'Something went wrong!'});
                        }
                        console.log(result.length)

                        if(result==''){
                            //res.json({"status":'true',"msg":'Authenication Successful',"response":result});   
                            var encryptPasword = cryptLib.encrypt(reqObj.password, key, iv);
                            var referral_code = cryptLib.encrypt(reqObj.email, key, iv);
                            
                            var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token, referral_code, parent_id, is_loggedIn, disease, imei) Values('"+reqObj.name+"','"+reqObj.email+"','"+encryptPasword+"','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+referral_code+"','"+parentID+"', 1, '', '"+reqObj.imei+"')", function (err, resultdata){
                            if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }

                            console.log(resultdata.insertId);

                            var query = conn.query("SELECT id,name,email, profileImg, dob, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn, gender, phone,height_fit_inc, weight_kg, device_type, referral_code, disease, organisation_id, parent_id, is_loggedIn from tb_users WHERE  tb_users.id =  '"+resultdata.insertId+"'", function (err, resultresponse)
                                    {

                                    if(err){
                                    console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
return next(ex);
}
});

//copy of addwalking with promise

//new updated 1.52
router.post('/addWalking', middleware,function(req,res,next) {
    res.json({"status":'false',"msg":'update App'});

//     try{
// var reqObj = req.body;
// req.getConnection(function(err, conn){
//     console.log(conn)
// if(err)
// {
// console.error('SQL Connection error: ', err);
// res.json({"status":'false',"msg":'Something went wrong!'});
// }
// else
// {

//     if(!reqObj.userid || reqObj.userid == "" || !reqObj.distance || reqObj.distance == "" || !reqObj.distance_unit || reqObj.distance_unit == "" || !reqObj.calorie_unit || reqObj.calorie_unit == "" || !reqObj.date || reqObj.date == "" || !reqObj.walk_time || reqObj.walk_time == "" || !reqObj.calories || reqObj.calories == "" )
//         {

//             res.json({"status":'false',"msg":'Please fill all the fields!'});
//         }
//         else{

//                     function checkReferalPoints(deviceData) {
//                         console.log("agyaaa");
//                         return new Promise(function(resolve,reject) {
//                             var distance = parseFloat(reqObj.distance);
//                             var parent_id = parseFloat(reqObj.parent_id);

//                                 if(distance >= 5 && parent_id > 0){
//                                     console.log(distance);
//                                     var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }
                                           
//                                         if(resultCheckReferalPoints == ""){
//                                                 var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
//                                                 if(err){
//                                                 console.error('SQL error: ', err);
//                                                 res.json({"status":'false',"msg":'Something went wrong!'});
//                                                 }
//                                                       //  custom by MCT  insert point in new table start
//                                                        //update point start   "UPDATE tb_newpoint SET points = points+"+50+" WHERE userid
//                                                     // where user check user participate
//                                                     conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.parent_id+"'",(err, result_userid)=>{
//                                                         if(result_userid.length > 0){

//                                                             var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.parent_id+"'"
//                                                             conn.query(update_point, (err, result)=>{
//                                                                 if(err){
//                                                                 console.error('SQL error: ', err);
//                                                                 res.json({"status":'false',"msg":'Something went wrong!insert'});
//                                                                 }
//                                                             })
//                                                          var d = new Date();
//                                                                  var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
//                                                             var insert_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
//                                                             conn.query(update_point, (err, result)=>{
//                                                                 if(err){
//                                                                 console.error('SQL error: ', err);
//                                                                 res.json({"status":'false',"msg":'Something went wrong!'});
//                                                                 }
//                                                             });
                                                                     
 


                                                                  
//                                                         }
//                                                         else{
//                                                             var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.parent_id+"',0, 50, 0, 0, 50 )"
//                                                             conn.query(insertpoint, (err, result)=>{
//                                                                 if(err){
//                                                                 console.error('SQL error: ', err);
//                                                                 res.json({"status":'false',"msg":'Something went wrong!insert'});
//                                                                 }
//                                                             })     
//                                                         }

//                                                     });
//                                                         // end where user check user participate
//                                                        //update point end
//                                               //  custom by MCT insert point in new table end


//                                                         if(deviceData.parent_device_type == "iOS"){
//                                                                              let deviceToken = deviceData.parent_device_token;
                                                                             
//                                                                              // Prepare the notifications
//                                                                              let notification = new apn.Notification();
//                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
//                                                                              notification.badge = 0;
//                                                                              notification.sound = "default";
//                                                                              notification.alert = "You have earned 50 referral points.";
//                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
//                                                                              // Replace this with your app bundle ID:
//                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                             
//                                                                              // Send the actual notification
//                                                                              apnProvider.send(notification, deviceToken).then( result => {
//                                                                                 // Show the result of the send operation:
//                                                                                 console.log(1111111111111111111111111);
//                                                                                 console.log(result);
//                                                                              });
//                                                                              // Close the server
//                                                                              apnProvider.shutdown();
//                                                                         }else if(deviceData.parent_device_type == "Android"){

//                                                                             console.log(deviceData.parent_device_token);
//                                                                             console.log(2222222222222222);

//                                                                             // Prepare a message to be sent
//                                                                             var message = new gcm.Message({

//                                                                                 data: { key:  "You have earned 50 referral points"},

//                                                                                     notification: {
//                                                                                         title: "Walkify",
//                                                                                         icon: "ic_launcher",
//                                                                                         body: "You have earned 50 referral points"
//                                                                                     }
//                                                                             });
//                                                                             message.addData({
//                                                                                             message: "You have earned 50 referral points"
//                                                                                         });
//                                                                             // Specify which registration IDs to deliver the message to
//                                                                             var regTokens = [deviceData.parent_device_token];
                                                                             
//                                                                             // Actually send the message
//                                                                             sender.send(message, { registrationTokens: regTokens }, function (err, response) {
//                                                                                 if (err) console.error(err);
//                                                                                 else console.log(response);
//                                                                             });



//                                                                         }
//                                                                         //resolve(true);
                                                

//                                                 });


//                                                 var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+reqObj.parent_id+"')", function (err, resultInsertInvitePoints){
//                                                 if(err){
//                                                 console.error('SQL error: ', err);
//                                                 res.json({"status":'false',"msg":'Something went wrong!'});
//                                                 }
//                                               //  custom by MCT  insert point in new table start
//                                                        //update point start
//                                                        var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
//                                                        conn.query(update_point, (err, result)=>{
//                                                            if(err){
//                                                            console.error('SQL error: ', err);
//                                                            res.json({"status":'false',"msg":'Something went wrong!'});
//                                                            }
//                                                        })
//                                                     var d = new Date();

//                                                             var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
//                                                        var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
//                                                        conn.query(update_point, (err, result)=>{
//                                                            if(err){
//                                                            console.error('SQL error: ', err);
//                                                            res.json({"status":'false',"msg":'Something went wrong!'});
//                                                            }
//                                                        });
//                                                        var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
//                                                        conn.query(update_point, (err, result)=>{
//                                                            if(err){
//                                                            console.error('SQL error: ', err);
//                                                            res.json({"status":'false',"msg":'Something went wrong!'});
//                                                            }
//                                                        })

//                                                        //update point end
//                                               //  custom by MCT insert point in new table end
//                                                     if(deviceData.device_type == "iOS"){
//                                                                              let deviceToken = deviceData.device_token;
//                                                                              console.log(deviceData.device_token);
//                                                                              // Prepare the notifications
//                                                                              let notification = new apn.Notification();
//                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
//                                                                              notification.badge = 0;
//                                                                              notification.sound = "default";
//                                                                              notification.alert = "You have earned 50 referral bonus points.";
//                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
//                                                                              // Replace this with your app bundle ID:
//                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                             
//                                                                              // Send the actual notification
//                                                                              setTimeout(function () {
//                                                                                     apnProvider.send(notification, deviceToken).then( result => {
//                                                                                             // Show the result of the send operation:
//                                                                                             console.log(1111111111111111111111111);
//                                                                                             console.log(result);
//                                                                                          });
//                                                                                          // Close the server
//                                                                                          apnProvider.shutdown();
//                                                                                 }, 2000);    

                                                                             
//                                                                         }else if(deviceData.device_type == "Android"){

//                                                                             console.log(deviceData.device_token);
//                                                                             console.log(2222222222222222);

//                                                                             // Prepare a message to be sent
//                                                                             var message = new gcm.Message({

//                                                                                 data: { key:  "You have earned 50 referral bonus points"},

//                                                                                     notification: {
//                                                                                         title: "Walkify",
//                                                                                         icon: "ic_launcher",
//                                                                                         body: "You have earned 50 referral bonus points."
//                                                                                     }
//                                                                             });
//                                                                             message.addData({
//                                                                                             message: "You have earned 50 referral bonus points"
//                                                                                         });
//                                                                             // Specify which registration IDs to deliver the message to
//                                                                             var regTokens = [deviceData.device_token];
                                                                             
//                                                                             // Actually send the message

//                                                                             setTimeout(function () {
                                                                                

//                                                                                 sender.send(message, { registrationTokens: regTokens }, function (err, response) {
//                                                                                         if (err) console.error(err);
//                                                                                         else console.log(response);
//                                                                                     });


//                                                                             }, 2000); 

                                                                            



//                                                                         }
//                                                                         resolve(true);


//                                                 });
                                                

//                                                 resolve(true);

//                                         }else{

//                                             console.log("2 me aaya");

//                                             resolve(true);
//                                         }


//                                     });

                                


//                                 }
//                                 else{
//                                     resolve(true);
//                                 }

//                         });
//                     }


//                    //new updated 1.51
//                    function addWalking(deviceData) {
//                     console.log("agyaaa1");
//                     return new Promise(function(resolve,reject) {
                        
//                         // date24 june
                        
//                         var hms =  reqObj.walk_time;   // your input string
//                         console.log(reqObj.walk_time  + "old")
//                         var a = hms.split(':'); // split it at the colons
//                         // minutes are worth 60 seconds. Hours are worth 60 minutes.
//                         var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

//                         if(seconds >=60){
//                             var updatetime= Math.round(seconds/60);
//                             var newupdatetime= parseInt(updatetime);
//                         }else{
//                             var updatetime= 1;
//                             var newupdatetime= 1;
//                         }
                       
//                         console.log(newupdatetime + "latest time")
//                         var updatepointval;
//                         var uupoint; //insert point table
//                         var walkpoint = Math.round(reqObj.walk_points);
//                         var userdistence= Math.round(reqObj.distance);
//                         var utime = Math.round(newupdatetime);
//                         var actwlak = (utime*100) //multip 200 1M = 200Meter
//                         // compare actuall distence = user distence
//                             if(userdistence >= actwlak){
//                                 //console.log(actwlak + "" + userdistence)
//                                 updatepointval = Math.round(actwlak)
//                                 if(walkpoint > updatepointval){
//                                     uupoint = parseInt(updatepointval)
//                                     console.log(uupoint + "f1")
//                                 }
//                                 else{
//                                     uupoint = parseInt(walkpoint)
//                                     console.log(uupoint + "f2")
//                                  }
//                             }
//                             else if(actwlak > userdistence){
//                                 updatepointval = Math.round(userdistence)
//                                 if(walkpoint > updatepointval){
//                                     uupoint = parseInt(updatepointval)
//                                     console.log(uupoint + "s1")
//                                 }
//                                 else{
//                                     uupoint = parseInt(walkpoint)
//                                     console.log(uupoint + "s2s")
//                                 }
//                             }
                       
                         

                          

//                          conn.query("SELECT imei FROM `tb_users` WHERE id= '"+reqObj.userid+"'", function(err, resultimel){
//                            if(resultimel[0].imei == reqObj.imei){
                               
                          
//                         conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
//                             if(result_userid.length>0){
//                                 var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+uupoint+", total_league_steps = total_league_steps+'"+0+"', total_league_point = total_league_point+'"+uupoint+"' WHERE userid = '"+reqObj.userid+"'"
//                                 conn.query(update_point, (err, result)=>{
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }
//                                 })
//                                 //update point end
//                        //  custom by MCT insert point in new table end


//             //  custom by MCT  insert point in new table start
//                                 //update point start 
//                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+uupoint+"', 1,'"+reqObj.date+"', 'Walking point', 'walkingpoint', 'WalkingPoint' )"
//                                 conn.query(update_point, (err, result)=>{
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }
//                                 })      
//                             }
//                             else {


//                                 var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+uupoint+"', 0, 0, '"+uupoint+"', '"+uupoint+"' )"
//                                 conn.query(insertpoint, (err, result)=>{
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!insert'});
//                                     }
//                                 })
//                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+uupoint+"', 1,'"+reqObj.date+"', 'Walking point', 'walkingpoint', 'WalkingPoint' )"
//                                 conn.query(update_point, (err, result)=>{
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }
//                                 }) 
//                             }

//                         });
//                         var query = conn.query("insert into tb_walking_history(userid, distance, date, walk_time, calories, distance_unit, calorie_unit, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"','"+reqObj.distance+"','"+reqObj.date+"','"+reqObj.walk_time+"','"+reqObj.calories+"','"+reqObj.distance_unit+"','"+reqObj.calorie_unit+"','"+reqObj.from_lat+"','"+reqObj.from_lng+"','"+reqObj.to_lat+"','"+reqObj.to_lng+"')", function (err, resultdata){
//                             if(err){
//                             console.error('SQL error: ', err);
//                             res.json({"status":'false',"msg":'Something went wrong!'});
//                             }
//                             var queryAddPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', '"+uupoint+"', 1)", function (err, resultAddPoints){
//                                 if(err){
//                                 console.error('SQL error: ', err);
//                                 res.json({"status":'false',"msg":'Something went wrong!'});
//                                 }
//                             });


//                               //  custom                     
//                                                    //update point end
//                                           //  custom by MCT insert point in new table end
//                                 var distance = parseFloat(reqObj.distance);
//                                 if(distance >1){

//                                     var calculatedPointIndex = parseInt(distance);
//                                     if(calculatedPointIndex > 0){
//                                         var calculatedPoint = calculatedPointIndex * 10;

//                                         if(deviceData.device_type == "iOS"){
//                                             if(uupoint>0){
//                                                          let deviceToken = deviceData.device_token;
                                                         
//                                                          // Prepare the notifications
//                                                          let notification = new apn.Notification();
//                                                          notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
//                                                          notification.badge = 2;
//                                                          notification.sound = "default";
//                                                          notification.alert = "You got "+uupoint+ " points";
//                                                          notification.payload = {'messageFrom': 'FitIndia'};
                                                         
//                                                          // Replace this with your app bundle ID:
//                                                          notification.topic = "Com.MindCrew.FitIndia";
                                                         
//                                                          // Send the actual notification
//                                                          apnProvider.send(notification, deviceToken).then( result => {
//                                                             // Show the result of the send operation:
//                                                             console.log(1111111111111111111111111);
//                                                             console.log(result);
//                                                          });
//                                                          // Close the server
//                                                          apnProvider.shutdown();
//                                                         }
//                                                     }else if(deviceData.device_type == "Android"){
//                                                         if(uupoint>0){
//                                                         console.log(deviceData.device_token);
//                                                         console.log(2222222222222222);

//                                                         // Prepare a message to be sent
//                                                         var message = new gcm.Message({

//                                                             data: { key:  "You got "+uupoint+ " points"},

//                                                                 notification: {
//                                                                     title: "Walkify",
//                                                                     icon: "ic_launcher",
//                                                                     body: "You got "+uupoint+ " points"
//                                                                 }
//                                                         });
//                                                         message.addData({
//                                                                         message: "You got "+uupoint+ " points"
//                                                                     });
//                                                         // Specify which registration IDs to deliver the message to
//                                                         var regTokens = [deviceData.device_token];
                                                         
//                                                         // Actually send the message
//                                                         sender.send(message, { registrationTokens: regTokens }, function (err, response) {
//                                                             if (err) console.error(err);
//                                                             else console.log(response);
//                                                         });

//                                                     }

//                                                     }
//                                                     resolve(true);                                       
//                                  }
//                                  resolve(true); 
//                              }
//                              resolve(true); 

//                             });
//                         }
//                         else{
//                             res.json({"status": "flase", "msg": "IMEI not valid"})
//                         }
//                     }); 
//                     });
//                 }
//                //end new updated 1.51

//                     function getPointsGlobal() {
//                         console.log("agyaaa");
//                         return new Promise(function(resolve,reject) {
//                             //SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'
//                             //
//                                     var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints, (SELECT IFNULL(sum(points), 0) FROM `tb_bonuspoint` WHERE point_type = 1 and userid = '"+reqObj.userid+"') as outdoorpoint FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid= '"+reqObj.userid+"'", function (err, resultPointsGlobal){
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }

//                                         if(resultPointsGlobal == ""){

//                                             console.log("1 me aaya");
//                                             resolve(resultPointsGlobal);

//                                         }else{

//                                             console.log("2 me aaya");

//                                             resolve(resultPointsGlobal[0]);
//                                         }


//                                     });


//                         });
//                     }


//                     function getPointsByOrg() {
//                         console.log("agyaaa");
//                         return new Promise(function(resolve,reject) {
                                    
//                                 if(reqObj.organisation_id > 0){
//                                     var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }

//                                         if(resultPointsByOrg == ""){

//                                             console.log("1 me aaya");
//                                             resolve(resultPointsByOrg);

//                                         }else{

//                                             console.log("2 me aaya");

//                                             resolve(resultPointsByOrg[0]);
//                                         }


//                                     });
//                                 }
//                                 else{
//                                     var resultPointsByOrg = [];
//                                     resolve(resultPointsByOrg);
//                                 }


//                         });
//                     }

//                     function getDeviceInfo() {
//                         console.log("agyaaa");
//                         return new Promise(function(resolve,reject) {
                                    
                                
//                                     var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
//                                     if(err){
//                                     console.error('SQL error: ', err);
//                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                     }

//                                         if(resultDeviceInfo == ""){

//                                             console.log("1 me aaya");
//                                             resolve(resultDeviceInfo);

//                                         }else{

//                                             console.log("2 me aaya");

//                                             resolve(resultDeviceInfo[0]);
//                                         }


//                                     });
                                


//                         });
//                     }

//                          getDeviceInfo().then(function(data) {
//                                         var deviceData = data;
//                                         // console.log(data.device_type);
//                                         // console.log(data.device_token);
//                                         // console.log(444444444444444);        
//                                 checkReferalPoints(deviceData).then(function(data) {
//                                     console.log("3 me aaya");
//                                     if(data== true){
                            
                           
//                                         addWalking(deviceData).then(function(data) {
//                                                 console.log("4 me aaya");
//                                                 console.log(data);


                                                

//                                                 if(data== true){
                                                    
//                                                     getPointsGlobal().then(function(data) {
//                                                     console.log("3 me aaya1");

//                                                     var globalPoints = data;

//                                                     if(data){

//                                                         getPointsByOrg().then(function(data) {
//                                                                     console.log("4 me aaya");
//                                                                     console.log(data);
//                                                                     var pointsInOrganisation = data;
//                                                                     var jsonObj = {};
//                                                                     if(globalPoints.userid == null){

//                                                                         jsonObj.userid = reqObj.userid
//                                                                         // jsonObj.name = globalPoints.name
//                                                                         // jsonObj.email = globalPoints.email
//                                                                         // jsonObj.profileImg = globalPoints.profileImg
//                                                                         jsonObj.globalPoints = 0
//                                                                         jsonObj.pointsInOrganisation = 0
//                                                                     }else{
//                                                                         jsonObj.userid = globalPoints.userid
//                                                                         // jsonObj.name = globalPoints.name
//                                                                         // jsonObj.email = globalPoints.email
//                                                                         // jsonObj.profileImg = globalPoints.profileImg
//                                                                         jsonObj.globalPoints = globalPoints.globalPoints
//                                                                         jsonObj.outdoorpoint = globalPoints.outdoorpoint
//                                                                         jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
//                                                                     }
                                                                   
//                                                                     res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
//                                                                 });
//                                                         }
//                                                     });

//                                                 }
//                                                 else{
//                                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                                 }
//                                                 //next();
//                                             });


//                                         }
//                                     //next();
//                                 });


//                             });

                        

//                 }
// }
// });
// }
// catch(ex){
// console.error("Internal error:"+ex);
// return next(ex);
// }
});
//end new updated 1.52

//get walking history

router.post('/getWalking', middleware, function(req,res,next){
    console.log(1111111);
try{
var reqObj = req.body;        

console.log(reqObj);
        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT *, DATE_FORMAT(date, '%d-%m-%Y %H:%i:%s') as daten, DATE_FORMAT(date, '%d-%m-%Y %r') as dater from tb_walking_history WHERE  tb_walking_history.userid =  '"+reqObj.userid+"' order by tb_walking_history.id desc limit 100", function (err, result){
            if(err){
            console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
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
            console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
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
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            if(result==''){

            res.json({"status":'false',"msg":'No record found'});
                
            }else{


                
                var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease,DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_users.parent_id,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                    if(err){
                                                    console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
return next(ex);
}
});



//updateProfile

router.post('/updateProfile', middleware, function(req,res,next){
    res.json({"status":'false',"msg":'somthing went wrong'});
    
    // try{
    // var reqObj = req.body;        
    
    
    //         req.getConnection(function(err, conn){
    
                
    
    //             var updateString = "";
    //             var msg = "Successful";
    
    //             function checkPhoneNumber() {
                
    
    //                 return new Promise(function(resolve,reject) {
    //                 if(reqObj.phone && reqObj.phone!=""){
    
    
    //                 if(updateString == ""){
                        
    
    //                     var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
    //                         {
    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                         }
    //                         console.log(resultCheckPhone);
    //                             if(resultCheckPhone == ""){
    
    //                             updateString = "phone='"+reqObj.phone+"'";
    
    //                             msg = "Successful";
    //                             resolve(true);
    
    
    //                         }
    //                         else{
    //                             msg = "Phone is already registered!";
    //                             resolve(true);
    //                         }
    //                     });
                        
    //                 }
    //                 else{
    
    //                     var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
    //                         {
    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                         }
    
    //                           console.log(resultCheckPhone);
    //                             if(resultCheckPhone == ""){
    
    //                             updateString = updateString+",phone='"+reqObj.phone+"'";
    
    //                             msg = "Successful";
    //                             resolve(true);
    
    //                         }
    //                         else{
    //                             msg = "Phone is already registered!";
    //                             resolve(true);
    //                         }
    //                     });
    //                 }
                    
    //             }
    //             else{
    //               resolve(true);
    //             }
    //         });
    //             };
    
    
    
    //             function updateAllProfileData() {
    
    
    //                 return new Promise(function(resolve,reject) {
    
    //                   console.log(reqObj);
                      
    //                 if(reqObj.name){
    //                 if(updateString == ""){
    //                     updateString = "name='"+reqObj.name+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",name='"+reqObj.name+"'";
    //                 }
                    
    //             }
    //             if(reqObj.dob){
    //                 if(updateString == ""){
    //                     updateString = "dob='"+reqObj.dob+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",dob='"+reqObj.dob+"'";
    //                 }
                    
    //             }
    
    //             if(reqObj.gender){
    //                 if(updateString == ""){
    //                     updateString = "gender='"+reqObj.gender+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",gender='"+reqObj.gender+"'";
    //                 }
                    
    //             }
    
    //             if(reqObj.height_fit_inc){
    //                 if(updateString == ""){
    //                     updateString = "height_fit_inc='"+reqObj.height_fit_inc+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",height_fit_inc='"+reqObj.height_fit_inc+"'";
    //                 }
                    
    //             }
    
    //             if(reqObj.weight_kg){
    //                 if(updateString == ""){
    //                     updateString = "weight_kg='"+reqObj.weight_kg+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",weight_kg='"+reqObj.weight_kg+"'";
    //                 }
                    
    //             }
    
    //             if(reqObj.disease){
    //                 if(updateString == ""){
    //                     updateString = "disease='"+reqObj.disease+"'";
    //                 }
    //                 else{
    //                     updateString = updateString+",disease='"+reqObj.disease+"'";
    //                 }
                    
    //             }
    
    //             if(reqObj.disease == ""){
    //                 if(updateString == ""){
    //                     updateString = "disease=''";
    //                 }
    //                 else{
    //                     updateString = updateString+",disease=''";
    //                 }
                    
    //             }
    
    //             if(reqObj.profileImg && reqObj.profileImg!=""){
    
    //                 var imagesFile = new Buffer(reqObj.profileImg, 'base64');
    //                 var timestamp  =  Date.now();
    //                 fs.writeFileSync("./Images/"+timestamp+".jpg", imagesFile);
    
    //                 if(updateString == ""){
    //                     updateString = "profileImg='"+defaultUrl+timestamp+".jpg'";
                        
    //                 }
    //                 else{
    //                     updateString = updateString+",profileImg='"+defaultUrl+timestamp+".jpg'";
    //                 }
                    
    //             }
                
    
    //             if(updateString != ""){
    
    //                     //res.json({"status":'f',"msg":"Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'"}); return false;
    //                     var queryUpdate = "Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'";
                    
    
    
    //             var query = conn.query(queryUpdate, function (err, result){
    //             if(err){
    //             console.error('SQL error: ', err);
    //             res.json({"status":'false',"msg":'Something went wrong!'});
    //             }
    //             if(result==''){
    
    //             //res.json({"status":'false',"msg":'Something went wrong'});
    //              resolve("wrong");   
    //             }else{
    
    
    //                 var queryPic = conn.query("SELECT count(tb_points.id) as c, tb_users.organisation_id as organisation_id from tb_points, tb_users WHERE  tb_points.userid = "+reqObj.userid+" AND tb_points.points_type = 6 and tb_points.userid=tb_users.id and tb_users.profileImg != ''", function (err, resultSelectPic){
    //                                                     if(err){
    //                                                     console.error('SQL error: ', err);
    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                     }
                                                        
    //                                                     console.log(909090909090);
    //                                                     console.log(resultSelectPic[0]);
    //                                                     if(resultSelectPic[0].c == 0){
    
    //                                                                         if(reqObj.profileImg && reqObj.profileImg!=""){
    
    //                                                                             console.log(9090909090111);
                                                        
    //                                                                             var organisation_id = parseInt(resultSelectPic[0].organisation_id);    
    //                                                                             var queryInsert = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+organisation_id+"', 250, 6, 0)", function (err, resultInsert){
    //                                                                                                                 if(err){
    //                                                                                                                 console.error('SQL error: ', err);
    //                                                                                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                 }  
                                                                                                                         
    //                                                                                                                             //  custom by MCT  insert point in new table start
    //                                                                                                                                     //update point start
    //                                                                                                                                     var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+250+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+250+" WHERE userid  = '"+reqObj.userid+"'"
    //                                                                                                                                     conn.query(update_point, (err, result)=>{
    //                                                                                                                                         if(err){
    //                                                                                                                                         console.error('SQL error: ', err);
    //                                                                                                                                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                                         }
    //                                                                                                                                     })
    //                                                                                                                                     var d = new Date();
    
    //                                                                                                                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
    //                                                                                                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
    //                                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                                     if(err){
    //                                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                                     }
    //                                                                                                                                 });
    //                                                                                                                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
    //                                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                                     if(err){
    //                                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                                     }
    //                                                                                                                                 })
    //                                                                                                                                     //update point end
    //                                                                                                                             //  custom by MCT insert point in new table end
                                                                                                                                                   
    
    
    //                                                                                                                                         if(reqObj.device_type == "iOS"){
    //                                                                                                                                              let deviceToken = reqObj.device_token;
    //                                                                                                                                              //console.log(resultCheck[0].device_token);
    //                                                                                                                                              // Prepare the notifications
    //                                                                                                                                              let notification = new apn.Notification();
    //                                                                                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
    //                                                                                                                                              notification.badge = 0;
    //                                                                                                                                              notification.sound = "default";
    //                                                                                                                                              notification.alert = "You have earned 250 bonus points by updating your profile pic.";
    //                                                                                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                                                                                                 
    //                                                                                                                                              // Replace this with your app bundle ID:
    //                                                                                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                                                                                                 
    //                                                                                                                                              // Send the actual notification
    //                                                                                                                                              setTimeout(function () {
    //                                                                                                                                                     apnProvider.send(notification, deviceToken).then( result => {
    //                                                                                                                                                             // Show the result of the send operation:
    //                                                                                                                                                             console.log(1111111111111111111111111);
    //                                                                                                                                                             console.log(result);
    //                                                                                                                                                          });
    //                                                                                                                                                          // Close the server
    //                                                                                                                                                          apnProvider.shutdown();
    //                                                                                                                                                 }, 2000);    
    
                                                                                                                                                 
    //                                                                                                                                         }else if(reqObj.device_type == "Android"){
    
    //                                                                                                                                             //console.log(resultCheck[0].device_token);
    //                                                                                                                                             console.log(2222222222222222);
    
    //                                                                                                                                             // Prepare a message to be sent
    //                                                                                                                                             var message = new gcm.Message({
    
    //                                                                                                                                                 data: { key:  "You have earned 250 bonus points by updating your profile pic."},
    
    //                                                                                                                                                     notification: {
    //                                                                                                                                                         title: "Walkify",
    //                                                                                                                                                         icon: "ic_launcher",
    //                                                                                                                                                         body: "You have earned 250 bonus points by updating your profile pic."
    //                                                                                                                                                     }
    //                                                                                                                                             });
    //                                                                                                                                             message.addData({
    //                                                                                                                                                             message: "You have earned 250 bonus points by updating your profile pic."
    //                                                                                                                                                         });
    //                                                                                                                                             // Specify which registration IDs to deliver the message to
    //                                                                                                                                             var regTokens = [reqObj.device_token];
                                                                                                                                                 
    //                                                                                                                                             // Actually send the message
    
    //                                                                                                                                             setTimeout(function () {
                                                                                                                                                    
    
    //                                                                                                                                                 sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    //                                                                                                                                                         if (err) console.error(err);
    //                                                                                                                                                         else console.log(response);
    //                                                                                                                                                     });
    
    
    //                                                                                                                                             }, 2000); 
    
                                                                                                                                                
    
    
    
    //                                                                                                                                         }
                                                                                                                    
    
    //                                                                             });
    
    //                                                                          }   else{
    
    //                                                                             console.log(9090909092222);
                                                   
    
    //                                                                          }
    //                                                     }
    
    
    
    //                                                     var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
    //                                                     if(err){
    //                                                     console.error('SQL error: ', err);
    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                     }
    //                                                     if(resultSelect==''){
    
    //                                                         //res.json({"status":'false',"msg":'Something went wrong.'});
    //                                                         resolve("wrong");
    //                                                     }else{
    
    //                                                             var responseData = {};
    
    //                                                             responseData.id = resultSelect[0].id;
    //                                                             responseData.name = resultSelect[0].name;
    //                                                             responseData.email = resultSelect[0].email;
    //                                                             responseData.profileImg = resultSelect[0].profileImg;
    //                                                             responseData.dob = resultSelect[0].dob;
    //                                                             responseData.dobn = resultSelect[0].dobn;
    //                                                             responseData.gender = resultSelect[0].gender;
    //                                                             responseData.phone = resultSelect[0].phone;
    //                                                             responseData.disease = resultSelect[0].disease;
    //                                                             responseData.height_fit_inc = resultSelect[0].height_fit_inc;
    //                                                             responseData.weight_kg = resultSelect[0].weight_kg;
    //                                                             responseData.device_type = resultSelect[0].device_type;
    //                                                             responseData.referral_code = resultSelect[0].referral_code;
    //                                                             responseData.organisation_id = resultSelect[0].organisation_id;
    //                                                             responseData.organisation_name = resultSelect[0].organisation_name;
    //                                                             responseData.organisation_code = resultSelect[0].organisation_code;
    //                                                             responseData.organisation_logo = resultSelect[0].organisation_logo;
    
    //                                                             var totalFieldsFilled = 0;
    //                                                             if(responseData.name != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    //                                                             if(responseData.email != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    //                                                             if(responseData.profileImg != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    //                                                             if(responseData.dob != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    //                                                             if(responseData.gender != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    
    //                                                             if(responseData.phone != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    
    //                                                             if(responseData.height_fit_inc != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    
    //                                                             if(responseData.weight_kg != ""){
    //                                                                 totalFieldsFilled = totalFieldsFilled+1;
    //                                                             }
    
    //                                                             responseData.profileComplete = (totalFieldsFilled/8)*100+"%";                       
                                                                    
    //                                                             //res.json({"status":'true',"msg":msg,"response":responseData});
    //                                                             resolve(responseData);
                                                         
    //                                                     }
    //                                                     });
    
    //                 });
                        
                    
    //             }
    //             });
    //             }
    //                 else{
    //                     //res.json({"status":'false',"msg":'Sent valid parameters.'});
    //                     resolve("invalid");
    //                 }
    //         });
    //             };
    
    
            
    //             checkPhoneNumber().then(function(data) {
    
                    
    //                 updateAllProfileData().then(function(dataU) {
    
    //                         if(dataU=="invalid"){
    //                             res.json({"status":'false',"msg":'Sent valid parameters.'});
    //                         }else if(dataU=="wrong"){
    //                             res.json({"status":'false',"msg":'Something went wrong'});
    //                         }
    //                         else{
    //                             res.json({"status":'true',"msg":msg,"response":dataU}); 
    //                         }
    
    //                 });
    
    //             });
    
    
    
    
    
                
    //             });
    
    
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
});
//
router.post('/ProfileUpdateFivethree', middleware, function(req,res,next){
    //res.json({"status":'false',"msg":'somthing went wrong'});
    
    try{
    var reqObj = req.body;        
    
    
            req.getConnection(function(err, conn){
    
                
    
                var updateString = "";
                var msg = "Successful";
    
                function checkPhoneNumber() {
                
    
                    return new Promise(function(resolve,reject) {
                    if(reqObj.phone && reqObj.phone!=""){
    
    
                    if(updateString == ""){
                        
    
                        var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
                            {
                            if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }
                            console.log(resultCheckPhone);
                                if(resultCheckPhone == ""){
    
                                updateString = "phone='"+reqObj.phone+"'";
    
                                msg = "Successful";
                                resolve(true);
    
    
                            }
                            else{
                                msg = "Phone is already registered!";
                                resolve(true);
                            }
                        });
                        
                    }
                    else{
    
                        var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
                            {
                            if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }
    
                              console.log(resultCheckPhone);
                                if(resultCheckPhone == ""){
    
                                updateString = updateString+",phone='"+reqObj.phone+"'";
    
                                msg = "Successful";
                                resolve(true);
    
                            }
                            else{
                                msg = "Phone is already registered!";
                                resolve(true);
                            }
                        });
                    }
                    
                }
                else{
                  resolve(true);
                }
            });
                };
    
    
    
                function updateAllProfileData() {
    
    
                    return new Promise(function(resolve,reject) {
    
                      console.log(reqObj);
                      
                    if(reqObj.name){
                    if(updateString == ""){
                        updateString = "name='"+reqObj.name+"'";
                    }
                    else{
                        updateString = updateString+",name='"+reqObj.name+"'";
                    }
                    
                }
                if(reqObj.dob){
                    if(updateString == ""){
                        updateString = "dob='"+reqObj.dob+"'";
                    }
                    else{
                        updateString = updateString+",dob='"+reqObj.dob+"'";
                    }
                    
                }
    
                if(reqObj.gender){
                    if(updateString == ""){
                        updateString = "gender='"+reqObj.gender+"'";
                    }
                    else{
                        updateString = updateString+",gender='"+reqObj.gender+"'";
                    }
                    
                }
    
                if(reqObj.height_fit_inc){
                    if(updateString == ""){
                        updateString = "height_fit_inc='"+reqObj.height_fit_inc+"'";
                    }
                    else{
                        updateString = updateString+",height_fit_inc='"+reqObj.height_fit_inc+"'";
                    }
                    
                }
    
                if(reqObj.weight_kg){
                    if(updateString == ""){
                        updateString = "weight_kg='"+reqObj.weight_kg+"'";
                    }
                    else{
                        updateString = updateString+",weight_kg='"+reqObj.weight_kg+"'";
                    }
                    
                }
    
                if(reqObj.disease){
                    if(updateString == ""){
                        updateString = "disease='"+reqObj.disease+"'";
                    }
                    else{
                        updateString = updateString+",disease='"+reqObj.disease+"'";
                    }
                    
                }
    
                if(reqObj.disease == ""){
                    if(updateString == ""){
                        updateString = "disease=''";
                    }
                    else{
                        updateString = updateString+",disease=''";
                    }
                    
                }
    
                if(reqObj.profileImg && reqObj.profileImg!=""){
    
                    var imagesFile = new Buffer(reqObj.profileImg, 'base64');
                    var timestamp  =  Date.now();
                    fs.writeFileSync("./Images/"+timestamp+".jpg", imagesFile);
    
                    if(updateString == ""){
                        updateString = "profileImg='"+defaultUrl+timestamp+".jpg'";
                        
                    }
                    else{
                        updateString = updateString+",profileImg='"+defaultUrl+timestamp+".jpg'";
                    }
                    
                }
                
    
                if(updateString != ""){
    
                        //res.json({"status":'f',"msg":"Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'"}); return false;
                        var queryUpdate = "Update tb_users set "+updateString+" where tb_users.id= '"+reqObj.userid+"'";
                    
    
    
                var query = conn.query(queryUpdate, function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                if(result==''){
    
                //res.json({"status":'false',"msg":'Something went wrong'});
                 resolve("wrong");   
                }else{
    
    
                    var queryPic = conn.query("SELECT count(tb_points.id) as c, tb_users.organisation_id as organisation_id from tb_points, tb_users WHERE  tb_points.userid = "+reqObj.userid+" AND tb_points.points_type = 6 and tb_points.userid=tb_users.id and tb_users.profileImg != ''", function (err, resultSelectPic){
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        
                                                        console.log(909090909090);
                                                        console.log(resultSelectPic[0]);
                                                        if(resultSelectPic[0].c == 0){
    
                                                                            if(reqObj.profileImg && reqObj.profileImg!=""){
    
                                                                                console.log(9090909090111);
                                                        
                                                                                var organisation_id = parseInt(resultSelectPic[0].organisation_id);    
                                                                                var queryInsert = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+organisation_id+"', 250, 6, 0)", function (err, resultInsert){
                                                                                                                    if(err){
                                                                                                                    console.error('SQL error: ', err);
                                                                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                                                    }  
                                                                                                                         
                                                                                                                                //  custom by MCT  insert point in new table start
                                                                                                                                        //update point start
                                                                                                                                        var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+250+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+250+" WHERE userid  = '"+reqObj.userid+"'"
                                                                                                                                        conn.query(update_point, (err, result)=>{
                                                                                                                                            if(err){
                                                                                                                                            console.error('SQL error: ', err);
                                                                                                                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                        var d = new Date();
    
                                                                                                                                            var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                                                    var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
                                                                                                                                    conn.query(update_point, (err, result)=>{
                                                                                                                                        if(err){
                                                                                                                                        console.error('SQL error: ', err);
                                                                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                    var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+250+"', 0,'"+newdate_vari+"', 'profilepic', 'profilepic', 'profilepic' )"
                                                                                                                                    conn.query(update_point, (err, result)=>{
                                                                                                                                        if(err){
                                                                                                                                        console.error('SQL error: ', err);
                                                                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                        //update point end
                                                                                                                                //  custom by MCT insert point in new table end
                                                                                                                                                   
    
    
                                                                                                                                            if(reqObj.device_type == "iOS"){
                                                                                                                                                 let deviceToken = reqObj.device_token;
                                                                                                                                                 //console.log(resultCheck[0].device_token);
                                                                                                                                                 // Prepare the notifications
                                                                                                                                                 let notification = new apn.Notification();
                                                                                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                                                                                 notification.badge = 0;
                                                                                                                                                 notification.sound = "default";
                                                                                                                                                 notification.alert = "You have earned 250 bonus points by updating your profile pic.";
                                                                                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                                                                                 
                                                                                                                                                 // Replace this with your app bundle ID:
                                                                                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                                                                                 
                                                                                                                                                 // Send the actual notification
                                                                                                                                                 setTimeout(function () {
                                                                                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                                                                                // Show the result of the send operation:
                                                                                                                                                                console.log(1111111111111111111111111);
                                                                                                                                                                console.log(result);
                                                                                                                                                             });
                                                                                                                                                             // Close the server
                                                                                                                                                             apnProvider.shutdown();
                                                                                                                                                    }, 2000);    
    
                                                                                                                                                 
                                                                                                                                            }else if(reqObj.device_type == "Android"){
    
                                                                                                                                                //console.log(resultCheck[0].device_token);
                                                                                                                                                console.log(2222222222222222);
    
                                                                                                                                                // Prepare a message to be sent
                                                                                                                                                var message = new gcm.Message({
    
                                                                                                                                                    data: { key:  "You have earned 250 bonus points by updating your profile pic."},
    
                                                                                                                                                        notification: {
                                                                                                                                                            title: "Walkify",
                                                                                                                                                            icon: "ic_launcher",
                                                                                                                                                            body: "You have earned 250 bonus points by updating your profile pic."
                                                                                                                                                        }
                                                                                                                                                });
                                                                                                                                                message.addData({
                                                                                                                                                                message: "You have earned 250 bonus points by updating your profile pic."
                                                                                                                                                            });
                                                                                                                                                // Specify which registration IDs to deliver the message to
                                                                                                                                                var regTokens = [reqObj.device_token];
                                                                                                                                                 
                                                                                                                                                // Actually send the message
    
                                                                                                                                                setTimeout(function () {
                                                                                                                                                    
    
                                                                                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                                                                                            if (err) console.error(err);
                                                                                                                                                            else console.log(response);
                                                                                                                                                        });
    
    
                                                                                                                                                }, 2000); 
    
                                                                                                                                                
    
    
    
                                                                                                                                            }
                                                                                                                    
    
                                                                                });
    
                                                                             }   else{
    
                                                                                console.log(9090909092222);
                                                   
    
                                                                             }
                                                        }
    
    
    
                                                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                        if(resultSelect==''){
    
                                                            //res.json({"status":'false',"msg":'Something went wrong.'});
                                                            resolve("wrong");
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
    
                                                                var totalFieldsFilled = 0;
                                                                if(responseData.name != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
                                                                if(responseData.email != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
                                                                if(responseData.profileImg != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
                                                                if(responseData.dob != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
                                                                if(responseData.gender != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
    
                                                                if(responseData.phone != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
    
                                                                if(responseData.height_fit_inc != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
    
                                                                if(responseData.weight_kg != ""){
                                                                    totalFieldsFilled = totalFieldsFilled+1;
                                                                }
    
                                                                responseData.profileComplete = (totalFieldsFilled/8)*100+"%";                       
                                                                    
                                                                //res.json({"status":'true',"msg":msg,"response":responseData});
                                                                resolve(responseData);
                                                         
                                                        }
                                                        });
    
                    });
                        
                    
                }
                });
                }
                    else{
                        //res.json({"status":'false',"msg":'Sent valid parameters.'});
                        resolve("invalid");
                    }
            });
                };
    
    
            
                checkPhoneNumber().then(function(data) {
    
                    
                    updateAllProfileData().then(function(dataU) {
    
                            if(dataU=="invalid"){
                                res.json({"status":'false',"msg":'Sent valid parameters.'});
                            }else if(dataU=="wrong"){
                                res.json({"status":'false',"msg":'Something went wrong'});
                            }
                            else{
                                res.json({"status":'true',"msg":msg,"response":dataU}); 
                            }
    
                    });
    
                });
    
    
    
    
    
                
                });
    
    
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
//1.54
//updateBMI
    
router.post('/updateBMIData', middleware, function(req,res,next){
    // res.json({"status":'false',"msg":'please update app'});
    try{
    var reqObj = req.body;        
    console.log("updatebmi");
    console.log(reqObj);
    
            req.getConnection(function(err, conn){
    
                
                var queryUpdate = "Update tb_users set  tb_users.gender =  '"+reqObj.gender+"', tb_users.height_fit_inc =  '"+reqObj.height_fit_inc+"', tb_users.weight_kg =  '"+reqObj.weight_kg+"', tb_users.device_type =  '"+reqObj.device_type+"', tb_users.device_token =  '"+reqObj.device_token+"', tb_users.imei =  '"+reqObj.imei+"' where tb_users.id= '"+reqObj.userid+"'";
                
    
                var query = conn.query(queryUpdate, function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                if(result==''){
    
                res.json({"status":'false',"msg":'Something went wrong'});
                    
                }else{
    
    
                    function checkReferalPoints(deviceData) {
                            console.log("agyaaadeviceData");
                            console.log(deviceData);
                            return new Promise(function(resolve,reject) {
                                
                                var distance = parseFloat(deviceData.tot_distance);
                                var stepscount = parseFloat(deviceData.tot_stepscount);
                                var parent_id = parseFloat(deviceData.parent_id);
                                var user_org = parseFloat(deviceData.user_org);
                                reqObj.parent_id = parent_id;
                                reqObj.organisation_id = user_org;
                                
    
                                    if((distance >= 5 || stepscount>20) && parent_id > 0){
                                        console.log(distance);
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultCheckReferalPoints == ""){
    
                                                console.log("1 me aaya");
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                         
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.parent_id+"'",(err, result_userid)=>{
                                                        if(result_userid.length >0){
                                                            var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.parent_id+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                }
                                                            })
                                                            var d = new Date();
            
                                                                        var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                   var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
                                                                   conn.query(update_point, (err, result)=>{
                                                                       if(err){
                                                                       console.error('SQL error: ', err);
                                                                       res.json({"status":'false',"msg":'Something went wrong!'});
                                                                       }
                                                                   });    
                                                        }
                                                         else {
                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.parent_id+"', 0, 50, 0, 0, 50 )"
                                                            conn.query(insertpoint, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
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
                                                                                 notification.alert = "You have earned 50 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    console.log(1111111111111111111111111);
                                                                                    console.log(result);
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                console.log(deviceData.parent_device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral points"
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
                                                    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+reqObj.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                                        if(result_userid.length>0){  
                                                            var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                }
                                                            })
           
                                                           var d = new Date();
           
                                                                       var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                  var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                  conn.query(update_point, (err, result)=>{
                                                                      if(err){
                                                                      console.error('SQL error: ', err);
                                                                      res.json({"status":'false',"msg":'Something went wrong!'});
                                                                      }
                                                                  });   
                                                        }
                                                         else {

                                                            
                                                                var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" )"
                                                                conn.query(insertpoint, (err, result)=>{
                                                                    if(err){
                                                                    console.error('SQL error: ', err);
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
                                                                                 console.log(deviceData.device_token);
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 50 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                console.log(1111111111111111111111111);
                                                                                                console.log(result);
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                console.log(deviceData.device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            if (err) console.error(err);
                                                                                            else console.log(response);
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                console.log("2 me aaya");
    
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
                            console.log("1");
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                        console.log(resultGuestImei);
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckPoints = conn.query("SELECT * FROM `tb_points` where userid ='"+reqObj.userid+"'", function (err, resultCheckPoints){
                                                                            if(err){
                                                                    console.error('SQL error: ', err);
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    
                                                                    console.log(resultCheckPoints);
                                                                    console.log("2");
                                                                    if(resultCheckPoints==""){
    
                                                                                var queryCheckGuestPoints = conn.query("SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_points_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestPoints){
                                                                                                if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        console.log("3");
                                                                                        console.log(resultCheckGuestPoints);
                                                                                        if(resultCheckGuestPoints!=""){
    
    
                                                                                            asyncLoop(resultCheckGuestPoints, function (v, next)
    {
        var query = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to, created_at) Values('"+reqObj.userid+"',0, '"+v.points+"', '"+v.points_type+"', 0, '"+v.dten+"')", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                    if(result_userid.length>0){
                        var update_point = "UPDATE tb_newpoint SET points = points+"+v.points+", bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+v.points+" WHERE userid = '"+reqObj.userid+"'"
                        conn.query(update_point, (err, result)=>{
                            if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }
                        })      
                    }
                    else {
                        var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+v.points+"', 0, 0, 0, '"+v.points+"' )"
                        conn.query(insertpoint, (err, result)=>{
                            if(err){
                            console.error('SQL error: ', err);
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
        if (err)
        {
            console.error('Error: ' + err.message);
            return;
        }
     
        resolve(true);
    });
    
                //                                                                                  resultCheckGuestPoints.forEach((v) => {
                //                                                                                     console.log("4");
    
                //                                                                                     var query = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to, created_at) Values('"+reqObj.userid+"',0, '"+v.points+"', 1, 0, '"+v.dten+"')", function (err, result){
                // if(err){
                // console.error('SQL error: ', err);
                // res.json({"status":'false',"msg":'Something went wrong!'});
                // }
    
                // });
    
    
                //                                                                                     });
                                                                                            
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
                            console.log("5");
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                        console.log(resultGuestImei);
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckWalking = conn.query("SELECT * FROM `tb_walking_history` where userid ='"+reqObj.userid+"'", function (err, resultCheckWalking){
                                                                            if(err){
                                                                    console.error('SQL error: ', err);
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    console.log(resultCheckWalking);
                                                                    console.log("6");
                                                                    if(resultCheckWalking==""){
    
                                                                                var queryCheckGuestWalking = conn.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_walking_history_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestWalking){
                                                                                                if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        console.log("7");
                                                                                        console.log(resultCheckGuestWalking);
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
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
    next();
                });
    }, function (err)
    {
        if (err)
        {
            console.error('Error: ' + err.message);
            return;
        }
     
        resolve(true);
    });
    
                //                                                                                  resultCheckGuestWalking.forEach((v) => {
                //                                                                                     console.log("8");
                //                                                                                     var calPerMin = (0.035 * parseFloat(reqObj.weight_kg)) + ((v.velocity * 2) / (reqObj.height_fit_inc/3.2808)) * (0.029) * (parseFloat(reqObj.weight_kg));
                //                                                                                     calPerMin = Math.round(calPerMin * 100) / 100;
    
                //                                                                                     var query = conn.query("insert into tb_walking_history(userid, distance, distance_unit, date, walk_time, calories, calorie_unit, img, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"', '"+v.distance+"', '"+v.distance_unit+"', '"+v.dten+"', '"+v.walk_time+"', '"+calPerMin+"', 'Kcal', '"+v.img+"', '"+v.from_lat+"', '"+v.from_lng+"', '"+v.to_lat+"', '"+v.to_lng+"')", function (err, result){
                // if(err){
                // console.error('SQL error: ', err);
                // res.json({"status":'false',"msg":'Something went wrong!'});
                // }
    
                // });
    
    
                //                                                                                     });
    
                                                                                              
                                                                                            
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
                            console.log("5");
                            return new Promise(function(resolve,reject) {
    
    
                                var queryGuestImei = conn.query("SELECT * FROM `tb_guestUsers` where imei ='"+reqObj.imei+"'", function (err, resultGuestImei){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                        console.log(resultGuestImei);
                                            if(resultGuestImei!=""){
    
                                                    var queryCheckWalking = conn.query("SELECT * FROM `tb_stepscount_history` where userid ='"+reqObj.userid+"'", function (err, resultCheckWalking){
                                                                            if(err){
                                                                    console.error('SQL error: ', err);
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    }
                                                                    console.log(resultCheckWalking);
                                                                    console.log("6");
                                                                    if(resultCheckWalking==""){
    
                                                                                var queryCheckGuestWalking = conn.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s') as dten FROM `tb_stepscount_history_guest` where imei ='"+reqObj.imei+"'", function (err, resultCheckGuestWalking){
                                                                                                if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                        }
                                                                                        console.log("7");
                                                                                        console.log(resultCheckGuestWalking);
                                                                                        if(resultCheckGuestWalking!=""){
    
    
    
                                                                                             asyncLoop(resultCheckGuestWalking, function (v, next)
    {
        
        var query = conn.query("insert into tb_stepscount_history(userid, stepscount, date, realstp, total_distance, total_calorie) Values('"+reqObj.userid+"', '"+v.stepscount+"', '"+v.dten+"', '"+v.realstp+"', '"+v.total_distance+"', '"+v.total_calorie+"')", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
    next();
                });
    }, function (err)
    {
        if (err)
        {
            console.error('Error: ' + err.message);
            return;
        }
     
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
    
                                    var querytb_points_guest = conn.query("DELETE FROM `tb_points_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelecttb_points_guest){
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
                                                
                                                        var querytb_walking_history_guest = conn.query("DELETE FROM `tb_walking_history_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_walking_history_guest){
                                                               if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                 }
                                                            
                                                                var querytb_user_guest = conn.query("DELETE FROM `tb_guestUsers` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_user_guest){
                                                                   if(err){
                                                                    console.error('SQL error: ', err);
                                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                                     }
                                                                
                                                                 var querytb_user_stcount = conn.query("DELETE FROM `tb_stepscount_history_guest` WHERE imei='"+reqObj.imei+"'", function (err, resultSelectquerytb_user_stcount){
                                                                   if(err){
                                                                    console.error('SQL error: ', err);
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
    
                                    var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, tb_users.disease, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"' AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, resultSelect){
                                                        if(err){
                                                        console.error('SQL error: ', err);
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
                                                        console.error('SQL error: ', err);
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        
                                        console.log("SELECT IFNULL(sum(tb_walking_history_guest.distance),0) as tot_distance,  0 as tot_stepscount, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_walking_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_walking_history_guest.imei");
                                    
                                        var queryLeaderboardByOrg = conn.query("SELECT IFNULL(sum(tb_walking_history_guest.distance),0) as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_walking_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_walking_history_guest.imei", function (err, resultDeviceInfo){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultDeviceInfo == ""){
    
                                                console.log("1 me aaya");
                                                var queryLeaderboardByOrg1 = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo1){
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                            if(resultDeviceInfo1 == ""){
    
                                                                console.log("1 me aaya");
                                                                resolve(resultDeviceInfo);
    
                                                            }else{
    
                                                                console.log("2 me aaya");
                                                                console.log(resultDeviceInfo1);
    
                                                                resolve(resultDeviceInfo1[0]);
                                                            }
    
    
                                                        });
    
                                            }else{
    
                                                console.log("2 me aaya");
                                                console.log(resultDeviceInfo);
    
                                                resolve(resultDeviceInfo[0]);
                                            }
    
    
                                        });
                                    
    
    
                            });
                        }
    
                    getDeviceInfo().then(function(data) {
    
                        var deviceData = data;
                            console.log(deviceData);                   
                            console.log("sanjeev");                   
                                                            
                                updateUserData().then(function(data) {
                                    console.log(1212112);
                                    console.log(data);
                                    if(data){
                                        updateUserWalking().then(function(dataupdateUserWalking) {
                                            console.log(3131313131);
                                            if(dataupdateUserWalking){
    
                                                updateUserSteps().then(function(data) {
    
    
                                                checkReferalPoints(deviceData).then(function(data) {
                                                    console.log("3 me aaya");
                                                    if(data== true){
                                                             deleteGuestData().then(function(GuestData) {
                                                               
                                                                
                                                                   
                                                                    getUserInfo().then(function(datagetUserInfo) {
                                                                        console.log(datagetUserInfo);
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
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
//get ProfileInfo history




router.post('/getProfileInfo', middleware, function(req,res,next){
    console.log(1111111);
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
                        var query = conn.query("SELECT tb_users.id,tb_users.name,tb_users.email,tb_users.dob, DATE_FORMAT(tb_users.dob, '%Y-%m-%d') as dobn,tb_users.gender, tb_users.phone, tb_users.height_fit_inc, tb_users.weight_kg, tb_users.device_type, tb_users.referral_code, tb_users.organisation_id, tb_users.profileImg, tb_users.disease ,tb_users.is_verified as is_email_verified ,tb_users.is_phone_verified, tb_users.parent_id,tb_organisations.organisation_name, tb_organisations.organisation_code, tb_organisations.organisation_logo from tb_users, tb_organisations WHERE  tb_users.id =  '"+reqObj.userid+"'   AND tb_users.status =1 AND tb_users.organisation_id = tb_organisations.id", function (err, result){
                                    if(err){
                                    console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
return next(ex);
}
});



//get user Score

router.post('/getUserScore', function(req,res,next){


try{
var reqObj = req.body;
console.log(reqObj);    
req.getConnection(function(err, conn){
    console.log(conn)
if(err)
{
console.error('SQL Connection error: ', err);
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
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            
                                    var querygetStepsScore = conn.query("SELECT stepscount, date, total_distance, total_calorie FROM `tb_stepscount_history` where userid='"+reqObj.userid+"' order by id DESC limit 1", function (err, resultgetStepsScore){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultgetStepsScore.length < 1){
                                            resultgetStepsScore = {};
                                            console.log("1 me aaya");
                                            resultgetStepsScore.stepscount = "0"
                                                            resultgetStepsScore.date = ''
                                                            resultgetStepsScore.total_distance = "0"
                                                            resultgetStepsScore.total_calorie = "0"

                                            resolve(resultgetStepsScore);

                                        }else{

                                            console.log("2 me aaya");

                                            resolve(resultgetStepsScore[0]);
                                        }


                                    });


                        });
                    }

                    function getPointsGlobal() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsGlobal == ""){

                                            console.log("1 me aaya");
                                            resolve(resultPointsGlobal);

                                        }else{

                                            console.log("2 me aaya");

                                            resolve(resultPointsGlobal[0]);
                                        }


                                    });


                        });
                    }


                    function getPointsByOrg() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                                    
                                if(reqObj.organisation_id > 0){
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points), 0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.status=0 and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsByOrg == ""){

                                            console.log("1 me aaya");
                                            resolve(resultPointsByOrg);

                                        }else{

                                            console.log("2 me aaya");

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
                        console.log("3 me aaya");

                        var globalPoints = data;

                        if(data){

                            getPointsByOrg().then(function(data) {
                                    console.log("4 me aaya");
                                    console.log(data);
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
console.error("Internal error:"+ex);
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
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var query = conn.query("Update tb_users set tb_users.is_loggedIn =  0, tb_users.device_type =  '', tb_users.device_token = ''  where tb_users.id='"+reqObj.userid+"'", function (err, result)
        {
        if(err){
        console.error('SQL error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

        res.json({"status":'true',"msg":'User is logged-Out Now!'});

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});


// Api to check user login
router.post('/isUserLoggedIn', middleware, function(req,res,next){

try{
var reqObj = req.body;
    
req.getConnection(function(err, conn){
if(err)
{
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var query = conn.query("select * from tb_users where tb_users.id='"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function (err, result)
        {
        if(err){
        console.error('SQL error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(result == ""){

                                            console.log("1 me aaya");
                                            res.json({"status":'true', "loginStatus":'false'});

                                        }else{

                                            console.log("2 me aaya");

                                            res.json({"status":'true', "loginStatus":'true'});
                                        }

        

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){
console.error("Internal error:"+ex);
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
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"'", function (err, result)
        {
        if(err){
        console.error('SQL error: ', err);
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
            console.error('SQL error: ', err);
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
        console.log(error);
        res.end("error");
      }else{
        console.log("Message sent: " + response);
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
console.error("Internal error:"+ex);
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
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var queryGet = conn.query("SELECT tb_users.*,tb_otp.otp FROM `tb_users`,`tb_otp` where tb_otp.otp='"+reqObj.user.ver+"' and tb_users.id = tb_otp.userid ORDER BY tb_otp.date DESC limit 1", function (err, resultGet)
        {
        if(err){
        console.error('SQL error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(resultGet == ""){

                                            console.log("1 me aaya");
                                            res.json({"status":'true', "msg":'Something went wrong'});

                                        }else{

                                                
                                                var encryptPasword = cryptLib.encrypt(reqObj.user.npassword, key, iv);
                                                var query = conn.query("Update tb_users set tb_users.password =  '"+encryptPasword+"' where tb_users.email='"+resultGet[0].email+"'", function (err, result)
                                                    {
                                                    if(err){
                                                    console.error('SQL error: ', err);
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
                                                                    console.error('SQL error: ', err);
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
console.error("Internal error:"+ex);
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
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    
    var query = conn.query("SELECT tb_users.*,tb_otp.otp FROM `tb_users`,`tb_otp` where tb_otp.otp='"+reqObj.user.ver+"' and tb_users.id = tb_otp.userid ORDER BY tb_otp.date DESC limit 1", function (err, result)
        {
        if(err){
        console.error('SQL error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }

                        if(result == ""){

                                            console.log("1 me aaya");
                                            res.json({"status":'true', "link":'expired'});

                                        }else{

                                            console.log("2 me aaya");

                                            res.json({"status":'true', "link":'working'});
                                        }

        

            
        });
            


    //res.json({"Insert":"Successful"});

}

});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});



// Api for mobile veritication
router.post('/phoneVerification', middleware, function(req,res,next){

    try{
    var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {
        var queryCheckPhone = conn.query("SELECT * FROM `tb_users` where tb_users.id!='"+reqObj.userid+"' and tb_users.phone = '"+reqObj.phone+"' ", function (err, resultCheckPhone)
            {
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                if(resultCheckPhone == ""){
    
        var queryCheck = conn.query("SELECT * FROM `tb_users` where tb_users.id='"+reqObj.userid+"' and tb_users.is_phone_verified = 0 ", function (err, resultCheck)
            {
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                            if(resultCheck == ""){
    
                                                console.log("ss1 me aaya");
                                                res.json({"status":'false', "msg":'Something went wrong'});
    
                                            }else{
    
                                                console.log("ss2 me aaya");
                                                console.log("");
                                                var queryUpdate = conn.query("Update tb_users set tb_users.is_phone_verified = 1, tb_users.phone = '"+reqObj.phone+"' where tb_users.id='"+reqObj.userid+"' ", function (err, resultUpdate)
                                                        {
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                                        if(resultUpdate == ""){
    
                                                                                            console.log("1 me aaya");
                                                                                            res.json({"status":'true', "msg":'Something went wrong'});
    
                                                                                        }else{
    
                                                                                            console.log("2 me aaya");
                                                                                            // var queryInsertPoint = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+resultCheck[0].id+"','"+resultCheck[0].organisation_id+"', 0, 5, 0)", function (err, resultInsertPoint)
                                                                                            //             {
                                                                                            //             if(err){
                                                                                            //             console.error('SQL error: ', err);
                                                                                            //             res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //             }
                                                                                                             
                                                                                            //             // var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+250+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+250+" WHERE userid = '"+resultCheck[0].id+"'"
                                                                                            //             //     conn.query(update_point, (err, result)=>{
                                                                                            //             //         if(err){
                                                                                            //             //         console.error('SQL error: ', err);
                                                                                            //             //         res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //             //         }
                                                                                            //             //     })
                                                                                            //             //     //update point end
                                                                                            //             //     //  custom by MCT  insert point in new table start
                                                                                            //             //     var d = new Date();
    
                                                                                            //             //     var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                            
                                                                                                            
                                                                                            //             //             //update point start
                                                                                            //             //             var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+resultCheck[0].id+"','"+250+"', 5,'"+newdate_vari+"', 'mobileverfication', 'mobileverfication', 'mobileverfication' )"
                                                                                            //             //             conn.query(update_point, (err, result)=>{
                                                                                            //             //                 if(err){
                                                                                            //             //                 console.error('SQL error: ', err);
                                                                                            //             //                 res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //             //                 }
                                                                                            //             //             });
                                                                                            //             //             var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+resultCheck[0].id+"','"+250+"', 5,'"+newdate_vari+"', 'mobileverfication', 'mobileverfication', 'mobileverfication' )"
                                                                                            //             //             conn.query(update_point, (err, result)=>{
                                                                                            //             //                 if(err){
                                                                                            //             //                 console.error('SQL error: ', err);
                                                                                            //             //                 res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //             //                 }
                                                                                            //             //             })
    
                                                                                            //                         //update point end
                                                                                                                    
    
                                                                                            //                         //
                                                                                            //                 //  custom by MCT insert point in new table end
    
                                                                                                         
                                                                                                              
    
                                                                                            //                             if(resultInsertPoint == ""){
    
                                                                                            //                                                 console.log("ss3 me aaya");
                                                                                            //                                                 res.json({"status":'true', "msg":'Something went wrong'});
    
                                                                                            //                                             }else{
    
                                                                                            //                                                 console.log("ss4 me aaya");
    
                                                                                            //                                                 if(resultCheck[0].device_type == "iOS"){
                                                                                            //                                                      let deviceToken = resultCheck[0].device_token;
                                                                                            //                                                      console.log(resultCheck[0].device_token);
                                                                                            //                                                      // Prepare the notifications
                                                                                            //                                                      let notification = new apn.Notification();
                                                                                            //                                                      notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                            //                                                      notification.badge = 0;
                                                                                            //                                                      notification.sound = "default";
                                                                                            //                                                      notification.alert = "You have earned 250 bonus points by verifying your phone.";
                                                                                            //                                                      notification.payload = {'messageFrom': 'FitIndia'};
                                                                                                                                                 
                                                                                            //                                                      // Replace this with your app bundle ID:
                                                                                            //                                                      notification.topic = "Com.MindCrew.FitIndia";
                                                                                                                                                 
                                                                                            //                                                      // Send the actual notification
                                                                                            //                                                      setTimeout(function () {
                                                                                            //                                                             apnProvider.send(notification, deviceToken).then( result => {
                                                                                            //                                                                     // Show the result of the send operation:
                                                                                            //                                                                     console.log(1111111111111111111111111);
                                                                                            //                                                                     console.log(result);
                                                                                            //                                                                  });
                                                                                            //                                                                  // Close the server
                                                                                            //                                                                  apnProvider.shutdown();
                                                                                            //                                                         }, 2000);    
    
                                                                                                                                                 
                                                                                            //                                                 }else if(resultCheck[0].device_type == "Android"){
    
                                                                                            //                                                     console.log(resultCheck[0].device_token);
                                                                                            //                                                     console.log(2222222222222222);
    
                                                                                            //                                                     // Prepare a message to be sent
                                                                                            //                                                     var message = new gcm.Message({
    
                                                                                            //                                                         data: { key:  "You have earned 250 bonus points by verifying your phone."},
    
                                                                                            //                                                             notification: {
                                                                                            //                                                                 title: "Walkify",
                                                                                            //                                                                 icon: "ic_launcher",
                                                                                            //                                                                 body: "You have earned 250 bonus points by verifying your phone."
                                                                                            //                                                             }
                                                                                            //                                                     });
                                                                                            //                                                     message.addData({
                                                                                            //                                                                     message: "You have earned 250 bonus points by verifying your phone."
                                                                                            //                                                                 });
                                                                                            //                                                     // Specify which registration IDs to deliver the message to
                                                                                            //                                                     var regTokens = [resultCheck[0].device_token];
                                                                                                                                                 
                                                                                            //                                                     // Actually send the message
    
                                                                                            //                                                     setTimeout(function () {
                                                                                                                                                    
    
                                                                                            //                                                         sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            //                                                                 if (err) console.error(err);
                                                                                            //                                                                 else console.log(response);
                                                                                            //                                                             });
    
    
                                                                                            //                                                     }, 2000); 
    
                                                                                                                                                
    
    
    
                                                                                            //                                                 }
    
                                                                                            //                                                 res.json({"status":'true', "msg":'Phone updated'});
                                                                                            //                                             }
    
                                                                                                        
    
                                                                                                            
                                                                                            //             });
    
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
    console.error("Internal error:"+ex);
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
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {
        
        var queryCheck = conn.query("SELECT * FROM `tb_users` where tb_users.verification_code='"+reqObj.user.ver+"' and tb_users.is_verified = 0 and tb_users.verification_code !='' ", function (err, resultCheck)
            {
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
    
                            if(resultCheck == ""){
    
                                                console.log("1 me aaya");
                                                res.json({"status":'true', "link":'expired'});
    
                                            }else{
    
                                                console.log("2 me aaya");
                                                var queryUpdate = conn.query("Update tb_users set tb_users.is_verified = 1 where tb_users.verification_code='"+reqObj.user.ver+"' ", function (err, resultUpdate)
                                                        {
                                                        if(err){
                                                        console.error('SQL error: ', err);
                                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                                        }
    
                                                                        if(resultUpdate == ""){
    
                                                                                            console.log("1 me aaya");
                                                                                            res.json({"status":'true', "link":'expired'});
    
                                                                                        }else{
    
                                                                                            console.log("2 me aaya");
                                                                                            // var queryInsertPoint = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+resultCheck[0].id+"','"+resultCheck[0].organisation_id+"', 0, 4, 0)", function (err, resultInsertPoint)
                                                                                            //             {
                                                                                            //             if(err){
                                                                                            //             console.error('SQL error: ', err);
                                                                                            //             res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //             }
                                                                                            //              //  custom by MCT  insert point in new table start
                                                                                            //                         //update point start
                                                                                            //                     //     var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+250+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+250+" WHERE userid = '"+resultCheck[0].id+"'"
                                                                                            //                     //     conn.query(update_point, (err, result)=>{
                                                                                            //                     //         if(err){
                                                                                            //                     //         console.error('SQL error: ', err);
                                                                                            //                     //         res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //                     //         }
                                                                                            //                     //     })
    
    
                                                                                            //                     //   var d = new Date();
    
                                                                                            //                     //   var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                                  
                                                                                                                  
                                                                                            //                     //           //update point start
                                                                                            //                     //           var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+resultCheck[0].id+"','"+250+"', 4,'"+newdate_vari+"', 'emailverfication', 'emailverfication', 'emailverfication' )"
                                                                                            //                     //           conn.query(update_point, (err, result)=>{
                                                                                            //                     //               if(err){
                                                                                            //                     //               console.error('SQL error: ', err);
                                                                                            //                     //               res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //                     //               }
                                                                                            //                     //           });
                                                                                            //                     //           var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+resultCheck[0].id+"','"+250+"', 4,'"+newdate_vari+"', 'emailverfication', 'emailverfication', 'emailverfication' )"
                                                                                            //                     //           conn.query(update_point, (err, result)=>{
                                                                                            //                     //               if(err){
                                                                                            //                     //               console.error('SQL error: ', err);
                                                                                            //                     //               res.json({"status":'false',"msg":'Something went wrong!'});
                                                                                            //                     //               }
                                                                                            //                     //           })
                                                                                            //                         //update point end
                                                                                            //         //  custom by MCT insert point in new table end    
                                                                                                                
    
    
    
                                                                                            //                             if(resultInsertPoint == ""){
    
                                                                                            //                                                 console.log("1 me aaya");
                                                                                            //                                                 res.json({"status":'true', "link":'expired'});
    
                                                                                            //                                             }else{
    
                                                                                            //                                                 console.log("2 me aaya");
    
                                                                                            //                                                 if(resultCheck[0].device_type == "iOS"){
                                                                                            //                                                      let deviceToken = resultCheck[0].device_token;
                                                                                            //                                                      console.log(resultCheck[0].device_token);
                                                                                            //                                                      // Prepare the notifications
                                                                                            //                                                      let notification = new apn.Notification();
                                                                                            //                                                      notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                            //                                                      notification.badge = 0;
                                                                                            //                                                      notification.sound = "default";
                                                                                            //                                                      notification.alert = "You have earned 250 bonus points by verifying your email.";
                                                                                            //                                                      notification.payload = {'messageFrom': 'FitIndia'};
                                                                                                                                                 
                                                                                            //                                                      // Replace this with your app bundle ID:
                                                                                            //                                                      notification.topic = "Com.MindCrew.FitIndia";
                                                                                                                                                 
                                                                                            //                                                      // Send the actual notification
                                                                                            //                                                      setTimeout(function () {
                                                                                            //                                                             apnProvider.send(notification, deviceToken).then( result => {
                                                                                            //                                                                     // Show the result of the send operation:
                                                                                            //                                                                     console.log(1111111111111111111111111);
                                                                                            //                                                                     console.log(result);
                                                                                            //                                                                  });
                                                                                            //                                                                  // Close the server
                                                                                            //                                                                  apnProvider.shutdown();
                                                                                            //                                                         }, 2000);    
    
                                                                                                                                                 
                                                                                            //                                                 }else if(resultCheck[0].device_type == "Android"){
    
                                                                                            //                                                     console.log(resultCheck[0].device_token);
                                                                                            //                                                     console.log(2222222222222222);
    
                                                                                            //                                                     // Prepare a message to be sent
                                                                                            //                                                     var message = new gcm.Message({
    
                                                                                            //                                                         data: { key:  "You have earned 250 bonus points by verifying your email."},
    
                                                                                            //                                                             notification: {
                                                                                            //                                                                 title: "Walkify",
                                                                                            //                                                                 icon: "ic_launcher",
                                                                                            //                                                                 body: "You have earned 250 bonus points by verifying your email."
                                                                                            //                                                             }
                                                                                            //                                                     });
                                                                                            //                                                     message.addData({
                                                                                            //                                                                     message: "You have earned 250 bonus points by verifying your email."
                                                                                            //                                                                 });
                                                                                            //                                                     // Specify which registration IDs to deliver the message to
                                                                                            //                                                     var regTokens = [resultCheck[0].device_token];
                                                                                                                                                 
                                                                                            //                                                     // Actually send the message
    
                                                                                            //                                                     setTimeout(function () {
                                                                                                                                                    
    
                                                                                            //                                                         sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            //                                                                 if (err) console.error(err);
                                                                                            //                                                                 else console.log(response);
                                                                                            //                                                             });
    
    
                                                                                            //                                                     }, 2000); 
    
                                                                                                                                                
    
    
    
                                                                                            //                                                 }
    
                                                                                            //                                                 res.json({"status":'true', "link":'working'});
                                                                                            //                                             }
    
                                                                                                        
    
                                                                                                            
                                                                                            //             });
    
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
    console.error("Internal error:"+ex);
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
console.error('SQL Connection error: ', err);
res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{
    var query = conn.query("SELECT * from tb_users WHERE  tb_users.email =  '"+reqObj.email+"'", function (err, result)
        {
        if(err){
        console.error('SQL error: ', err);
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
            console.error('SQL error: ', err);
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
        console.log(error);
        res.end("error");
      }else{
        console.log("Message sent: " + response);
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
console.error("Internal error:"+ex);
return next(ex);
}
});


//Add Steps


router.post('/addStepsCount', middleware, function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
});
//  new updated 1.51
router.post('/newaddStepsCount', middleware, function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
});

//Add Steps non pedometer
//  new updated 1.51
router.post('/addStepsCountvfone', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
});
//1.53

//1.54
router.post('/addStepsCountFiveThree', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
    // try{
    // var reqObj = req.body;        
    //         req.getConnection(function(err, conn){
    //                 function checkReferalPoints(deviceData) {
    //                         console.log("agyaaa");
    //                         console.log("agyaaa deviceData : ", deviceData);
    //                         return new Promise(function(resolve,reject) {
                                
    //                             var stepscount = parseFloat(reqObj.stepscount);
    //                             //var parent_id = parseInt(deviceData.parent_id);
    //                                 console.log("agyaaa: ", stepscount);
    //                                 console.log("agyaaa parent_id : ", deviceData.parent_id);
                                    
    //                                 if(stepscount >= 1 && deviceData.parent_id > 0){
    //                                     console.log("sanjeev");
    //                                     var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
    //                                     if(err){
    //                                     console.error('SQL error: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    //                                         console.log("length of : ",resultCheckReferalPoints.length);    
    //                                         if(resultCheckReferalPoints.length < 1){
    
    //                                             console.log("1 me aaya");
    
    //                                                 var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                    //  custom by MCT  insert point in new table start
    //                                                                 //update point start

    //                                                                 // conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+deviceData.parent_id+"'",(err, result_userid)=>{
    //                                                                 //     if(result_userid.length>0){
                                                                                       

    //                                                                 //         var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+deviceData.parent_id+"'"
    //                                                                 //         conn.query(update_point, (err, result)=>{
    //                                                                 //         if(err){
    //                                                                 //         console.error('SQL error: ', err);
    //                                                                 //         res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                 //         }
    //                                                                 //         })
    //                                                                 //         var d = new Date();
    //                                                                 //                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
    //                                                                 //                                                 //update point start
    //                                                                 //                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+deviceData.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
    //                                                                 //                                                 conn.query(update_point, (err, result)=>{
    //                                                                 //                                                     if(err){
    //                                                                 //                                                     console.error('SQL error: ', err);
    //                                                                 //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                 //                                                     }
    //                                                                 //                                                 });
    //                                                                 //     }
    //                                                                 //     else {
    //                                                                 //         var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+deviceData.parent_id+"', 0, 50,0, 0,50 )"
    //                                                                 //         conn.query(insertpoint, (err, result)=>{
    //                                                                 //             if(err){
    //                                                                 //             console.error('SQL error: ', err);
    //                                                                 //             res.json({"status":'false',"msg":'Something went wrong!insert'});
    //                                                                 //             }
    //                                                                 //         })

    //                                                                 //     }
          
    //                                                                 // });

                                                                    
    //                                                                 //update point end
                                                                
    //                                                     //  custom by MCT insert point in new table end       
                                                    
    //                                                         if(deviceData.parent_device_type == "iOS"){
    //                                                                              let deviceToken = deviceData.parent_device_token;
                                                                                 
    //                                                                              // Prepare the notifications
    //                                                                              let notification = new apn.Notification();
    //                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
    //                                                                              notification.badge = 0;
    //                                                                              notification.sound = "default";
    //                                                                              notification.alert = "You have earned 50 referral points.";
    //                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
    //                                                                              // Replace this with your app bundle ID:
    //                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
    //                                                                              // Send the actual notification
    //                                                                              apnProvider.send(notification, deviceToken).then( result => {
    //                                                                                 // Show the result of the send operation:
    //                                                                                 console.log(1111111111111111111111111);
    //                                                                                 console.log(result);
    //                                                                              });
    //                                                                              // Close the server
    //                                                                              apnProvider.shutdown();
    //                                                                         }else if(deviceData.parent_device_type == "Android"){
    
    //                                                                             console.log(deviceData.parent_device_token);
    //                                                                             console.log(2222222222222222);
    
    //                                                                             // Prepare a message to be sent
    //                                                                             var message = new gcm.Message({
    
    //                                                                                 data: { key:  "You have earned 50 referral points"},
    
    //                                                                                     notification: {
    //                                                                                         title: "Walkify",
    //                                                                                         icon: "ic_launcher",
    //                                                                                         body: "You have earned 50 referral points"
    //                                                                                     }
    //                                                                             });
    //                                                                             message.addData({
    //                                                                                             message: "You have earned 50 referral points"
    //                                                                                         });
    //                                                                             // Specify which registration IDs to deliver the message to
    //                                                                             var regTokens = [deviceData.parent_device_token];
                                                                                 
    //                                                                             // Actually send the message
    //                                                                             sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    //                                                                                 if (err) console.error(err);
    //                                                                                 else console.log(response);
    //                                                                             });
    
    
    
    //                                                                         }
    //                                                                         //resolve(true);
                                                    
    
    //                                                 });
    
    
    //                                                 var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                 //  custom by MCT  insert point in new table start
                                                    
    //                                                                         //update point start
    //                                                                         // var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
    //                                                                         // conn.query(update_point, (err, result)=>{
    //                                                                         // if(err){
    //                                                                         // console.error('SQL error: ', err);
    //                                                                         // res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                         // }
    //                                                                         // })
    //                                                                         //update point end
    //                                                                         // var d = new Date();

    //                                                                         //                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                    
                                                                                                    
    //                                                                         //                                 //update point start
    //                                                                         //                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
    //                                                                         //                                 conn.query(update_point, (err, result)=>{
    //                                                                         //                                     if(err){
    //                                                                         //                                     console.error('SQL error: ', err);
    //                                                                         //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                         //                                     }
    //                                                                         //                                 });
    //                                                                         //                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
    //                                                                         //                                 conn.query(update_point, (err, result)=>{
    //                                                                         //                                     if(err){
    //                                                                         //                                     console.error('SQL error: ', err);
    //                                                                         //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                         //                                     }
    //                                                                         //                                 })
    //                                                 //  custom by MCT insert point in new table end
                                                        
    
    //                                                     if(deviceData.device_type == "iOS"){
    //                                                                              let deviceToken = deviceData.device_token;
    //                                                                              console.log(deviceData.device_token);
    //                                                                              // Prepare the notifications
    //                                                                              let notification = new apn.Notification();
    //                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
    //                                                                              notification.badge = 0;
    //                                                                              notification.sound = "default";
    //                                                                              notification.alert = "You have earned 50 referral bonus points.";
    //                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
    //                                                                              // Replace this with your app bundle ID:
    //                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
    //                                                                              // Send the actual notification
    //                                                                              setTimeout(function () {
    //                                                                                     apnProvider.send(notification, deviceToken).then( result => {
    //                                                                                             // Show the result of the send operation:
    //                                                                                             console.log(1111111111111111111111111);
    //                                                                                             console.log(result);
    //                                                                                          });
    //                                                                                          // Close the server
    //                                                                                          apnProvider.shutdown();
    //                                                                                 }, 2000);    
    
                                                                                 
    //                                                                         }else if(deviceData.device_type == "Android"){
    
    //                                                                             console.log(deviceData.device_token);
    //                                                                             console.log(2222222222222222);
    
    //                                                                             // Prepare a message to be sent
    //                                                                             var message = new gcm.Message({
    
    //                                                                                 data: { key:  "You have earned 50 referral bonus points"},
    
    //                                                                                     notification: {
    //                                                                                         title: "Walkify",
    //                                                                                         icon: "ic_launcher",
    //                                                                                         body: "You have earned 50 referral bonus points."
    //                                                                                     }
    //                                                                             });
    //                                                                             message.addData({
    //                                                                                             message: "You have earned 50 referral bonus points"
    //                                                                                         });
    //                                                                             // Specify which registration IDs to deliver the message to
    //                                                                             var regTokens = [deviceData.device_token];
                                                                                 
    //                                                                             // Actually send the message
    
    //                                                                             setTimeout(function () {
                                                                                    
    
    //                                                                                 sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    //                                                                                         if (err) console.error(err);
    //                                                                                         else console.log(response);
    //                                                                                     });
    
    
    //                                                                             }, 2000); 
    
                                                                                
    
    
    
    //                                                                         }
    //                                                                         resolve(true);
    
    
    //                                                 });
    
    //                                                 resolve(true);
    
    //                                         }else{
    
    //                                             console.log("2 me aaya");
    
    //                                             resolve(true);
    //                                         }
    
    
    //                                     });
    
                                    
    
    
    //                                 }
    //                                 else{
    //                                     resolve(true);
    //                                 }
    
    //                         });
    //                     }
            
    //         function addStepsCount() {
    //             console.log("agyaaa");
    //             return new Promise(function(resolve,reject) { 
    //             var query = conn.query("SELECT  IFNULL(sum(stepscount), 0) AS total_steps FROM `tb_stepscount_newhistory` where userid='"+reqObj.userid+"'", function (err, result){
    //                     if(err){
    //                     console.error('SQL error: ', err);
    //                     res.json({"status":'false',"msg":'Something went wrong! new history!'});
    //                     }else{
    //                        var insertquerydata ='';
    //                        var arrrylist = reqObj.data;
    //                       asyncLoop(arrrylist, function (qdata, next)
    //                       {
                              
    //                           if(insertquerydata == ''){
                                  
    //                               conn.query("select starttime from tb_stepscount_newhistory where userid = '"+reqObj.userid+"' and starttime ='"+qdata.StartTime+"'", function(err, result_startdate){
    //                                   console.log(result_startdate.length,"startDateLength")
    //                                   if(result_startdate.length>0){ 
                                          
    //                                    } else {
    //                                     insertquerydata = '('+reqObj.userid+','+qdata.StepCount+','+0+', '+0+','+0+', "'+qdata.StartTime+'","'+qdata.EndTime+'")';
                                        
    //                                    }

    //                                    console.log(insertquerydata,"concat in if condition")
    //                                    next();
    //                               })
                                  
                                  
    //                           } else {
                                
    //                               conn.query("select starttime from tb_stepscount_newhistory where userid = '"+reqObj.userid+"' and starttime ='"+qdata.StartTime+"'", function(err, result_startdate){
    //                                   if(result_startdate.length===0){ 
    //                                       insertquerydata += ',('+reqObj.userid+','+qdata.StepCount+', '+0+','+0+','+0+', "'+qdata.StartTime+'","'+qdata.EndTime+'")';
                                          
    //                                   }
    //                                   console.log(insertquerydata,"concat in else condition")
    //                               })
    //                               next();
                                  
    //                           }
                              
                              
                              
    //                       }, function ()
    //                           {
    //                               if(insertquerydata!=''){
    //                                   conn.query("select imei from tb_users where id = '"+reqObj.userid+"'", function(err, result_imei){
                                                                                    
                                            
    //                                         var isnum = isNaN(result_imei[0].imei)
    //                                   if(isnum == false){
    //                                     resolve(true);
    //                                   }
    //                                   else{

                                      
    //                                   conn.query("SELECT IFNULL(sum(stepscount), 0) AS steps from tb_stepscount_newhistory WHERE userid = '"+reqObj.userid+"'", function (err, resultsteps){
    //                                       if(err){
    //                                           res.json({"err": "error"})
    //                                       }
    //                                       var oldesteps = parseInt(resultsteps[0].steps);
    //                                   var query = "insert into tb_stepscount_newhistory(userid, stepscount, realstp, total_distance, total_calorie, starttime, endtime ) Values "+insertquerydata;
    //                                     console.log(query);
    //                                   conn.query(query, function (err, resultInsertHistory){
    //                                       if(err){
    //                                       console.error('SQL error: ', err);
    //                                       res.json({"err": "error"})
    //                                       }
                                             
                                          
    //                                       conn.query("SELECT IFNULL(sum(stepscount), 0) AS steps from tb_stepscount_newhistory WHERE userid = '"+reqObj.userid+"'", function (err, resultsteps){
    //                                           if(err){
    //                                               res.json({"err": "error"})
    //                                           }

    //                                                   var new_steps = resultsteps;
                                                      
    //                                                    var updatesteps =  parseInt(new_steps[0].steps);
    //                                                     var new_updatesteps =  updatesteps - oldesteps;
                                                       
    //                                               var queryInsertPoint = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', '"+parseInt(new_updatesteps)+"', 7, 0)", function (err, resultInsertPoint){
    //                                                     if(err){
    //                                                     console.error('SQL error: ', err);
    //                                                     res.json({"err": "error"})
    //                                                     }
                                                        
    //                                                     conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
    //                                                         if(err){
    //                                                             res.json({"err": "err"})
    //                                                         }
    //                                                       if(result_userid.length>0){
    //                                                           var update_point = "UPDATE tb_newpoint SET points = points+'"+parseInt(new_updatesteps)+"', bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+0+", total_league_steps ='"+updatesteps+"', total_league_point = total_league_point+'"+parseInt(new_updatesteps)+"' WHERE userid = '"+reqObj.userid+"'"
    //                                                           conn.query(update_point, (err, result)=>{
    //                                                           if(err){
    //                                                           console.error('SQL error: ', err);
    //                                                           res.json({"err": "error"})
    //                                                           }
    //                                                           })           
    //                                                       }
    //                                                       else {
                                                                
    //                                                           var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+parseInt(new_updatesteps)+"', 0, 0, '"+updatesteps+"', '"+parseInt(new_updatesteps)+"' )"
                                                              
    //                                                           conn.query(insertpoint, (err, result)=>{
    //                                                               if(err){
    //                                                               console.error('SQL error: ', err);
    //                                                               res.json({"err": "error"})
    //                                                               }
    //                                                           })
    //                                                       }

    //                                                   });
    //                                                     //  custom by MCT  insert point in new table start
    //                                                                               //update point start UPDATE tb_newpoint SET points = points+'"+parseInt(new_updatesteps)+"' WHERE userid
                                                                                  
    //                                                                               //update point end
    //                                                       //  custom by MCT insert point in new table end
                                                        
      
                                                            
    //                                                            resolve(true);  
    //                                                           //resolve(selectedresultshow);
                                                           
                                                        
    //                                                     });
      
      
                                                       
                                          
    //                                   }); 
    //                                 });


    //                               });
    //                             }
    //                             });
    //                               }
    //                               else{
    //                                 resolve(true);
    //                               }
    //                           }
    //                           );
    //                       }
    //                     });
    //             })
    //           }
    
    
    //         function getPointsGlobal() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
    //                                     var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
    //                                     if(err){
    //                                    // console.error('SQL error: ', err);
    //                                     res.json({"status":'true',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultPointsGlobal == ""){
    
    //                                             //console.log("1 me aaya");
    //                                             resolve(resultPointsGlobal);
    
    //                                         }else{
    
    //                                            // console.log("2 me aaya");
    
    //                                             resolve(resultPointsGlobal[0]);
    //                                         }
    
    
    //                                     });
    
    
    //                         });
    //                     }
    
    
    //                     function getPointsByOrg() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
                                        
    //                                 if(reqObj.organisation_id > 0){
    //                                     var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
    //                                     if(err){
    //                                     console.error('SQL error: ', err);
    //                                     res.json({"status":'true',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultPointsByOrg == ""){
    
    //                                             console.log("1 me aaya");
    //                                             resolve(resultPointsByOrg);
    
    //                                         }else{
    
    //                                             console.log("2 me aaya");
    
    //                                             resolve(resultPointsByOrg[0]);
    //                                         }
    
    
    //                                     });
    //                                 }
    //                                 else{
    //                                     var resultPointsByOrg = [];
    //                                     resolve(resultPointsByOrg);
    //                                 }
    
    
    //                         });
    //                     }
    
    
    
    
    //                     function getDeviceInfo() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
                                        
    //                                     console.log("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1");
                                       
    //                                     var queryLeaderboardByOrg = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo){
                                        
    //                                     if(err){
    //                                     console.error('SQL error_sanju: ', err);
    //                                     res.json({"status":'true',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultDeviceInfo.length < 1){
    
    
    //                                             var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token, tb_users.parent_id as parent_id ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                        
    //                                     if(err){
    //                                     console.error('SQL error_sanju: ', err);
    //                                     res.json({"status":'true',"msg":'Something went wrong!'});
    //                                     }
    
    //                                     console.log("11 me aaya");
    //                                     if(resultDeviceInfo.length < 1){
    //                                         resolve(resultDeviceInfo);
    //                                     }else{
    //                                         resolve(resultDeviceInfo[0]);
    //                                     }
                                                
    
    //                                 })
    
                                                
    
    //                                         }else{
    
    //                                             console.log("22 me aaya");
    //                                             console.log(resultDeviceInfo);
    
    //                                             resolve(resultDeviceInfo[0]);
    //                                         }
    
                                            
    //                                     });
                                    
                                    
    
    
    //                         });
    //                     }
    
    
    //    getDeviceInfo().then(function(data) {
    //     console.log("444444444 me aaya");
    //         var deviceData = data;
                   
    //         checkReferalPoints(deviceData).then(function(data) {
    //             console.log("3333333 me aaya");
    //             if(data== true){
                                        
    
    //                     addStepsCount().then(function(data) {
    
    //                       if(data== true){
                                                        
    //                                                     getPointsGlobal().then(function(data) {
    //                                                     //console.log("3 me aaya1");
    //                                                     var globalPoints = data;
    
    //                                                     if(data){
    
    //                                                         getPointsByOrg().then(function(data) {
    //                                                                     console.log("4 me aaya");
    //                                                                     console.log(data);
    //                                                                     var pointsInOrganisation = data;
    //                                                                     var jsonObj = {};
    //                                                                     if(globalPoints.userid == null){
    
    //                                                                         jsonObj.userid = reqObj.userid
    //                                                                         // jsonObj.name = globalPoints.name
    //                                                                         // jsonObj.email = globalPoints.email
    //                                                                         // jsonObj.profileImg = globalPoints.profileImg
    //                                                                         jsonObj.globalPoints = 0
    //                                                                         jsonObj.pointsInOrganisation = 0
    //                                                                     }else{
    //                                                                         jsonObj.userid = globalPoints.userid
    //                                                                         // jsonObj.name = globalPoints.name
    //                                                                         // jsonObj.email = globalPoints.email
    //                                                                         // jsonObj.profileImg = globalPoints.profileImg
    //                                                                         jsonObj.globalPoints = globalPoints.globalPoints
    //                                                                         jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
    //                                                                     }
                                                                       
    //                                                                     res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
    //                                                                 });
    //                                                         }
    //                                                     });
    
    //                                                 }
    //                                                 else{
    //                                                     res.json({"status":'true',"msg":'Something went wrong!'});
    //                                                 }
    //                       });
    
    //                 }
    //             });
    //         });
                    
    
    
    //            })     
    
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
});
//1.54


router.post('/addStepsCountNonPedometer', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
    // try{
    // var reqObj = req.body;        
    
    //     console.log("reqObj: ",reqObj)
    //         req.getConnection(function(err, conn){
    
                
                
    
    //                 function checkReferalPoints(deviceData) {
    //                         console.log("agyaaa");
    //                         console.log("agyaaa deviceData : ", deviceData);
    //                         return new Promise(function(resolve,reject) {
    //                             reqObj.stepscount = reqObj.seconds;
    //                             var stepscount = parseFloat(reqObj.stepscount);
    //                             //var parent_id = parseInt(deviceData.parent_id);
    //                                 console.log("agyaaa: ", stepscount);
    //                                 console.log("agyaaa parent_id : ", deviceData.parent_id);
                                    
    //                                 if(stepscount >= 900 && deviceData.parent_id > 0){
    //                                     console.log("sanjeev");
    //                                     var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
    //                                     if(err){
    //                                     console.error('SQL error: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    //                                         console.log("length of : ",resultCheckReferalPoints.length);    
    //                                         if(resultCheckReferalPoints.length < 1){
    
    //                                             console.log("1 me aaya");
    
    //                                                 var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                        //  custom by MCT  insert point in new table start
                                                           
    //                                                                                 //update point start
    //                                                                                 var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+deviceData.parent_id+"'"
    //                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                 if(err){
    //                                                                                 console.error('SQL error: ', err);
    //                                                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                 }
    //                                                                                 })
    //                                                                                 var d = new Date();
    
    //                                                                                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                            
                                                                                                            
    //                                                                                                                 //update point start
    //                                                                                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+deviceData.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferralPoints', 'ReferralPoints', 'ReferralPoints' )"
    //                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                     if(err){
    //                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                     }
    //                                                                                                                 });
    //                                                                                                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+deviceData.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferralPoints', 'ReferralPoints', 'ReferralPoints' )"
    //                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                     if(err){
    //                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                     }
    //                                                                                                                 })
                                                                                    
    //                                                                                 //update point end
    //                                                         //  custom by MCT insert point in new table end
    
    //                                                         if(deviceData.parent_device_type == "iOS"){
    //                                                                              let deviceToken = deviceData.parent_device_token;
                                                                                 
    //                                                                              // Prepare the notifications
    //                                                                              let notification = new apn.Notification();
    //                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
    //                                                                              notification.badge = 0;
    //                                                                              notification.sound = "default";
    //                                                                              notification.alert = "You have earned 50 referral points.";
    //                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
    //                                                                              // Replace this with your app bundle ID:
    //                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
    //                                                                              // Send the actual notification
    //                                                                              apnProvider.send(notification, deviceToken).then( result => {
    //                                                                                 // Show the result of the send operation:
    //                                                                                 console.log(1111111111111111111111111);
    //                                                                                 console.log(result);
    //                                                                              });
    //                                                                              // Close the server
    //                                                                              apnProvider.shutdown();
    //                                                                         }else if(deviceData.parent_device_type == "Android"){
    
    //                                                                             console.log(deviceData.parent_device_token);
    //                                                                             console.log(2222222222222222);
    
    //                                                                             // Prepare a message to be sent
    //                                                                             var message = new gcm.Message({
    
    //                                                                                 data: { key:  "You have earned 50 referral points"},
    
    //                                                                                     notification: {
    //                                                                                         title: "Walkify",
    //                                                                                         icon: "ic_launcher",
    //                                                                                         body: "You have earned 50 referral points"
    //                                                                                     }
    //                                                                             });
    //                                                                             message.addData({
    //                                                                                             message: "You have earned 50 referral points"
    //                                                                                         });
    //                                                                             // Specify which registration IDs to deliver the message to
    //                                                                             var regTokens = [deviceData.parent_device_token];
                                                                                 
    //                                                                             // Actually send the message
    //                                                                             sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    //                                                                                 if (err) console.error(err);
    //                                                                                 else console.log(response);
    //                                                                             });
    
    
    
    //                                                                         }
    //                                                                         //resolve(true);
                                                    
    
    //                                                 });
    
    
    //                                                 var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
    //                                                 if(err){
    //                                                 console.error('SQL error: ', err);
    //                                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                                                     //  custom by MCT  insert point in new table start
                                                        
    //                                                                             //update point start
    //                                                                             var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
    //                                                                             conn.query(update_point, (err, result)=>{
    //                                                                             if(err){
    //                                                                             console.error('SQL error: ', err);
    //                                                                             res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                             }
    //                                                                             })
    
    
    //                                                                             var d = new Date();
    
    //                                                                                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                            
                                                                                                            
    //                                                                                                                 //update point start
    //                                                                                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
    //                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                     if(err){
    //                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                     }
    //                                                                                                                 });
    //                                                                                                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
    //                                                                                                                 conn.query(update_point, (err, result)=>{
    //                                                                                                                     if(err){
    //                                                                                                                     console.error('SQL error: ', err);
    //                                                                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                                                                     }
    //                                                                                                                 })
                                                                                    
    //                                                                             //update point end
    //                                                     //  custom by MCT insert point in new table end
                                                        
    
    //                                                     if(deviceData.device_type == "iOS"){
    //                                                                              let deviceToken = deviceData.device_token;
    //                                                                              console.log(deviceData.device_token);
    //                                                                              // Prepare the notifications
    //                                                                              let notification = new apn.Notification();
    //                                                                              notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
    //                                                                              notification.badge = 0;
    //                                                                              notification.sound = "default";
    //                                                                              notification.alert = "You have earned 50 referral bonus points.";
    //                                                                              notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
    //                                                                              // Replace this with your app bundle ID:
    //                                                                              notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
    //                                                                              // Send the actual notification
    //                                                                              setTimeout(function () {
    //                                                                                     apnProvider.send(notification, deviceToken).then( result => {
    //                                                                                             // Show the result of the send operation:
    //                                                                                             console.log(1111111111111111111111111);
    //                                                                                             console.log(result);
    //                                                                                          });
    //                                                                                          // Close the server
    //                                                                                          apnProvider.shutdown();
    //                                                                                 }, 2000);    
    
                                                                                 
    //                                                                         }else if(deviceData.device_type == "Android"){
    
    //                                                                             console.log(deviceData.device_token);
    //                                                                             console.log(2222222222222222);
    
    //                                                                             // Prepare a message to be sent
    //                                                                             var message = new gcm.Message({
    
    //                                                                                 data: { key:  "You have earned 50 referral bonus points"},
    
    //                                                                                     notification: {
    //                                                                                         title: "Walkify",
    //                                                                                         icon: "ic_launcher",
    //                                                                                         body: "You have earned 50 referral bonus points."
    //                                                                                     }
    //                                                                             });
    //                                                                             message.addData({
    //                                                                                             message: "You have earned 50 referral bonus points"
    //                                                                                         });
    //                                                                             // Specify which registration IDs to deliver the message to
    //                                                                             var regTokens = [deviceData.device_token];
                                                                                 
    //                                                                             // Actually send the message
    
    //                                                                             setTimeout(function () {
                                                                                    
    
    //                                                                                 sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    //                                                                                         if (err) console.error(err);
    //                                                                                         else console.log(response);
    //                                                                                     });
    
    
    //                                                                             }, 2000); 
    
                                                                                
    
    
    
    //                                                                         }
    //                                                                         resolve(true);
    
    
    //                                                 });
    
    //                                                 resolve(true);
    
    //                                         }else{
    
    //                                             console.log("2 me aaya");
    
    //                                             resolve(true);
    //                                         }
    
    
    //                                     });
    
                                    
    
    
    //                                 }
    //                                 else{
    //                                     resolve(true);
    //                                 }
    
    //                         });
    //                     }
            
    
    //         function addStepsCount() {
    //                   console.log("agyaaa");
    //                   return new Promise(function(resolve,reject) { 
                      
    
    
    //                           var queryInsertHistory = conn.query("insert into tb_stepscount_history_wp(userid, seconds) Values('"+reqObj.userid+"', '"+reqObj.seconds+"')", function (err, resultInsertHistory){
    //                                           if(err){
    //                                           console.error('SQL error: ', err);
    //                                           res.json({"status":'false',"msg":'Something went wrong!'});
    //                                           }
    //                                             if(parseInt(reqObj.seconds) > 900){
    //                                             var queryInsertPoint = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', '"+parseInt(reqObj.seconds/900)+"', 8, 0)", function (err, resultInsertPoint){
    //                                                   if(err){
    //                                                   console.error('SQL error: ', err);
    //                                                   res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                   }
    //                                                     //  custom by MCT  insert point in new table start
                                                        
    //                                                                             //update point start
    //                                                                             var update_point = "UPDATE tb_newpoint SET points = points+"+(parseInt(reqObj.seconds/900))+" WHERE userid = '"+reqObj.userid+"'"
    //                                                                             conn.query(update_point, (err, result)=>{
    //                                                                             if(err){
    //                                                                             console.error('SQL error: ', err);
    //                                                                             res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                                             }
    //                                                                             })
    //                                                                             //update point end
    //                                                                         //insert point end
    //                                                     //  custom by MCT insert point in new table end
    
                                                          
    //                                                         resolve(true);  
                                                         
                                                      
    //                                                   });
    
    
    //                                                   } else{
    
    //                                                     resolve(true);  
    //                                                   }
                                                  
                                                    
                                                 
                                              
    //                                           }); 
    
                                
                              
                             
    
    //                   })
    //                 }
    
    
    //         function getPointsGlobal() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
                                
    //                                     var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
    //                                     if(err){
    //                                     console.error('SQL error: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultPointsGlobal == ""){
    
    //                                             console.log("1 me aaya");
    //                                             resolve(resultPointsGlobal);
    
    //                                         }else{
    
    //                                             console.log("2 me aaya");
    
    //                                             resolve(resultPointsGlobal[0]);
    //                                         }
    
    
    //                                     });
    
    
    //                         });
    //                     }
    
    
    //                     function getPointsByOrg() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
                                        
    //                                 if(reqObj.organisation_id > 0){
    //                                     var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
    //                                     if(err){
    //                                     console.error('SQL error: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultPointsByOrg == ""){
    
    //                                             console.log("1 me aaya");
    //                                             resolve(resultPointsByOrg);
    
    //                                         }else{
    
    //                                             console.log("2 me aaya");
    
    //                                             resolve(resultPointsByOrg[0]);
    //                                         }
    
    
    //                                     });
    //                                 }
    //                                 else{
    //                                     var resultPointsByOrg = [];
    //                                     resolve(resultPointsByOrg);
    //                                 }
    
    
    //                         });
    //                     }
    
    
    
    
    //                     function getDeviceInfo() {
    //                         console.log("agyaaa");
    //                         return new Promise(function(resolve,reject) {
                                        
    //                                     console.log("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1");
                                       
    //                                     var queryLeaderboardByOrg = conn.query("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1", function (err, resultDeviceInfo){
                                        
    //                                     if(err){
    //                                     console.error('SQL error_sanju: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    
    //                                         if(resultDeviceInfo.length < 1){
    
    
    //                                             var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token, tb_users.parent_id as parent_id ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                        
    //                                     if(err){
    //                                     console.error('SQL error_sanju: ', err);
    //                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                     }
    
    //                                     console.log("11 me aaya");
    //                                     if(resultDeviceInfo.length < 1){
    //                                         resolve(resultDeviceInfo);
    //                                     }else{
    //                                         resolve(resultDeviceInfo[0]);
    //                                     }
                                                
    
    //                                 })
    
                                                
    
    //                                         }else{
    
    //                                             console.log("22 me aaya");
    //                                             console.log(resultDeviceInfo);
    
    //                                             resolve(resultDeviceInfo[0]);
    //                                         }
    
                                            
    //                                     });
                                    
                                    
    
    
    //                         });
    //                     }
    
    
    //    getDeviceInfo().then(function(data) {
    //     console.log("444444444 me aaya");
    //         var deviceData = data;
                   
    //         checkReferalPoints(deviceData).then(function(data) {
    //             console.log("3333333 me aaya");
    //             if(data== true){
                                        
    
    //                     addStepsCount().then(function(data) {
    
    //                       if(data== true){
                                                        
    //                                                     getPointsGlobal().then(function(data) {
    //                                                     console.log("3 me aaya1");
    
    //                                                     var globalPoints = data;
    
    //                                                     if(data){
    
    //                                                         getPointsByOrg().then(function(data) {
    //                                                                     console.log("4 me aaya");
    //                                                                     console.log(data);
    //                                                                     var pointsInOrganisation = data;
    //                                                                     var jsonObj = {};
    //                                                                     if(globalPoints.userid == null){
    
    //                                                                         jsonObj.userid = reqObj.userid
    //                                                                         // jsonObj.name = globalPoints.name
    //                                                                         // jsonObj.email = globalPoints.email
    //                                                                         // jsonObj.profileImg = globalPoints.profileImg
    //                                                                         jsonObj.globalPoints = 0
    //                                                                         jsonObj.pointsInOrganisation = 0
    //                                                                     }else{
    //                                                                         jsonObj.userid = globalPoints.userid
    //                                                                         // jsonObj.name = globalPoints.name
    //                                                                         // jsonObj.email = globalPoints.email
    //                                                                         // jsonObj.profileImg = globalPoints.profileImg
    //                                                                         jsonObj.globalPoints = globalPoints.globalPoints
    //                                                                         jsonObj.pointsInOrganisation = pointsInOrganisation.pointsInOrganisation
    //                                                                     }
                                                                       
    //                                                                     res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
    //                                                                 });
    //                                                         }
    //                                                     });
    
    //                                                 }
    //                                                 else{
    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                                                 }
    //                       });
    
    //                 }
    //             });
    //         });
                    
    
    
    //            })     
    
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
});
// end new updated 1.51

router.get('/verifymobilepn', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_users", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.get('/verifymobilepntwo', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_guestUsers", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});



router.get('/updateapp', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("select * from tb_users", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                // if(v.device_type == "iOS"){
                                //          let deviceToken = v.device_token;
                                //          console.log(v.device_token);
                                //          // Prepare the notifications
                                //          let notification = new apn.Notification();
                                //          notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                //          notification.badge = 0;
                                //          notification.sound = "default";
                                //          notification.alert = "Validate your number to get 250 points.";
                                //          notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                //          // Replace this with your app bundle ID:
                                //          notification.topic = "Com.MindCrew.FitIndia";
                                         
                                //          // Send the actual notification
                                //          setTimeout(function () {
                                //                 apnProvider.send(notification, deviceToken).then( result => {
                                //                         // Show the result of the send operation:
                                //                         console.log(1111111111111111111111111);
                                //                         console.log(result);
                                //                      });
                                //                      // Close the server
                                //                      apnProvider.shutdown();
                                //             }, 2000);    

                                         
                                //     }else 
                                if(v.device_type == "Android"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.get('/ntForTopThrity', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id ORDER BY totalpoints DESC limit 30", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.get('/ntForToHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC limit 101", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.get('/ntForBelowHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id HAVING SUM(tb_points.points) < 100 ORDER BY totalpoints DESC", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});



router.get('/ntForAboveHundred', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token , IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id HAVING SUM(tb_points.points) > 100 ORDER BY totalpoints DESC", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                if(v.device_type == "iOS" && v.device_token != "undefined"){
                                         let deviceToken = v.device_token;
                                         console.log(v.device_token);
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
                                                        console.log(1111111111111111111111111);
                                                        console.log(result);
                                                     });
                                                     // Close the server
                                                     apnProvider.shutdown();
                                            }, 2000);    

                                         
                                    }else if(v.device_type == "Android" && v.device_token != "undefined"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.get('/ntForPaytmGPay', function(req,res,next){

try{
    //var reqObj = req.body;
        
    req.getConnection(function(err, conn){
    if(err)
    {
    console.error('SQL Connection error: ', err);
    res.json({"status":'false',"msg":'Something went wrong!'});
    }
    else
    {    
         
        var query = conn.query("SELECT tb_users.id as userid, tb_users.device_type, tb_users.device_token from tb_users where device_type !='' and device_token!='undefined'", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!'});
                }
                
                    if(result!=""){


                       asyncLoop(result, function (v, next)
                            {


                                // if(v.device_type == "iOS" && v.device_token != "undefined"){
                                //          let deviceToken = v.device_token;
                                //          console.log(v.device_token);
                                //          // Prepare the notifications
                                //          let notification = new apn.Notification();
                                //          notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                //          notification.badge = 0;
                                //          notification.sound = "default";
                                //          notification.alert = "You are doing well. Walk more , earn more.";
                                //          notification.payload = {'messageFrom': 'FitIndia'};
                                         
                                //          // Replace this with your app bundle ID:
                                //          notification.topic = "Com.MindCrew.FitIndia";
                                         
                                //          // Send the actual notification
                                //          setTimeout(function () {
                                //                 apnProvider.send(notification, deviceToken).then( result => {
                                //                         // Show the result of the send operation:
                                //                         console.log(1111111111111111111111111);
                                //                         console.log(result);
                                //                      });
                                //                      // Close the server
                                //                      apnProvider.shutdown();
                                //             }, 2000);    

                                         
                                //     }else 
                                if(v.device_type == "Android" && v.device_token != "undefined"){

                                        console.log(v.device_token);
                                        console.log(2222222222222222);

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
console.error("Internal error:"+ex);
return next(ex);
}
});
// current league and prviousleague
router.get('/nextandpreviousleague', (req, res, next)=>{
    try{
        req.getConnection((err, conn)=>{
          if(err) {
              console.error('SQL Connection error: ', err);
              res.json({"status":'false',"msg":'Something went wrong!'});
              }
              else {
                  conn.query("SELECT  DATE_FORMAT(previousdate, '%Y-%m-%d') as previous , DATE_FORMAT(nextdate, '%Y-%m-%d') as nextdat, DATE_FORMAT(NOW(), '%Y-%m-%d') as CurrentDate, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') AS CurrentTime FROM tb_organisations WHERE id = 0", (err, result)=>{
                      if(err){
                          res.json({"Error": 'Somthing went wrong'})
                      }
                      else {
                          res.json({"data": result});
                      }
                  });
              }
        });
    }
    catch(ex){
        console.log("Internal error:"+ ex);
        return next(ex);
    }
  });
  router.get('/installusermapWEB', function(req,res,next){

    try{    
        req.getConnection(function(err, conn){
        if(err)
        {
        console.error('SQL Connection error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
             
            var query = conn.query("SELECT name, lat, lng FROM tb_users WHERE lat <> ''", function (err, data){
                    if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"msg":'Something went wrong!'});
                    }
                     else{
                           
                         res.json({"result":data})
                     }
                    
                    });
    
        }
        })
    }
    catch(ex){
    console.error("Internal error:"+ex);
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
        console.error('SQL Connection error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
                var query = conn.query("SELECT * FROM tb_usermap WHERE userid = '"+reqObj.userid+"'", function (err, result){
                        if(err){
                        res.json({"status":'false',"msg":'Something went wrong! new history!'});
                        }
                           var arrrylist = reqObj.data;
                           console.log(arrrylist +"asdfsfsdfsdfsdf")
                           if(arrrylist != ''){
                          asyncLoop(arrrylist, function (qdata, next)
                          {   
                              
                              console.log("SELECT userid, DATE_FORMAT(date, '%Y-%m-%d') AS newdate FROM tb_usermap  WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'")
                            conn.query("SELECT userid, DATE_FORMAT(date, '%Y-%m-%d') AS newdate FROM tb_usermap  WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'", function (err, resultstepsavali){
                                if(err){
                                    res.json({"err": "error"})
                                }
                                if(resultstepsavali.length>0){
                                  if(resultstepsavali[0].newdate == qdata.date)
                                  {     
                                      console.log("UPDATE `tb_usermap` SET stepsount = '"+qdata.stepsount+"' WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'")
                                    conn.query("UPDATE `tb_usermap` SET stepsount = '"+qdata.stepsount+"' WHERE userid = '"+reqObj.userid+"' and date = '"+qdata.date+"'", function (err, resultsteps){
                                        if(err){
                                            res.json({"err": "error"});
                                        }
                                    })
                                    console.log("SELECT * FROM tb_usermap WHERE  date >= now() - INTERVAL 7 DAY and userid = '"+reqObj.userid+"'");
                                  }
                                  next();
                            } else {
                                console.log("INSERT INTO tb_usermap( userid, organisation_id, stepsount, date) VALUES ('"+reqObj.userid+"',1, '"+qdata.stepsount+"', '"+qdata.date+"')")
                                conn.query("INSERT INTO tb_usermap( userid, organisation_id, stepsount, date) VALUES ('"+reqObj.userid+"',1, '"+qdata.stepsount+"', '"+qdata.date+"')", function (err, resultsteps){
                                    if(err){
                                        res.json({"err": "error"});
                                    }
                                })
                                console.log("SELECT * FROM tb_usermap WHERE  date >= now() - INTERVAL 7 DAY and userid = '"+reqObj.userid+"'");
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
    console.error("Internal error:"+ex);
    return next(ex);
    }
    });

//Main screen profile data
router.post('/HomeScreenDatavfone', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
});

// version1.54 20_august
router.post('/HomeScreenDataVsFour', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});

    // try{    
    //    var reqObj = req.body;
    //     req.getConnection(function(err, conn){
    //     if(err)
    //     {
    //     console.error('SQL Connection error: ', err);
    //     res.json({"status":'false',"msg":'Something went wrong!'});
    //     }
    //     else
    //     {    
             
    //           conn.query("select * from (SELECT rank() OVER (ORDER BY leaguepoints DESC) as rank,tb_users.id as userid, IFNULL(tb_newpoint.total_league_point, 0) as leaguepoints FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id GROUP BY tb_users.id ORDER BY leaguepoints DESC) as a where userid ='"+reqObj.userid+"'", function (err, data){
    //                 if(err){
    //                 console.error('SQL error: ', err);
    //                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                  }
    //                  //console.log("test", data); 
    //                  //SELECT IFNULL(SUM(stepscount), 0)AS leaguestepscount, (SELECT IFNULL(SUM(points), 0) from tb_points WHERE userid = '"+reqObj.userid+"') AS globalpoint, (SELECT IFNULL(sum(points), 0) FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and point_type = 1)AS outdoorpoint, (SELECT IFNULL(SUM(points), 0) FROM `tb_bonuspoint` WHERE userid = '"+reqObj.userid+"' and point_type <> '1') AS bonuspoint, (SELECT COUNT(*)As videocount FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"') as videocount   from tb_stepscount_newhistory WHERE userid = '"+reqObj.userid+"'
    //                  conn.query("SELECT IFNULL(SUM(stepscount), 0)AS leaguestepscount  from tb_stepscount_newhistory WHERE userid ='"+reqObj.userid+"'", function (err, totalsteps){
    //                      if(err){
    //                         console.error('SQL error: ', err);
    //                      }

    //                       conn.query("SELECT IFNULL(SUM(points),0) as globalpoint from tb_points WHERE userid = '"+reqObj.userid+"'",(err, result1)=>{
    //                         if(err){
    //                             console.error('SQL error: ', err);
    //                          }
    //                         conn.query("SELECT outdoor_point, bonus_point FROM `tb_newpoint` WHERE userid ='"+reqObj.userid+"'",(err, result2)=>{
    //                             if(err){
    //                                 console.error('SQL error: ', err);
    //                              }
    //                              //SELECT COUNT(*)As videocount FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid ='"+reqObj.userid+"
    //                             conn.query("SELECT COUNT(userid) as videocount FROM `tb_bonuspoint` WHERE  DATE(created_at) = CURDATE() and userid ='"+reqObj.userid+"' and rewardName='video'",(err, result3)=>{
    //                                 if(err){
    //                                     console.error('SQL error: ', err);
    //                                  }
    //                                  conn.query("SELECT COUNT(userid) as leaguevideocount FROM `tb_bonuspoint` WHERE  userid ='"+reqObj.userid+"' and rewardName='video'",(err, result4)=>{
    //                                     if(err){
    //                                         console.error('SQL error: ', err);
    //                                      }
                                            

    //                                 var responseData = {};
    //                                 if(data.length>0){
    //                                     responseData.rank = data[0].rank;
    //                                 } else {
    //                                     responseData.rank = 0;
    //                                 }
                                                
    //                                 if(totalsteps.length>0){
    //                                     responseData.leaguepoints = totalsteps[0].leaguestepscount;
    //                                     responseData.leaguestepscount = totalsteps[0].leaguestepscount;
    //                                 }
    //                                 else{
    //                                     responseData.leaguestepscount = 0;
    //                                 }
    //                                 if(result1.length>0){
    //                                     responseData.globalpoint = result1[0].globalpoint;
    //                                 }
    //                                 else{
    //                                     responseData.globalpoint = 0;
    //                                 }
                 
                                    
    //                                  if(result2.length>0){
    //                                     responseData.outdoorpoint = result2[0].outdoor_point;
    //                                     responseData.bonuspoint = result2[0].bonus_point;
    //                                  }else{
    //                                     responseData.outdoorpoint = 0;
    //                                     responseData.bonuspoint = 0;
    //                                  }
                                    
    //                                  responseData.videocount = result3[0].videocount;
    //                                  responseData.leaguevideocount = result4[0].leaguevideocount;
                                    
    //                                 responseData.videodigit=10
    //                                 responseData.surveydigit = 2000;
    //                                 responseData.maxvideolimit = 0;
    //                                 responseData.dailymaxvideolimit = 100;
    //                                  res.json({"status":'true', "data": responseData });
                                    
    //                                 });
    //                             });
                                  
    //                         });
                             
    //                       });
                         
                         
    //                  });    
    //                 });
    //     }
    //     })
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
});
// version1.54 20_august
router.post('/BonusPointvfone', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
    // try{    
    //    var reqObj = req.body;
    //     req.getConnection(function(err, conn){
    //     if(err)
    //     {
    //     console.error('SQL Connection error: ', err);
    //     res.json({"status":'false',"msg":'Something went wrong!'});
    //     }
    //     else
    //     {    
            
    //           conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"', 50, 10,'"+reqObj.date+"', '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
    //                 if(err){
    //                 console.error('SQL error: ', err);
    //                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                  }
    //                   if(result){
    //                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"','1', '"+2000+"', 10)", function (err, resultAddPoints){
    //                     if(err){
    //                     console.error('SQL error: ', err);
    //                     res.json({"status":'false',"msg":'Something went wrong!'});
    //                     }
    //                 });
    //                 conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
    //                     if(result_userid.length>0){
    //                           var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+"+2000+", outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+2000+"' WHERE userid = '"+reqObj.userid+"'"
    //                         conn.query(update_point, (err, result)=>{
    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"msg":'Something went wrong!'});
    //                         }
    //                         })         
    //                     }
    //                     else {
    //                         var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', 0, 2000, 0, 0, 2000 )"
    //                         conn.query(insertpoint, (err, result)=>{
    //                             if(err){
    //                             console.error('SQL error: ', err);
    //                             res.json({"status":'false',"msg":'Something went wrong!insert'});
    //                             }
    //                         })

                            
    //                     }

    //                 });
    //                             conn.query("SELECT COUNT(*)As videocount,  IFNULL(sum(points), 0) As bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName='video'", function (err, result_total){
    //                                 if(err){
    //                                 console.error('SQL error: ', err);
    //                                 res.json({"status":'false',"msg":'Something went wrong!'});
    //                                  }
                                     
    //                                     var responseData = {};              
    //                                     responseData.videocount = result_total[0].videocount;
    //                                     responseData.bonuspoint = result_total[0].bonuspoint;

    //                     res.json({"status": "true", "survey": "Thank you for complete survey. 2000 bonus points added successfully.", "videocount": result_total[0].videocount, "bonuspoint":result_total[0].bonuspoint  })               
                    
    //             });
    //                   }
                      
    //                 });
                       
    //     }
    //     })
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
}); 


router.post('/Advertisementvfone', function(req,res,next){
    res.json({"status":'false',"msg":'please update app'});
    // try{    
    //    var reqObj = req.body;
    //     req.getConnection(function(err, conn){
    //     if(err)
    //     {
    //     console.error('SQL Connection error: ', err);
    //     res.json({"status":'false',"message":'Something went wrong!1'});
    //     }
    //     else
    //     {    
    //           if(reqObj.userid == ""){
    //             res.json({"status": "false","message":"user not register"})
    //           }else{
    //             conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
    //                 if(result_userid.length>0){
    //                     var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+"+10+", outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+10+"' WHERE userid = '"+reqObj.userid+"'"
    //                     conn.query(update_point, (err, result)=>{
    //                     if(err){
    //                     console.error('SQL error: ', err);
    //                     res.json({"status":'false',"message":'Something went wrong!2'});
    //                     }
    //                     })
    //                 }
    //                 else {
    //                     var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', 0, 10, 0, 0, 10 )"
    //                     conn.query(insertpoint, (err, result)=>{
    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"message":'Something went wrong!insert'});
    //                         }
    //                     }) 

                        
    //                 }

    //             }); 
    //           conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+10+"', 11,'"+reqObj.date+"', '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
    //                 if(err){
    //                 console.error('SQL error: ', err);
    //                 res.json({"status":'false',"message":'Something went wrong!3'});
    //                  }
    //                  if(result){
                          
    //                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, 10, 11)", function (err, resultAddPoints){
    //                     if(err){
    //                     console.error('SQL error: ', err);
    //                     res.json({"status":'false',"message":'Something went wrong!4'});
    //                     }
    //                 }); 
    //                  //SELECT COUNT(*)As videocount,  IFNULL(sum(points), 0)As bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"'
                    
    //                     conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
    //                         if(err){
    //                         console.error('SQL error: ', err);
    //                         res.json({"status":'false',"message":'Something went wrong!5'});
    //                          }
    //                          else{
    //                             if(result_total[0].videocount>=0){
    //                                 conn.query("UPDATE tb_users SET videocount = 1 WHERE id = '"+reqObj.userid+"'", (err, resultfinal)=>{
    //                                      if(err){
    //                                        res.json({"status":'false',"message":'Something went wrong!6'});
    //                                      }
    //                                 })
    //                             }
    //                          res.json({"status": "true","message":"Thank you for watching video. 10 bonus points added successfully.",  result_total})
    //                         }
    //                         });              
                      
    //                     }
    //                 });
                
    //             }
    //     }
    //     })
    // }
    // catch(ex){
    // console.error("Internal error:"+ex);
    // return next(ex);
    // }
});
// end new updated 1.51


router.post('/challangesintersted', function(req,res,next){
        
    try{
    var reqObj = req.body;        
   
      req.getConnection(function(err, conn){
      var query = conn.query("SELECT id FROM `tb_users` WHERE id = '"+reqObj.userid+"'" , function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!0'});
                }
                if(result.length> 0){

                       conn.query("SELECT userid, payout FROM `tb_challenges` where userid = '"+reqObj.userid+"' and payout = '"+reqObj.payout+"'", function(err, result1){
                        
                           if(err){
                            res.json({"status":'false',"msg":'Something went wrong!1'});
                           }
                           else{
                               console.log("test_test", result1);
                               if(result1.length >0){
                                if(result1[0].payout == reqObj.payout)
                                   var quert = "update tb_challenges SET interested= '"+reqObj.interested+"' where userid = '"+reqObj.userid+"' and payout = '"+reqObj.payout+"'"
                                  else{
                                    var quert = "INSERT INTO `tb_challenges`(`userid`, `payout`, `interested`) VALUES ('"+reqObj.userid+"', '"+reqObj.payout+"','"+reqObj.interested+"')";
                                    console.log("1")
                                  }
                               }
                               else{
                                var quert = "INSERT INTO `tb_challenges`(`userid`, `payout`, `interested`) VALUES ('"+reqObj.userid+"', '"+reqObj.payout+"','"+reqObj.interested+"')";
                                console.log("2");
                               }
                               
                               conn.query(quert, function(err, result3){
                                if(err){
                                    res.json({"status":'false',"msg":'Something went wrong!2'});
                                }
                                else{
                                    res.json({"status":'true', 'msg': 'successful'});    
                                }
                               })

                           }
                       });
                    
                }else{
                    res.json({"status":'false',"msg":'No record found'});
                }
                });
                });
    
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
//changes 13august
// 07september
router.post('/AddOutDoorWalkOneSix', middleware,function(req,res,next) {

    try{
var reqObj = req.body;
req.getConnection(function(err, conn){
    console.log(conn)
if(err)
{
console.error('SQL Connection error: ', err);
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
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            var distance = parseFloat(reqObj.distance);
                            var parent_id = parseFloat(reqObj.parent_id);

                                if(distance >= 5 && parent_id > 0){
                                    console.log(distance);
                                    var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }
                                           
                                        if(resultCheckReferalPoints == ""){
                                                var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                                      //  custom by MCT  insert point in new table start
                                                       //update point start   "UPDATE tb_newpoint SET points = points+"+50+" WHERE userid
                                                    // where user check user participate
                                                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.parent_id+"'",(err, result_userid)=>{
                                                        if(result_userid.length > 0){

                                                            var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.parent_id+"'"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                }
                                                            })
                                                         var d = new Date();
                                                                 var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                            var insert_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
                                                            conn.query(update_point, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                                }
                                                            });
                                                                     
 


                                                                  
                                                        }
                                                        else{
                                                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.parent_id+"',0, 50, 0, 0, 50 )"
                                                            conn.query(insertpoint, (err, result)=>{
                                                                if(err){
                                                                console.error('SQL error: ', err);
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
                                                                             notification.alert = "You have earned 50 referral points.";
                                                                             notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
                                                                             // Replace this with your app bundle ID:
                                                                             notification.topic = "Com.MindCrew.FitIndia";
                                                                             
                                                                             // Send the actual notification
                                                                             apnProvider.send(notification, deviceToken).then( result => {
                                                                                // Show the result of the send operation:
                                                                                console.log(1111111111111111111111111);
                                                                                console.log(result);
                                                                             });
                                                                             // Close the server
                                                                             apnProvider.shutdown();
                                                                        }else if(deviceData.parent_device_type == "Android"){

                                                                            console.log(deviceData.parent_device_token);
                                                                            console.log(2222222222222222);

                                                                            // Prepare a message to be sent
                                                                            var message = new gcm.Message({

                                                                                data: { key:  "You have earned 50 referral points"},

                                                                                    notification: {
                                                                                        title: "Walkify",
                                                                                        icon: "ic_launcher",
                                                                                        body: "You have earned 50 referral points"
                                                                                    }
                                                                            });
                                                                            message.addData({
                                                                                            message: "You have earned 50 referral points"
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


                                                var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+reqObj.parent_id+"')", function (err, resultInsertInvitePoints){
                                                if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                              //  custom by MCT  insert point in new table start
                                                       //update point start
                                                       var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
                                                       conn.query(update_point, (err, result)=>{
                                                           if(err){
                                                           console.error('SQL error: ', err);
                                                           res.json({"status":'false',"msg":'Something went wrong!'});
                                                           }
                                                       })
                                                    var d = new Date();

                                                            var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                       var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                       conn.query(update_point, (err, result)=>{
                                                           if(err){
                                                           console.error('SQL error: ', err);
                                                           res.json({"status":'false',"msg":'Something went wrong!'});
                                                           }
                                                       });
                                                       var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                       conn.query(update_point, (err, result)=>{
                                                           if(err){
                                                           console.error('SQL error: ', err);
                                                           res.json({"status":'false',"msg":'Something went wrong!'});
                                                           }
                                                       })

                                                       //update point end
                                              //  custom by MCT insert point in new table end
                                                    if(deviceData.device_type == "iOS"){
                                                                             let deviceToken = deviceData.device_token;
                                                                             console.log(deviceData.device_token);
                                                                             // Prepare the notifications
                                                                             let notification = new apn.Notification();
                                                                             notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                             notification.badge = 0;
                                                                             notification.sound = "default";
                                                                             notification.alert = "You have earned 50 referral bonus points.";
                                                                             notification.payload = {'messageFrom': 'FitIndia'};
                                                                             
                                                                             // Replace this with your app bundle ID:
                                                                             notification.topic = "Com.MindCrew.FitIndia";
                                                                             
                                                                             // Send the actual notification
                                                                             setTimeout(function () {
                                                                                    apnProvider.send(notification, deviceToken).then( result => {
                                                                                            // Show the result of the send operation:
                                                                                            console.log(1111111111111111111111111);
                                                                                            console.log(result);
                                                                                         });
                                                                                         // Close the server
                                                                                         apnProvider.shutdown();
                                                                                }, 2000);    

                                                                             
                                                                        }else if(deviceData.device_type == "Android"){

                                                                            console.log(deviceData.device_token);
                                                                            console.log(2222222222222222);

                                                                            // Prepare a message to be sent
                                                                            var message = new gcm.Message({

                                                                                data: { key:  "You have earned 50 referral bonus points"},

                                                                                    notification: {
                                                                                        title: "Walkify",
                                                                                        icon: "ic_launcher",
                                                                                        body: "You have earned 50 referral bonus points."
                                                                                    }
                                                                            });
                                                                            message.addData({
                                                                                            message: "You have earned 50 referral bonus points"
                                                                                        });
                                                                            // Specify which registration IDs to deliver the message to
                                                                            var regTokens = [deviceData.device_token];
                                                                             
                                                                            // Actually send the message

                                                                            setTimeout(function () {
                                                                                

                                                                                sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                        if (err) console.error(err);
                                                                                        else console.log(response);
                                                                                    });


                                                                            }, 2000); 

                                                                            



                                                                        }
                                                                        resolve(true);


                                                });
                                                

                                                resolve(true);

                                        }else{

                                            console.log("2 me aaya");

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
                        console.log("agyaaa1");
                        return new Promise(function(resolve,reject) {
                            
                            // date24 june
                            
                            var hms =  reqObj.walk_time;   // your input string
                            console.log(reqObj.walk_time  + "old")
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
                           
                            console.log(newupdatetime + "latest time")
                            var updatepointval;
                            var uupoint; //insert point table
                            var walkpoint = Math.round(reqObj.walk_points);
                            var userdistence= Math.round(reqObj.distance);
                            var utime = Math.round(newupdatetime);
                            var actwlak = (utime*100) //multip 200 1M = 200Meter
                            // compare actuall distence = user distence
                                if(userdistence >= actwlak){
                                    //console.log(actwlak + "" + userdistence)
                                    updatepointval = Math.round(actwlak)
                                    if(walkpoint > updatepointval){
                                        uupoint = parseInt(updatepointval)
                                        console.log(uupoint + "f1")
                                    }
                                    else{
                                        uupoint = parseInt(walkpoint)
                                        console.log(uupoint + "f2")
                                     }
                                }
                                else if(actwlak > userdistence){
                                    updatepointval = Math.round(userdistence)
                                    if(walkpoint > updatepointval){
                                        uupoint = parseInt(updatepointval)
                                        console.log(uupoint + "s1")
                                    }
                                    else{
                                        uupoint = parseInt(walkpoint)
                                        console.log(uupoint + "s2s")
                                    }
                                }
                           
                             

                              

                             conn.query("SELECT imei FROM `tb_users` WHERE id= '"+reqObj.userid+"'", function(err, resultimel){
                               if(resultimel[0].imei == reqObj.imei){
                                   
                              
                            conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                                if(result_userid.length>0){
                                    var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+0+", outdoor_point = outdoor_point+"+uupoint+", total_league_steps = total_league_steps+'"+0+"', total_league_point = total_league_point+'"+uupoint+"' WHERE userid = '"+reqObj.userid+"'"
                                    conn.query(update_point, (err, result)=>{
                                        if(err){
                                        console.error('SQL error: ', err);
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
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                    })      
                                }
                                else {


                                    var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', '"+uupoint+"', 0, 0, '"+uupoint+"', '"+uupoint+"' )"
                                    conn.query(insertpoint, (err, result)=>{
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!insert'});
                                        }
                                    })
                                    var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+uupoint+"', 1, NOW(), 'Walking point', 'walkingpoint', 'WalkingPoint' )"
                                    conn.query(update_point, (err, result)=>{
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                    }) 
                                }

                            });
                            var query = conn.query("insert into tb_walking_history(userid, distance, date, walk_time, calories, distance_unit, calorie_unit, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"','"+reqObj.distance+"', NOW(),'"+reqObj.walk_time+"','"+reqObj.calories+"','"+reqObj.distance_unit+"','"+reqObj.calorie_unit+"','"+reqObj.from_lat+"','"+reqObj.from_lng+"','"+reqObj.to_lat+"','"+reqObj.to_lng+"')", function (err, resultdata){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }
                                var queryAddPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', '"+uupoint+"', 0)", function (err, resultAddPoints){
                                    if(err){
                                    console.error('SQL error: ', err);
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
                                                                console.log(1111111111111111111111111);
                                                                console.log(result);
                                                             });
                                                             // Close the server
                                                             apnProvider.shutdown();
                                                            }
                                                        }else if(deviceData.device_type == "Android"){
                                                            if(uupoint>0){
                                                            console.log(deviceData.device_token);
                                                            console.log(2222222222222222);

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
                                                                if (err) console.error(err);
                                                                else console.log(response);
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
                   //end new updated 1.51

                    function getPointsGlobal() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            //SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'
                            //
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, sum(tb_points.points) as globalPoints, (SELECT IFNULL(sum(points), 0) FROM `tb_bonuspoint` WHERE point_type = 1 and userid = '"+reqObj.userid+"') as outdoorpoint FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid= '"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsGlobal == ""){

                                            console.log("1 me aaya");
                                            resolve(resultPointsGlobal);

                                        }else{

                                            console.log("2 me aaya");

                                            resolve(resultPointsGlobal[0]);
                                        }


                                    });


                        });
                    }


                    function getPointsByOrg() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                                    
                                if(reqObj.organisation_id > 0){
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultPointsByOrg == ""){

                                            console.log("1 me aaya");
                                            resolve(resultPointsByOrg);

                                        }else{

                                            console.log("2 me aaya");

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
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                                    
                                
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users where tb_users.id='"+reqObj.userid+"'", function (err, resultDeviceInfo){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultDeviceInfo == ""){

                                            console.log("1 me aaya");
                                            resolve(resultDeviceInfo);

                                        }else{

                                            console.log("2 me aaya");

                                            resolve(resultDeviceInfo[0]);
                                        }


                                    });
                                


                        });
                    }
                    
                    function getBonuscard(walkPoint) {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            var snumber = (Math.floor(Math.random() * (10 - 1 + 1) + 1))*10;
                                if(walkPoint>=500){
                                    conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES ('"+reqObj.userid+"', '"+snumber+"', 13, NOW(), 'dailybonus', '"+snumber+"', 'dailybonus')", function (err, resultDeviceInfo){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    
                                    }
                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+snumber+"', 13, 0, 1, NOW(), 1 )", function (err, resultPoint){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        
                                        }
                                        
                                        conn.query("UPDATE tb_newpoint SET bonus_point = bonus_point+"+snumber+", total_league_point= total_league_point+"+snumber+"  WHERE userid = '"+reqObj.userid+"'", function (err, resultNewpoint){
                                            if(err){
                                            console.error('SQL error: ', err);
                                            res.json({"status":'false',"msg":'Something went wrong!'});
                                            
                                            }
                                              resolve(snumber)
                                                
        
        
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
                                        // console.log(data.device_type);
                                        // console.log(data.device_token);
                                        // console.log(444444444444444);        
                                checkReferalPoints(deviceData).then(function(data) {
                                    console.log("3 me aaya");
                                    if(data== true){
                            
                           
                                        addWalking(deviceData).then(function(data) {
                                                console.log(data);
                                                var walkingpoint1 = data;                                                
                                                if(data){
                                                    getBonuscard(walkingpoint1).then(function(data) {
                                                            var bonus_point =  data;
                                                
                                                      getPointsGlobal().then(function(data) {
                                                    console.log("3 me aaya1");
                                                    console.log(data);
                                                    console.log("3 me aaya1");
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
console.error("Internal error:"+ex);
return next(ex);
}
});


router.post('/AddStepsDailyBasedOneSix', middleware, function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    function checkReferalPoints(deviceData) {
                            console.log("agyaaa");
                            console.log("agyaaa deviceData : ", deviceData);
                            return new Promise(function(resolve,reject) {
                                
                                var stepscount = parseFloat(reqObj.stepscount);
                                //var parent_id = parseInt(deviceData.parent_id);
                                    console.log("agyaaa: ", stepscount);
                                    console.log("agyaaa parent_id : ", deviceData.parent_id);
                                    
                                    if(stepscount >= 1 && deviceData.parent_id > 0){
                                        console.log("sanjeev");
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                            console.log("length of : ",resultCheckReferalPoints.length);    
                                            if(resultCheckReferalPoints.length < 1){
    
                                                console.log("1 me aaya");
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                       //  custom by MCT  insert point in new table start
                                                                    //update point start

                                                                    // conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+deviceData.parent_id+"'",(err, result_userid)=>{
                                                                    //     if(result_userid.length>0){
                                                                                       

                                                                    //         var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+deviceData.parent_id+"'"
                                                                    //         conn.query(update_point, (err, result)=>{
                                                                    //         if(err){
                                                                    //         console.error('SQL error: ', err);
                                                                    //         res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    //         }
                                                                    //         })
                                                                    //         var d = new Date();
                                                                    //                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                    //                                                 //update point start
                                                                    //                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+deviceData.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
                                                                    //                                                 conn.query(update_point, (err, result)=>{
                                                                    //                                                     if(err){
                                                                    //                                                     console.error('SQL error: ', err);
                                                                    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    //                                                     }
                                                                    //                                                 });
                                                                    //     }
                                                                    //     else {
                                                                    //         var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+deviceData.parent_id+"', 0, 50,0, 0,50 )"
                                                                    //         conn.query(insertpoint, (err, result)=>{
                                                                    //             if(err){
                                                                    //             console.error('SQL error: ', err);
                                                                    //             res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                    //             }
                                                                    //         })

                                                                    //     }
          
                                                                    // });

                                                                    
                                                                    //update point end
                                                                
                                                        //  custom by MCT insert point in new table end       
                                                    
                                                            if(deviceData.parent_device_type == "iOS"){
                                                                                 let deviceToken = deviceData.parent_device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 50 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    console.log(1111111111111111111111111);
                                                                                    console.log(result);
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                console.log(deviceData.parent_device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral points"
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
    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    //  custom by MCT  insert point in new table start
                                                    
                                                                            //update point start
                                                                            // var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
                                                                            // conn.query(update_point, (err, result)=>{
                                                                            // if(err){
                                                                            // console.error('SQL error: ', err);
                                                                            // res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            // }
                                                                            // })
                                                                            //update point end
                                                                            // var d = new Date();

                                                                            //                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                    
                                                                                                    
                                                                            //                                 //update point start
                                                                            //                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                            //                                 conn.query(update_point, (err, result)=>{
                                                                            //                                     if(err){
                                                                            //                                     console.error('SQL error: ', err);
                                                                            //                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            //                                     }
                                                                            //                                 });
                                                                            //                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                            //                                 conn.query(update_point, (err, result)=>{
                                                                            //                                     if(err){
                                                                            //                                     console.error('SQL error: ', err);
                                                                            //                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            //                                     }
                                                                            //                                 })
                                                    //  custom by MCT insert point in new table end
                                                        
    
                                                        if(deviceData.device_type == "iOS"){
                                                                                 let deviceToken = deviceData.device_token;
                                                                                 console.log(deviceData.device_token);
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 50 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                console.log(1111111111111111111111111);
                                                                                                console.log(result);
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                console.log(deviceData.device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            if (err) console.error(err);
                                                                                            else console.log(response);
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                console.log("2 me aaya");
    
                                                resolve(true);
                                            }
    
    
                                        });
    
                                    
    
    
                                    }
                                    else{
                                        resolve(true);
                                    }
    
                            });
                        }
                        function addStepsCount() {
                            return new Promise(function(resolve,reject) { 
                                conn.query("select imei from tb_users where id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function(err, result_imei){
                                         if(err){
                                             res.json({"status": "false", "message": "Somthing Went Wrong"})
                                         }
                                         //imei check
                                         else{
                                            var isnum = isNaN(result_imei[0].imei)
                                            if(isnum == false){
                                              resolve(true);
                                              }
                                             else{
                                             //imei check > 0
                                             var d = new Date();

                                                if((d.getMonth()+1)<10){
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
                                                } 
                                                else{
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
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
                                                                       // console.log("not greater league",reqObj.StepCount);
                                                                    
                                                                        var old_steps = result_lasttime[0].points;
                                                                            var new_steps = reqObj.StepCount;
                                                                            var updated_stps = (new_steps - old_steps);

                                                                               if(new_steps>50000){
                                                                                updated_stps = 50000 - old_steps;
                                                                               }
                                                                            
                                                                        conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+updated_stps+"', total_league_point = total_league_point+'"+updated_stps+"' WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
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
                                                                  
                                                                conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+reqObj.StepCount+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                    }
                                                                    
                                                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+reqObj.StepCount+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
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
                                        }
                                         //imei check
                                });
                            })
                          }
          
          
    
            function getPointsGlobal() {
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                        if(err){
                                       // console.error('SQL error: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsGlobal == ""){
    
                                                //console.log("1 me aaya");
                                                resolve(resultPointsGlobal);
    
                                            }else{
    
                                               // console.log("2 me aaya");
    
                                                resolve(resultPointsGlobal[0]);
                                            }
    
    
                                        });
    
    
                            });
                        }
    
    
                        function getPointsByOrg() {
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        
                                    if(reqObj.organisation_id > 0){
                                        var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsByOrg == ""){
    
                                                console.log("1 me aaya");
                                                resolve(resultPointsByOrg);
    
                                            }else{
    
                                                console.log("2 me aaya");
    
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        
                                        console.log("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1");
                                       
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
    
                                        console.log("11 me aaya");
                                        if(resultDeviceInfo.length < 1){
                                            resolve(resultDeviceInfo);
                                        }else{
                                            resolve(resultDeviceInfo[0]);
                                        }
                                                
    
                                    })
    
                                                
    
                                            }else{
    
                                                console.log("22 me aaya");
                                                console.log(resultDeviceInfo);
    
                                                resolve(resultDeviceInfo[0]);
                                            }
    
                                            
                                        });
                                    
                                    
    
    
                            });
                        }
    
    
       getDeviceInfo().then(function(data) {
        console.log("444444444 me aaya");
            var deviceData = data;
                   
            checkReferalPoints(deviceData).then(function(data) {
                console.log("3333333 me aaya");
                if(data== true){
                                        
                        addStepsCount().then(function(data) {
                            console.log("console1" , data)
    
                          if(data== true){
                                           
                                getPointsGlobal().then(function(data) {
                                //console.log("3 me aaya1");
                                var globalPoints = data;
                                console.log("console2" , data)

                                if(data){

                                    getPointsByOrg().then(function(data) {
                                                console.log("4 me aaya");
                                                console.log(data);
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
                                });
                            

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
    console.error("Internal error:"+ex);
    return next(ex);
    }
});

router.post('/AddStepsDailyBasedOneSixAndroid', middleware, function(req,res,next){
    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                    function checkReferalPoints(deviceData) {
                            console.log("agyaaa");
                            console.log("agyaaa deviceData : ", deviceData);
                            return new Promise(function(resolve,reject) {
                                
                                var stepscount = parseFloat(reqObj.stepscount);
                                //var parent_id = parseInt(deviceData.parent_id);
                                    console.log("agyaaa: ", stepscount);
                                    console.log("agyaaa parent_id : ", deviceData.parent_id);
                                    
                                    if(stepscount >= 1 && deviceData.parent_id > 0){
                                        console.log("sanjeev");
                                        var queryCheckReferalPoints = conn.query("select * from tb_points where refer_to='"+reqObj.userid+"' and points_type = 2", function (err, resultCheckReferalPoints){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"msg":'Something went wrong!'});
                                        }
                                            console.log("length of : ",resultCheckReferalPoints.length);    
                                            if(resultCheckReferalPoints.length < 1){
    
                                                console.log("1 me aaya");
    
                                                    var queryInsertReferralPoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+deviceData.parent_id+"','"+deviceData.parent_organisation_id+"', 50, 2, '"+reqObj.userid+"')", function (err, resultInsertReferralPoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                       //  custom by MCT  insert point in new table start
                                                                    //update point start

                                                                    // conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+deviceData.parent_id+"'",(err, result_userid)=>{
                                                                    //     if(result_userid.length>0){
                                                                                       

                                                                    //         var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+deviceData.parent_id+"'"
                                                                    //         conn.query(update_point, (err, result)=>{
                                                                    //         if(err){
                                                                    //         console.error('SQL error: ', err);
                                                                    //         res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    //         }
                                                                    //         })
                                                                    //         var d = new Date();
                                                                    //                                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                    //                                                 //update point start
                                                                    //                                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+deviceData.parent_id+"','"+50+"', 2,'"+newdate_vari+"', 'ReferalPoints', 'ReferalPoints', 'ReferalPoints' )"
                                                                    //                                                 conn.query(update_point, (err, result)=>{
                                                                    //                                                     if(err){
                                                                    //                                                     console.error('SQL error: ', err);
                                                                    //                                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                    //                                                     }
                                                                    //                                                 });
                                                                    //     }
                                                                    //     else {
                                                                    //         var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+deviceData.parent_id+"', 0, 50,0, 0,50 )"
                                                                    //         conn.query(insertpoint, (err, result)=>{
                                                                    //             if(err){
                                                                    //             console.error('SQL error: ', err);
                                                                    //             res.json({"status":'false',"msg":'Something went wrong!insert'});
                                                                    //             }
                                                                    //         })

                                                                    //     }
          
                                                                    // });

                                                                    
                                                                    //update point end
                                                                
                                                        //  custom by MCT insert point in new table end       
                                                    
                                                            if(deviceData.parent_device_type == "iOS"){
                                                                                 let deviceToken = deviceData.parent_device_token;
                                                                                 
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 50 referral points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 apnProvider.send(notification, deviceToken).then( result => {
                                                                                    // Show the result of the send operation:
                                                                                    console.log(1111111111111111111111111);
                                                                                    console.log(result);
                                                                                 });
                                                                                 // Close the server
                                                                                 apnProvider.shutdown();
                                                                            }else if(deviceData.parent_device_type == "Android"){
    
                                                                                console.log(deviceData.parent_device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral points"
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral points"
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
    
    
                                                    var queryInsertInvitePoints = conn.query("insert into tb_points(userid, organisation_id, points, points_type, refer_to) Values('"+reqObj.userid+"','"+reqObj.organisation_id+"', 50, 3, '"+deviceData.parent_id+"')", function (err, resultInsertInvitePoints){
                                                    if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                    }
                                                    //  custom by MCT  insert point in new table start
                                                    
                                                                            //update point start
                                                                            // var update_point = "UPDATE tb_newpoint SET points = points+"+0+", bonus_point = bonus_point+"+50+", outdoor_point = outdoor_point+"+0+", total_league_steps = total_league_steps+"+0+", total_league_point = total_league_point+"+50+" WHERE userid = '"+reqObj.userid+"'"
                                                                            // conn.query(update_point, (err, result)=>{
                                                                            // if(err){
                                                                            // console.error('SQL error: ', err);
                                                                            // res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            // }
                                                                            // })
                                                                            //update point end
                                                                            // var d = new Date();

                                                                            //                         var newdate_vari =  d.getFullYear()+"-"+("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
                                                                                                    
                                                                                                    
                                                                            //                                 //update point start
                                                                            //                                 var update_point = "INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                            //                                 conn.query(update_point, (err, result)=>{
                                                                            //                                     if(err){
                                                                            //                                     console.error('SQL error: ', err);
                                                                            //                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            //                                     }
                                                                            //                                 });
                                                                            //                                 var update_point = "INSERT INTO tb_bonuspointmaster (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+50+"', 3,'"+newdate_vari+"', 'InvitePoints', 'InvitePoints', 'InvitePoints' )"
                                                                            //                                 conn.query(update_point, (err, result)=>{
                                                                            //                                     if(err){
                                                                            //                                     console.error('SQL error: ', err);
                                                                            //                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                            //                                     }
                                                                            //                                 })
                                                    //  custom by MCT insert point in new table end
                                                        
    
                                                        if(deviceData.device_type == "iOS"){
                                                                                 let deviceToken = deviceData.device_token;
                                                                                 console.log(deviceData.device_token);
                                                                                 // Prepare the notifications
                                                                                 let notification = new apn.Notification();
                                                                                 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                                                 notification.badge = 0;
                                                                                 notification.sound = "default";
                                                                                 notification.alert = "You have earned 50 referral bonus points.";
                                                                                 notification.payload = {'messageFrom': 'FitIndia'};
                                                                                 
                                                                                 // Replace this with your app bundle ID:
                                                                                 notification.topic = "Com.MindCrew.FitIndia";
                                                                                 
                                                                                 // Send the actual notification
                                                                                 setTimeout(function () {
                                                                                        apnProvider.send(notification, deviceToken).then( result => {
                                                                                                // Show the result of the send operation:
                                                                                                console.log(1111111111111111111111111);
                                                                                                console.log(result);
                                                                                             });
                                                                                             // Close the server
                                                                                             apnProvider.shutdown();
                                                                                    }, 2000);    
    
                                                                                 
                                                                            }else if(deviceData.device_type == "Android"){
    
                                                                                console.log(deviceData.device_token);
                                                                                console.log(2222222222222222);
    
                                                                                // Prepare a message to be sent
                                                                                var message = new gcm.Message({
    
                                                                                    data: { key:  "You have earned 50 referral bonus points"},
    
                                                                                        notification: {
                                                                                            title: "Walkify",
                                                                                            icon: "ic_launcher",
                                                                                            body: "You have earned 50 referral bonus points."
                                                                                        }
                                                                                });
                                                                                message.addData({
                                                                                                message: "You have earned 50 referral bonus points"
                                                                                            });
                                                                                // Specify which registration IDs to deliver the message to
                                                                                var regTokens = [deviceData.device_token];
                                                                                 
                                                                                // Actually send the message
    
                                                                                setTimeout(function () {
                                                                                    
    
                                                                                    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                                            if (err) console.error(err);
                                                                                            else console.log(response);
                                                                                        });
    
    
                                                                                }, 2000); 
    
                                                                                
    
    
    
                                                                            }
                                                                            resolve(true);
    
    
                                                    });
    
                                                    resolve(true);
    
                                            }else{
    
                                                console.log("2 me aaya");
    
                                                resolve(true);
                                            }
    
    
                                        });
    
                                    
    
    
                                    }
                                    else{
                                        resolve(true);
                                    }
    
                            });
                        }
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
                                                    var datestring =   d.getFullYear()+ "-0" + (d.getMonth()+1) + "-" +d.getDate();
                                                } 
                                                else{
                                                    var datestring =   d.getFullYear()+ "-" + (d.getMonth()+1) + "-" +d.getDate();
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
                                                                       // console.log("not greater league",reqObj.StepCount);
                                                                    
                                                                        var old_steps = result_lasttime[0].points;
                                                                            var new_steps = reqObj.StepCount;
                                                                            var updated_stps = (new_steps - old_steps);

                                                                               if(new_steps>50000){
                                                                                updated_stps = 50000 - old_steps;
                                                                               }
                                                                            
                                                                        conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+updated_stps+"', total_league_point = total_league_point+'"+updated_stps+"' WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
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
                                                                  
                                                                conn.query("UPDATE tb_newpoint SET points = points+'"+updated_stps+"', total_league_steps = '"+reqObj.StepCount+"', total_league_point = total_league_point+'"+updated_stps+"'   WHERE userid = '"+reqObj.userid+"'", function(err, result_update){
                                                                    if(err){
                                                                        res.json({"status": "false", "message": "Somthing Went Wrong"})
                                                                    }
                                                                    
                                                                        conn.query("INSERT INTO `tb_points`(`userid`, `organisation_id`, `points`, `points_type`, `refer_to`, `is_loggedIn`, `created_at`, `status`) VALUES ('"+reqObj.userid+"', 1, '"+reqObj.StepCount+"', 7, 0, 0, NOW(), 0 )", function(err, result_update){
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        var queryLeaderboardGlobal = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, IF(tb_users.is_verified>0, 1, 0) as isEmailVerified, IF(tb_users.is_phone_verified>0, 1, 0) as isPhoneVerified, IF(tb_users.profileImg !='' , 1, 0) as isProfileVerified,tb_users.profileImg, sum(tb_points.points) as globalPoints FROM tb_points,tb_users where tb_points.userid=tb_users.id and userid='"+reqObj.userid+"'", function (err, resultPointsGlobal){
                                        if(err){
                                       // console.error('SQL error: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsGlobal == ""){
    
                                                //console.log("1 me aaya");
                                                resolve(resultPointsGlobal);
    
                                            }else{
    
                                               // console.log("2 me aaya");
    
                                                resolve(resultPointsGlobal[0]);
                                            }
    
    
                                        });
    
    
                            });
                        }
    
    
                        function getPointsByOrg() {
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        
                                    if(reqObj.organisation_id > 0){
                                        var queryLeaderboardByOrg = conn.query("SELECT tb_users.id as userid, tb_users.name, tb_users.email, tb_users.profileImg, IFNULL(sum(tb_points.points),0) as pointsInOrganisation FROM tb_points,tb_users where tb_points.userid=tb_users.id and tb_points.organisation_id='"+reqObj.organisation_id+"' and userid='"+reqObj.userid+"'", function (err, resultPointsByOrg){
                                        if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'true',"msg":'Something went wrong!'});
                                        }
    
                                            if(resultPointsByOrg == ""){
    
                                                console.log("1 me aaya");
                                                resolve(resultPointsByOrg);
    
                                            }else{
    
                                                console.log("2 me aaya");
    
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
                            console.log("agyaaa");
                            return new Promise(function(resolve,reject) {
                                        
                                        console.log("SELECT IFNULL(tb_stepscount_history_guest.stepscount,0) as tot_stepscount, 0 as tot_distance, tb_users.id as userid, tb_users.organisation_id as user_org, tb_users.parent_id as parent_id, tb_users.device_type as device_type, tb_users.device_token as device_token ,(select device_type from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_type,(select device_token from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_device_token,(select organisation_id from tb_users where id = (select parent_id from tb_users where id='"+reqObj.userid+"')) as parent_organisation_id FROM tb_users, tb_stepscount_history_guest where tb_users.id='"+reqObj.userid+"' and tb_users.imei=tb_stepscount_history_guest.imei ORDER by tb_stepscount_history_guest.id desc limit 1");
                                       
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
    
                                        console.log("11 me aaya");
                                        if(resultDeviceInfo.length < 1){
                                            resolve(resultDeviceInfo);
                                        }else{
                                            resolve(resultDeviceInfo[0]);
                                        }
                                                
    
                                    })
    
                                                
    
                                            }else{
    
                                                console.log("22 me aaya");
                                                console.log(resultDeviceInfo);
    
                                                resolve(resultDeviceInfo[0]);
                                            }
    
                                            
                                        });
                                    
                                    
    
    
                            });
                        }
    
    
       getDeviceInfo().then(function(data) {
        console.log("444444444 me aaya");
            var deviceData = data;
                   
            checkReferalPoints(deviceData).then(function(data) {
                console.log("3333333 me aaya");
                if(data== true){
                                        
                        addStepsCount().then(function(data) {
                            console.log("console1" , data)
    
                          if(data== true){
                                           
                                getPointsGlobal().then(function(data) {
                                //console.log("3 me aaya1");
                                var globalPoints = data;
                                console.log("console2" , data)

                                if(data){

                                    getPointsByOrg().then(function(data) {
                                                console.log("4 me aaya");
                                                console.log(data);
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
                                });
                            

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
    console.error("Internal error:"+ex);
    return next(ex);
    }
});

router.post('/BonusPointvfoneOneSix', function(req,res,next){

    try{    
       var reqObj = req.body;
        req.getConnection(function(err, conn){
        if(err)
        {
        console.error('SQL Connection error: ', err);
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
            
              conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"', 50, 10, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                    if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"msg":'Something went wrong!'});
                     }
                      if(result){
                       conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"','1', '"+2000+"', 10)", function (err, resultAddPoints){
                        if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"msg":'Something went wrong!'});
                        }
                    });
                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                        if(result_userid.length>0){
                              var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+"+2000+", outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+2000+"' WHERE userid = '"+reqObj.userid+"'"
                            conn.query(update_point, (err, result)=>{
                            if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"msg":'Something went wrong!'});
                            }
                            })         
                        }
                        else {
                            var insertpoint = "INSERT INTO tb_newpoint (userid, points, bonus_point,outdoor_point, total_league_steps, total_league_point) VALUES ('"+reqObj.userid+"', 0, 2000, 0, 0, 2000 )"
                            conn.query(insertpoint, (err, result)=>{
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!insert'});
                                }
                            })

                            
                        }

                    });
                                conn.query("SELECT COUNT(*)As videocount,  IFNULL(sum(points), 0) As bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName='video'", function (err, result_total){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                     }
                                     
                                        var responseData = {};              
                                        responseData.videocount = result_total[0].videocount;
                                        responseData.bonuspoint = result_total[0].bonuspoint;

                        res.json({"status": "true", "survey": "Thank you for complete survey. 2000 bonus points added successfully.", "videocount": result_total[0].videocount, "bonuspoint":result_total[0].bonuspoint  })               
                    
                });
                      }
                      
                    });
                       
        }
        })
    }
    catch(ex){
    console.error("Internal error:"+ex);
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
                                            console.log(query);
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
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
router.post('/updateversionwalkify', function(req,res,next){
        
    try{
    var reqObj = req.body;        
   
      req.getConnection(function(err, conn){
      var query = conn.query("SELECT id FROM `tb_users` WHERE id = '"+reqObj.userid+"'" , function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!',"query":query});
                }
                      
                if(result.length> 0){
                    conn.query("UPDATE tb_users SET device_type = '"+reqObj.device_type+"',  version = '"+reqObj.version+"' where id = '"+reqObj.userid+"'", function(err, result1){
                        conn.query("select version from tb_version", (err, result_vesion)=>{
                            res.json({"status":'true', 'msg': 'Update successful', 'data': result_vesion[0].version});
                        });
                            
                    });
                    
                }else{
                    res.json({"status":'false',"msg":'No record found', 'data': ""});
                }
                });
                });
    
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
router.post('/AdvertisementvfFiveFour', function(req,res,next){
    try{ 
            var reqObj = req.body;
            req.getConnection(function(err, conn){
                if(err)
                {
                  res.json({"status":'false',"message":'Something went wrong!1'});
                }
                else
                { 
                    if(reqObj.userid == ""){
                    res.json({"status": "false","message":"user not register"})
                }else{
                if(reqObj.bonus_point<=50){
                    conn.query("SELECT userid FROM `tb_newpoint` WHERE userid = '"+reqObj.userid+"'",(err, result_userid)=>{
                        if(result_userid.length>0){
                        var update_point = "UPDATE tb_newpoint SET points = points+'"+0+"', bonus_point = bonus_point+'"+reqObj.bonus_point+"', outdoor_point = outdoor_point+"+0+", total_league_steps ='"+0+"', total_league_point = total_league_point+'"+reqObj.bonus_point+"' WHERE userid = '"+reqObj.userid+"'"
                        conn.query(update_point, (err, result)=>{
                        if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!2'});
                        }else{
                            conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+reqObj.bonus_point+"', 11, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"message":'Something went wrong!3'});
                                }
                                    if(result){
                                    
                                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+reqObj.bonus_point+"', 11)", function (err, resultAddPoints){
                                    if(err){
                                    res.json({"status":'false',"message":'Something went wrong!4'});
                                    }
                                    else{
                                        conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                            if(err){
                                            console.error('SQL error: ', err);
                                            res.json({"status":'false',"message":'Something went wrong!5'});
                                            }
                                            else{
                                            res.json({"status": "true","message":"Thank you for watching video. '"+reqObj.bonus_point+"' bonus points added successfully.", result_total})
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
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"message":'Something went wrong!insert'});
                              }
                              else{
                                conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+reqObj.bonus_point+"', 11, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong!3'});
                                    }
                                        if(result){
                                        
                                        conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+reqObj.bonus_point+"', 11)", function (err, resultAddPoints){
                                        if(err){
                                        res.json({"status":'false',"message":'Something went wrong!4'});
                                        }else{
                                            conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!5'});
                                                }
                                                else{
                                                res.json({"status": "true","message":"Thank you for watching video. '"+reqObj.bonus_point+"' bonus points added successfully.", result_total})
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
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!2'});
                        }else{
                            conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+10+"', 11, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"message":'Something went wrong!3'});
                                }
                                    if(result){
                                    
                                    conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+10+"', 11)", function (err, resultAddPoints){
                                    if(err){
                                    res.json({"status":'false',"message":'Something went wrong!4'});
                                    }
                                    else{
                                        conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                            if(err){
                                            console.error('SQL error: ', err);
                                            res.json({"status":'false',"message":'Something went wrong!5'});
                                            }
                                            else{
                                            res.json({"status": "true","message":"Thank you for watching video. '"+10+"' bonus points added successfully.", result_total})
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
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"message":'Something went wrong!insert'});
                              }
                              else{
                                conn.query("INSERT INTO tb_bonuspoint (userid, points, point_type, created_at, rewardName, rewardValue, surveyCPA) VALUES('"+reqObj.userid+"','"+10+"', 11, NOW(), '"+reqObj.rewardName+"', '"+reqObj.rewardValue+"', '"+reqObj.surveyCPA+"' )", function (err, result){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong!3'});
                                    }
                                        if(result){
                                        
                                        conn.query("insert into tb_points(userid, organisation_id, points, points_type) Values('"+reqObj.userid+"',1, '"+10+"', 11)", function (err, resultAddPoints){
                                        if(err){
                                        res.json({"status":'false',"message":'Something went wrong!4'});
                                        }else{
                                            conn.query("SELECT COUNT(*)As videocount, (SELECT bonus_point from tb_newpoint WHERE userid = '"+reqObj.userid+"' limit 1) as bonuspoint  FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid = '"+reqObj.userid+"' and rewardName = 'video'", function (err, result_total){
                                                if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!5'});
                                                }
                                                else{
                                                res.json({"status": "true","message":"Thank you for watching video. '"+10+"' bonus points added successfully.", result_total})
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
                }
            })
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); 

router.post('/VideoValidationTime', function(req,res,next){
    //	/Servertime
    try{
        var reqObj = req.body;
        
        //DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
        
        req.getConnection(function(err, conn){
            var query = conn.query("SELECT NOW() as servertime", function (err, resultserver){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"message":'Something went wrong!'});
                }
                
                conn.query("select created_at as videotime from tb_bonuspoint where userid= '"+reqObj.userid+"' and rewardName = 'video' order by id desc limit 1", function (err, result){
                    if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"message":'Something went wrong!0'});
                    }
                    
                    var fromTime = new Date(resultserver[0].servertime); 
                    var toTime;
                    if(result.length>0){
                    toTime = new Date(result[0].videotime);
                    }
                    else{
                    toTime =new Date();
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
                    
                    var zmsg="You need to wait "+valusesnew+" second for watching next video";
                    //"You need to wait 6 minutes for watching next video"
                    if(minut>=30){
                    var snumber = (Math.floor(Math.random() * (5 - 1 + 1) + 1))*10;
                    res.json({"status":'true',"data":msgtrue,"message":"true","videobonus":snumber});
                    }
                    else if(fromTime == differenceTravel){
                    var snumber = (Math.floor(Math.random() * (5 - 1 + 1) + 1))*10;
                    res.json({"status":'true',"data":msgtrue,"message":"true","videobonus":snumber});
                    }
                    else{
                    var snumber = (Math.floor(Math.random() * (5 - 1 + 1) + 1))*10;
                    res.json({"status":'flase',"data":valusesnew,"message":zmsg,"videobonus":snumber});
                    }
                    
                }); //query end c1
            });//query end p1
        });//connection end
    
    }
    
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
router.post('/DailyScratchBonusFiveSix', function(req,res,next){
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                console.log(reqObj.userid);  
                var query = conn.query("SELECT id, imei FROM `tb_users` WHERE id = '"+reqObj.userid+"' and imei = '"+reqObj.imei+"'", function (err, result){
                if(err){
                console.error('SQL error: ', err);
                res.json({"status":'false',"msg":'Something went wrong!1'});
                }
                //imei check start
                else{
                     if(result[0].id == reqObj.userid && result[0].imei == reqObj.imei){
                         console.log("reqObj.userid");
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
                                                        res.json({"status": "true", "randomnumber": snumber})
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
                                                        res.json({"status": "true", "randomnumber": snumber})
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
                         res.json({"status": "flase", "msg": "Invaild user"})
                     }
                     ////user not exi
                }
                //imei check end

                });
                });
    
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
router.post('/updateversionandroid', function(req,res,next){

    try{
    var reqObj = req.body; 
    
    req.getConnection(function(err, conn){
    // var query = conn.query("SELECT * FROM `tb_version` " , function (err, result){
    // if(err){
    // console.error('SQL error: ', err);
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
    // console.error("Internal error:"+ex);
    // return next(ex);
    }
});

router.post('/MCTUserUpdatePoint', function(req,res,next){
    try{
     var reqObj = req.body; 
     req.getConnection(function(err, conn){
         //select start
         var query = conn.query("SELECT userid from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
             if(err){
             res.json({"status":'false',"msg":'Something went wrong!'});
             } // end of err
         if(result.length>0){
                     var addpoint = (parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point))
                             var query = conn.query("Update tb_newpoint set points =  points+'"+reqObj.points+"', bonus_point =  bonus_point+'"+reqObj.bonus_point+"', outdoor_point =  outdoor_point+'"+reqObj.outdoor_point+"',total_league_steps =  '"+reqObj.total_league_steps+"', total_league_point= total_league_point+'"+addpoint+"' where userid = '"+reqObj.userid+"'", function (err, resultUpdate){
                         if(err){
                         res.json({"status":'false',"msg":'Something went wrong!'});
                         }
                         else{
                             res.json({"status":'true',"msg":'updated!'});
                         }
                         
                     });//end update
                  } else{

               //INSERT INTO `tb_newpoint` (`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"', '1000', '100', '1000', '1000', '3100', current_timestamp());     
               var addpoint = (parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point));
             conn.query("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`, `total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"','"+reqObj.points+"','"+reqObj.bonus_point+"', '"+reqObj.outdoor_point+"','"+reqObj.total_league_steps+"','"+addpoint+"', NOW() )",function(err,insert_tb_newpoint){
               // console.log("INSERT INTO `tb_newpoint`(`userid`, `points`, `bonus_point`, `outdoor_point`,`total_league_steps`, `total_league_point`, `created_at`) VALUES ('"+reqObj.userid+"','"+reqObj.points+"','"+reqObj.bonus_point+"','"+reqObj.outdoor_point+"','"+reqObj.total_league_steps+"','"+addpoint+"', NOW())");
                 if(err){
                         res.json({"status":'false',"msg":'Something went wrong8!'});
                     }else{
                         res.json({"status":'true',"msg":'inserted0!'});
                     }
                     
             }); // insert end
                     }//else ends c1
         }); // tb_newpoints user exist or not
     });
 // end of query
 }    
     catch(ex){
         console.error("Internal error:"+ex);
     }
 }) // end  of api

router.post('/UserMctInsert', function(req,res,next){
    try{
        var reqObj = req.body; 
        req.getConnection(function(err, conn){ 
       // console.log("dddddd11");
    

var query = conn.query("SELECT userid from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
// console.log(result);
 if(err){
 console.error('SQL error: ', err);
 res.json({"status":'false',"msg":'Something went wrong!'});
 }   
 if(result.length == 0){
var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token,referral_code,is_loggedIn, disease, imei, isFbLogin) Values('"+reqObj.name+"','"+reqObj.email+"','','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+reqObj.referral_code+"', 1, '', '"+reqObj.imei+"', 1)", function (err, resultUpdate){
    console.log(resultUpdate.insertId);
    if(err){
    console.error('SQL error: ', err);
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
        console.error('SQL error: ', err);
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
        console.error("Internal error:"+ex);
    }
}) 

router.post('/UserMctdelete', function(req,res,next){

    try{
    var reqObj = req.body; 
   
    req.getConnection(function(err, conn){
        //select start
        var query = conn.query("SELECT userid from tb_newpoint WHERE  userid =  '"+reqObj.userid+"'", function (err, result){
           // console.log(result);
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
        if(result.length>0){
        //update
           // console.log(15299);
           var addpoint = (parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point))
           console.log(addpoint)
            
        var query = conn.query("Update tb_newpoint set points =  points-'"+reqObj.points+"', bonus_point =  bonus_point-'"+reqObj.bonus_point+"', outdoor_point =  outdoor_point-'"+reqObj.outdoor_point+"',total_league_steps =  '"+reqObj.total_league_steps+"', total_league_point= total_league_point-'"+addpoint+"' where userid = '"+reqObj.userid+"'", function (err, resultUpdate){
            
            console.log(resultUpdate);
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
               

            res.json({"status":'true',"msg":'updated!'});
        })
        //update query ends
     }else{
       // console.log("dddddd11");
        var query = conn.query("insert into tb_users(name, email, password, dob, gender, phone, height_fit_inc, weight_kg, device_type, device_token,referral_code,is_loggedIn, disease, imei, isFbLogin) Values('"+reqObj.name+"','"+reqObj.email+"','','0000-00-00','','','','','"+reqObj.device_type+"','"+reqObj.device_token+"','"+reqObj.referral_code+"', 1, '', '"+reqObj.imei+"', 1)", function (err, resultUpdate){
            console.log(resultUpdate.insertId);
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }                       
            var insert_newtable = "insert into tb_newpoint(userid, points, bonus_point, outdoor_point, total_league_steps, total_league_point) Values('"+resultUpdate.insertId+"', 0, 0,0,0,0)"
            conn.query(insert_newtable, (err, resultnewp)=>{
                if(err){
                console.error('SQL error: ', err);
                }
            });
            var insert_globalpoint = "insert into tb_globalpoint(userid, globalpoint) Values('"+resultUpdate.insertId+"',5)"
            conn.query(insert_globalpoint, (err, resultglobal)=>{
                if(err){
                console.error('SQL error: ', err);
                }
            });
            var userid=resultUpdate.insertId;
            res.json({"status":'true',"msg":'inserted!',"userid":userid});
         })
        }//insert query
      })
      //select end
    })
    }
    catch(ex){
        console.error("Internal error:"+ex);
        }

});


router.post('/HomeScreenDataVsOneSix', function(req,res,next){

    try{    
       var reqObj = req.body;
        req.getConnection(function(err, conn){
        if(err)
        {
        res.json({"status":'false',"msg":'Something went wrong!'});
        }
        else
        {    
            //changed on 3 SEP to check isUserchallengeActive;
            var challenge_active;
            var query = conn.query("select a.userid,b.challenge_status,a.challenge_id from tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id where challenge_id<>0 and userid='"+reqObj.userid+"' and challenge_status=1",function(err,result){
                if(reqObj.userid==undefined || reqObj.userid==''){
                   res.json({"status":'false',"message":'Request parameter is missing'});
                   return false;
               }else{
                   if(result.length>0){
                    challenge_active=1;
                   }else{
                    challenge_active=0;
                   }
               } //end of else block
            });

              conn.query("select * from (SELECT rank() OVER (ORDER BY leaguepoints DESC) as rank,tb_users.id as userid, IFNULL(tb_newpoint.total_league_point, 0) as leaguepoints, IFNULL(tb_newpoint.points, 0)AS leaguestepscount, IFNULL(tb_newpoint.outdoor_point, 0) AS outdoor_point, IFNULL(tb_newpoint.bonus_point,0) AS bonus_point  FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id  GROUP BY tb_users.id ORDER BY leaguepoints DESC) as a where userid ='"+reqObj.userid+"'", function (err, data){
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
                                
                                 //SELECT COUNT(*)As videocount FROM `tb_bonuspoint` WHERE DATE(created_at) = CURDATE() and userid ='"+reqObj.userid+"
                                conn.query("SELECT COUNT(userid) as videocount, COUNT(userid) as leaguevideocount FROM `tb_bonuspoint` WHERE  DATE(created_at) = CURDATE() and userid ='"+reqObj.userid+"' and rewardName='video'",(err, result3)=>{
                                    if(err){
                                        res.json({"status": "false2"})
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
                                     responseData.leaguevideocount = result3[0].leaguevideocount;
                                    
                                    responseData.videodigit=10
                                    responseData.surveydigit = 2000;
                                    responseData.maxvideolimit = 0;
                                    responseData.dailymaxvideolimit = 100;
                                    responseData.challenge_active=challenge_active;
                                    responseData.walkifycoin = update_globalpoint.toString();
									 responseData.accuracy = 500;
									responseData.speed = 1;
                                    responseData.mapscreen = 1;
                                    responseData.LocationSpeedios  = 3.0;
                                    responseData.LocationAccuracyios = 40.0;
                                    responseData.speedlimitandroid = 6
                                     res.json({"status":'true', "data": responseData });
                                });
                          });
                    });
        }
        })
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
