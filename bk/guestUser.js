"use strict";
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');

var mysql = require('mysql');
var connection = require('express-myconnection');
var apn = require("apn");
var apnProvider = new apn.Provider({
         cert: "./resources/fipush.pem",
         key: "./resources/fipush.pem",
         production: true

    });
var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyDdK4zYtqVGNHR1oLVn8H-HYdxTImnglyQ');
var defaultUrl = "http://52.66.124.74:3000/ImagesFiles/";


var cryptLib = require('cryptlib'),
    iv = 'mindcrewnewapp17', //16 bytes = 128 bit 
    key = cryptLib.getHashSha256('newapp17mindcrew', 32), //32 bytes = 256 bits 
    encryptedText = cryptLib.encrypt('159753', key, iv);
//decryptedText = cryptLib.decrypt('AHIpkwOPQ1JGhmwQpX9+PA==', key, iv);

// var nodemailer = require("nodemailer");
// var smtpTransport = require("nodemailer-smtp-transport");

// var smtpTransport = nodemailer.createTransport(smtpTransport({
//     host : "smtp.gmail.com",
//     secureConnection : false,
//     port: 465,
//     auth : {
//         user : "mindcrewtest1001@gmail.com",
//         pass : "mahi1990**"
//     }
// }));

function middleware(req,res,next){
   console.log(req.headers.wakifykey)
    var reqObj = req.body; 
   req.getConnection(function(err, conn){  
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
                                    next();
                                    // return res.json({
                                    //          status:plainHeader,
                                    //          msg:plain
                                    //       })
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
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(encryptedText);

  /*var mailOptions={
        to : 'sanjeev.gehlot.08@gmail.com',
        subject : 'Llena Test Mail',
        html : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width"><style type="text/css">@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:64px !important;line-height:63px !important}.wrapper h2{}.wrapper h2{font-size:30px !important;line-height:38px !important}.wrapper h3{}.wrapper h3{font-size:22px !important;line-height:31px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}</style> <style type="text/css">body{margin: 0; padding: 0;}table{border-collapse: collapse; table-layout: fixed;}*{line-height: inherit;}[x-apple-data-detectors],[href^="tel"],[href^="sms"]{color: inherit !important; text-decoration: none !important;}.wrapper .footer__share-button a:hover,.wrapper .footer__share-button a:focus{color: #ffffff !important;}.btn a:hover,.btn a:focus,.footer__share-button a:hover,.footer__share-button a:focus,.email-footer__links a:hover,.email-footer__links a:focus{opacity: 0.8;}.preheader,.header,.layout,.column{transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;}.preheader td{padding-bottom: 8px;}.layout,div.header{max-width: 400px !important; -fallback-width: 95% !important; width: calc(100% - 20px) !important;}div.preheader{max-width: 360px !important; -fallback-width: 90% !important; width: calc(100% - 60px) !important;}.snippet,.webversion{Float: none !important;}.column{max-width: 400px !important; width: 100% !important;}.fixed-width.has-border{max-width: 402px !important;}.fixed-width.has-border .layout__inner{box-sizing: border-box;}.snippet,.webversion{width: 50% !important;}.ie .btn{width: 100%;}[owa] .column div,[owa] .column button{display: block !important;}.ie .column,[owa] .column,.ie .gutter,[owa] .gutter{display: table-cell; float: none !important; vertical-align: top;}.ie div.preheader,[owa] div.preheader,.ie .email-footer,[owa] .email-footer{max-width: 560px !important; width: 560px !important;}.ie .snippet,[owa] .snippet,.ie .webversion,[owa] .webversion{width: 280px !important;}.ie div.header,[owa] div.header,.ie .layout,[owa] .layout,.ie .one-col .column,[owa] .one-col .column{max-width: 600px !important; width: 600px !important;}.ie .fixed-width.has-border,[owa] .fixed-width.has-border,.ie .has-gutter.has-border,[owa] .has-gutter.has-border{max-width: 602px !important; width: 602px !important;}.ie .two-col .column,[owa] .two-col .column{max-width: 300px !important; width: 300px !important;}.ie .three-col .column,[owa] .three-col .column,.ie .narrow,[owa] .narrow{max-width: 200px !important; width: 200px !important;}.ie .wide,[owa] .wide{width: 400px !important;}.ie .two-col.has-gutter .column,[owa] .two-col.x_has-gutter .column{max-width: 290px !important; width: 290px !important;}.ie .three-col.has-gutter .column,[owa] .three-col.x_has-gutter .column,.ie .has-gutter .narrow,[owa] .has-gutter .narrow{max-width: 188px !important; width: 188px !important;}.ie .has-gutter .wide,[owa] .has-gutter .wide{max-width: 394px !important; width: 394px !important;}.ie .two-col.has-gutter.has-border .column,[owa] .two-col.x_has-gutter.x_has-border .column{max-width: 292px !important; width: 292px !important;}.ie .three-col.has-gutter.has-border .column,[owa] .three-col.x_has-gutter.x_has-border .column,.ie .has-gutter.has-border .narrow,[owa] .has-gutter.x_has-border .narrow{max-width: 190px !important; width: 190px !important;}.ie .has-gutter.has-border .wide,[owa] .has-gutter.x_has-border .wide{max-width: 396px !important; width: 396px !important;}.ie .fixed-width .layout__inner{border-left: 0 none white !important; border-right: 0 none white !important;}.ie .layout__edges{display: none;}.mso .layout__edges{font-size: 0;}.layout-fixed-width,.mso .layout-full-width{background-color: #ffffff;}@media only screen and (min-width: 620px){.column, .gutter{display: table-cell; Float: none !important; vertical-align: top;}div.preheader, .email-footer{max-width: 560px !important; width: 560px !important;}.snippet, .webversion{width: 280px !important;}div.header, .layout, .one-col .column{max-width: 600px !important; width: 600px !important;}.fixed-width.has-border, .fixed-width.ecxhas-border, .has-gutter.has-border, .has-gutter.ecxhas-border{max-width: 602px !important; width: 602px !important;}.two-col .column{max-width: 300px !important; width: 300px !important;}.three-col .column, .column.narrow{max-width: 200px !important; width: 200px !important;}.column.wide{width: 400px !important;}.two-col.has-gutter .column, .two-col.ecxhas-gutter .column{max-width: 290px !important; width: 290px !important;}.three-col.has-gutter .column, .three-col.ecxhas-gutter .column, .has-gutter .narrow{max-width: 188px !important; width: 188px !important;}.has-gutter .wide{max-width: 394px !important; width: 394px !important;}.two-col.has-gutter.has-border .column, .two-col.ecxhas-gutter.ecxhas-border .column{max-width: 292px !important; width: 292px !important;}.three-col.has-gutter.has-border .column, .three-col.ecxhas-gutter.ecxhas-border .column, .has-gutter.has-border .narrow, .has-gutter.ecxhas-border .narrow{max-width: 190px !important; width: 190px !important;}.has-gutter.has-border .wide, .has-gutter.ecxhas-border .wide{max-width: 396px !important; width: 396px !important;}}@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx){.fblike{background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;}.tweet{background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;}.linkedinshare{background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;}.forwardtoafriend{background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;}}@media (max-width: 321px){.fixed-width.has-border .layout__inner{border-width: 1px 0 !important;}.layout, .column{min-width: 320px !important; width: 320px !important;}.border{display: none;}}.mso div{border: 0 none white !important;}.mso .w560 .divider{Margin-left: 260px !important; Margin-right: 260px !important;}.mso .w360 .divider{Margin-left: 160px !important; Margin-right: 160px !important;}.mso .w260 .divider{Margin-left: 110px !important; Margin-right: 110px !important;}.mso .w160 .divider{Margin-left: 60px !important; Margin-right: 60px !important;}.mso .w354 .divider{Margin-left: 157px !important; Margin-right: 157px !important;}.mso .w250 .divider{Margin-left: 105px !important; Margin-right: 105px !important;}.mso .w148 .divider{Margin-left: 54px !important; Margin-right: 54px !important;}.mso .size-8,.ie .size-8{font-size: 8px !important; line-height: 14px !important;}.mso .size-9,.ie .size-9{font-size: 9px !important; line-height: 16px !important;}.mso .size-10,.ie .size-10{font-size: 10px !important; line-height: 18px !important;}.mso .size-11,.ie .size-11{font-size: 11px !important; line-height: 19px !important;}.mso .size-12,.ie .size-12{font-size: 12px !important; line-height: 19px !important;}.mso .size-13,.ie .size-13{font-size: 13px !important; line-height: 21px !important;}.mso .size-14,.ie .size-14{font-size: 14px !important; line-height: 21px !important;}.mso .size-15,.ie .size-15{font-size: 15px !important; line-height: 23px !important;}.mso .size-16,.ie .size-16{font-size: 16px !important; line-height: 24px !important;}.mso .size-17,.ie .size-17{font-size: 17px !important; line-height: 26px !important;}.mso .size-18,.ie .size-18{font-size: 18px !important; line-height: 26px !important;}.mso .size-20,.ie .size-20{font-size: 20px !important; line-height: 28px !important;}.mso .size-22,.ie .size-22{font-size: 22px !important; line-height: 31px !important;}.mso .size-24,.ie .size-24{font-size: 24px !important; line-height: 32px !important;}.mso .size-26,.ie .size-26{font-size: 26px !important; line-height: 34px !important;}.mso .size-28,.ie .size-28{font-size: 28px !important; line-height: 36px !important;}.mso .size-30,.ie .size-30{font-size: 30px !important; line-height: 38px !important;}.mso .size-32,.ie .size-32{font-size: 32px !important; line-height: 40px !important;}.mso .size-34,.ie .size-34{font-size: 34px !important; line-height: 43px !important;}.mso .size-36,.ie .size-36{font-size: 36px !important; line-height: 43px !important;}.mso .size-40,.ie .size-40{font-size: 40px !important; line-height: 47px !important;}.mso .size-44,.ie .size-44{font-size: 44px !important; line-height: 50px !important;}.mso .size-48,.ie .size-48{font-size: 48px !important; line-height: 54px !important;}.mso .size-56,.ie .size-56{font-size: 56px !important; line-height: 60px !important;}.mso .size-64,.ie .size-64{font-size: 64px !important; line-height: 63px !important;}</style> <style type="text/css">@import url(https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic);</style><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic" rel="stylesheet" type="text/css"><style type="text/css">body{background-color:#fff}.logo a:hover,.logo a:focus{color:#859bb1 !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:64px !important;line-height:63px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:30px !important;line-height:38px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:22px !important;line-height:31px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:sans-serif}</style><meta name="robots" content="noindex,nofollow"></meta><meta property="og:title" content="My First Campaign"></meta></head><!--[if mso]> <body class="mso"><![endif]--> <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"> <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td> <div role="banner"> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #adb3b9;font-family: sans-serif;"> </div></div></div><div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 139px;" src="https://i1.createsend1.com/ei/j/9C/EC1/A3A/175429/csfinal/fruit-logo-38286413.jpg" alt="" width="139"></div></div></div></div><div role="section"> <div style="background-color: #4b5462;"> <div class="layout one-col" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;"> <div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <p class="size-28" style="Margin-top: 0;Margin-bottom: 20px;font-family: playfair display,didot,bodoni mt,times new roman,serif;font-size: 24px;line-height: 32px;text-align: center;" lang="x-size-28"><span class="font-playfair-display"><span style="color:#ffffff">Llena - Registration</span></span></p></div></div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"> <h1 class="size-20" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000;font-size: 17px;line-height: 26px;font-family: avenir,sans-serif;text-align: center;" lang="x-size-20"><span class="font-avenir"><font color="#ffffff"><strong>Hi There,</strong></font></span></h1><p class="size-20" style="Margin-top: 20px;Margin-bottom: 20px;font-size: 17px;line-height: 26px;" lang="x-size-20">Your registration is successful. You can please login now.</p></div></div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="mso-line-height-rule: exactly;line-height: 85px;font-size: 1px;">&nbsp;</div></div></div></div></div></div><div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 15px;">&nbsp;</div><div style="mso-line-height-rule: exactly;" role="contentinfo"> <div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <div>MindCrew Technologies<br>3/A Akshay Deep colony, Indore</div></div><div style="font-size: 12px;line-height: 19px;Margin-top: 18px;"> <div>You are receiving this email from Leena-App.</div></div></div></div><div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> </div></div></div></div><div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="font-size: 12px;line-height: 19px;"> <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href="https://mct.createsend1.com/t/j-u-njdiko-l-y/">Unsubscribe</a> </div></div></div></div></div></div><div style="mso-line-height-rule: exactly;line-height: 40px;font-size: 40px;">&nbsp;</div></div></td></tr></tbody></table> <img style="overflow: hidden;position: fixed;visibility: hidden !important;display: block !important;height: 1px !important;width: 1px !important;border: 0 !important;margin: 0 !important;padding: 0 !important;" src="https://mct.createsend1.com/t/j-o-njdiko-l/o.gif" width="1" height="1" border="0" alt=""></body></html>'
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






router.post('/', function(req, res, next) {
  var reqObj = req.body;  
  var decryptedText = cryptLib.decrypt(reqObj.password, key, iv);  
  res.send(decryptedText);

});



//copy of addwalking with promise

router.post('/addGuestWalking', middleware,function(req,res,next) {

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

    if(!reqObj.imei || reqObj.imei == "" || !reqObj.distance || reqObj.distance == "" || !reqObj.distance_unit || reqObj.distance_unit == "" ||  !reqObj.date || reqObj.date == "" || !reqObj.walk_time || reqObj.walk_time == "" ||  !reqObj.img || reqObj.img == "")
        {

            res.json({"status":'false',"msg":'Please fill all the fields!'});
        }
        else{

                    function addPoints() {
                         console.log("agyaaa1");
                         return new Promise(function(resolve,reject) {


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

                            
                             var query = conn.query("SELECT * from tb_guestUsers WHERE  tb_guestUsers.imei =  '"+reqObj.imei+"'", function (err, result){
                                 if(err){
                                 console.error('SQL error: ', err);
                                 res.json({"status":'false',"msg":'Something went wrong!'});
                                 }

                                 if(result != ""){

                                             var queryAddWalkingPoints = conn.query("insert into tb_points_guest(imei, points, points_type, device_type, device_token) Values('"+reqObj.imei+"', '"+reqObj.walk_points+"', 1, '"+reqObj.device_type+"', '"+reqObj.device_token+"')", function (err, resultAddWalkingPoints){
                                                             if(err){
                                                             console.error('SQL error: ', err);
                                                             res.json({"status":'false',"msg":'Something went wrong!'});
                                                             }

                                                            resolve(true); 
                                     });  
                                 }
                                 else{

                                     var queryAddUser = conn.query("insert into tb_guestUsers(imei, device_type, device_token, parent_id) Values('"+reqObj.imei+"', '"+reqObj.device_type+"', '"+reqObj.device_token+"', '"+parentID+"')", function (err, resultAddUser){
                                                             if(err){
                                                             console.error('SQL error: ', err);
                                                             res.json({"status":'false',"msg":'Something went wrong!'});
                                                             }

                                                                  var queryAddWalkingPoints = conn.query("insert into tb_points_guest(imei, points, points_type, device_type, device_token) Values('"+reqObj.imei+"', '"+reqObj.walk_points+"', 1, '"+reqObj.device_type+"', '"+reqObj.device_token+"')", function (err, resultAddWalkingPoints){
                                                                     if(err){
                                                                     console.error('SQL error: ', err);
                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
                                                                     }

                                                                  resolve(true); 
                                                              }); 
                                     });  

                                 }


                             });
                            
                           
                            


                         });
                    }

                    function addWalking(deviceData) {
                        console.log("agyaaa1");
                        return new Promise(function(resolve,reject) {
                            
                            
                            var imagesFile = new Buffer(reqObj.img, 'base64');
                            var timestamp  =  Date.now();
                            fs.writeFileSync("./Images/"+timestamp+".jpg", imagesFile);
                            //console.log("insert into tb_walking_history_guest(imei, distance, date, walk_time, img, distance_unit, from_lat, from_lng, to_lat, to_lng) Values('"+reqObj.userid+"','"+reqObj.distance+"','"+reqObj.date+"','"+reqObj.walk_time+"','"+defaultUrl+timestamp+".jpg','"+reqObj.distance_unit+"','"+reqObj.from_lat+"','"+reqObj.from_lng+"','"+reqObj.to_lat+"','"+reqObj.to_lng+"')");

                            var query = conn.query("insert into tb_walking_history_guest(imei, distance, date, walk_time, img, distance_unit, from_lat, from_lng, to_lat, to_lng, velocity) Values('"+reqObj.imei+"','"+reqObj.distance+"','"+reqObj.date+"','"+reqObj.walk_time+"','"+defaultUrl+timestamp+".jpg','"+reqObj.distance_unit+"','"+reqObj.from_lat+"','"+reqObj.from_lng+"','"+reqObj.to_lat+"','"+reqObj.to_lng+"', '"+reqObj.velocity+"')", function (err, resultdata){
                                if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"msg":'Something went wrong!'});
                                }

                                

                                     var distance = parseFloat(reqObj.distance);
                                    if(distance >= 50){

                                        var calculatedPointIndex = parseInt(distance/5);
                                        if(calculatedPointIndex > 0){
                                            var calculatedPoint = calculatedPointIndex * 10;

                                            if(reqObj.device_type == "iOS"){
                                                             let deviceToken = reqObj.device_token;
                                                             
                                                             // Prepare the notifications
                                                             let notification = new apn.Notification();
                                                             notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
                                                             notification.badge = 2;
                                                             notification.sound = "default";
                                                             notification.alert = "You got "+reqObj.walk_points+ " points";
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
                                                        }else if(reqObj.device_type == "Android"){

                                                            console.log(reqObj.device_token);
                                                            console.log(2222222222222222);

                                                            // Prepare a message to be sent
                                                            var message = new gcm.Message({

                                                                data: { key:  "You got "+reqObj.walk_points+ " points"},

                                                                    notification: {
                                                                        title: "Fit India",
                                                                        icon: "ic_launcher",
                                                                        body: "You got "+reqObj.walk_points+ " points"
                                                                    }
                                                            });
                                                            message.addData({
                                                                            message: "You got "+reqObj.walk_points+ " points"
                                                                        });
                                                            // Specify which registration IDs to deliver the message to
                                                            var regTokens = [reqObj.device_token];
                                                             
                                                            // Actually send the message
                                                            sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                                                                if (err) console.error(err);
                                                                else console.log(response);
                                                            });



                                                        }
                                                        resolve(true);                                       
                                     }
                                     resolve(true); 
                                 }
                                 resolve(true); 

                                });

                        });
                    }


                     function getPointsGlobal() {
                        console.log("agyaaa");
                        console.log("SELECT tb_guestUsers.id as userid, tb_guestUsers.imei as imei, sum(tb_points_guest.points) as globalPoints FROM tb_points_guest,tb_guestUsers where tb_points_guest.imei=tb_guestUsers.imei and tb_guestUsers.imei='"+reqObj.imei+"'");
                        return new Promise(function(resolve,reject) {
                            
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_guestUsers.id as userid, tb_guestUsers.imei as imei, sum(tb_points_guest.points) as globalPoints FROM tb_points_guest,tb_guestUsers where tb_points_guest.imei=tb_guestUsers.imei and tb_guestUsers.imei='"+reqObj.imei+"'", function (err, resultPointsGlobal){
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


                    

                    function getDeviceInfo() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                                    
                                
                                    var queryLeaderboardByOrg = conn.query("SELECT tb_guestUsers.device_type as device_type, tb_guestUsers.device_token as device_token  FROM tb_guestUsers where tb_guestUsers.imei='"+reqObj.imei+"'", function (err, resultDeviceInfo){
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

                    addPoints().then(function(data) {

                    

                     if(data== true){    
                         getDeviceInfo().then(function(data) {
                                        var deviceData = data;
                             
                                        console.log(deviceData);
                           
                                        addWalking(deviceData).then(function(data) {
                                                console.log("4 me aaya");
                                                console.log(data);


                                                

                                                if(data== true){
                                                    
                                                    getPointsGlobal().then(function(data) {
                                                    console.log("3 me aaya1");

                                                    var pointsInOrganisation = data;


                                                        var jsonObj = {};
                                                                            if(pointsInOrganisation.userid == null){

                                                                               
                                                                                jsonObj.globalPoints = 0
                                                                               

                                                                            }
                                                                            else{
                                                                                
                                                                                // jsonObj.name = globalPoints.name
                                                                                // jsonObj.email = globalPoints.email
                                                                                // jsonObj.profileImg = globalPoints.profileImg
                                                                                jsonObj.globalPoints = pointsInOrganisation.globalPoints
                                                                                
                                                                            } 
                                                        res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});
  
                                                    });

                                                }
                                                else{
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                                }
                                                //next();
                                            });




                            });

                     }

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




//addPoints with promise

// router.post('/addGuestPoints', middleware,function(req,res,next) {

//     try{
// var reqObj = req.body;
// console.log(reqObj);    
// req.getConnection(function(err, conn){
//     console.log(conn)
// if(err)
// {
// console.error('SQL Connection error: ', err);
// res.json({"status":'false',"msg":'Something went wrong!'});
// }
// else
// {

//     if(!reqObj.imei || reqObj.imei == "")
//         {

//             res.json({"status":'false',"msg":'Please fill all the fields!'});
//         }
//         else{

//             console.log("sanjeev");

//                     function addPoints() {
//                         console.log("agyaaa1");
//                         return new Promise(function(resolve,reject) {


//                             var parentID = 0;

//                                 if(!reqObj.referral_code || reqObj.referral_code == ''){

//                                     parentID = 0;

//                                 }
//                                 else{
//                                         var queryCheckReferral = conn.query("SELECT * from tb_users WHERE  tb_users.referral_code =  '"+reqObj.referral_code+"'", function (err, resultCheckReferral)
//                                             {

//                                             if(err){
//                                             console.error('SQL error: ', err);
//                                             res.json({"status":'false',"msg":'Something went wrong!'});
//                                             }

//                                             if(resultCheckReferral==''){

//                                                 res.json({"status":'false',"msg":'Invalid referral code!'});
//                                             }
//                                             else{

//                                                 parentID = resultCheckReferral[0].id;
//                                             }

//                                         });

//                                 }

                            
//                             var query = conn.query("SELECT * from tb_guestUsers WHERE  tb_guestUsers.imei =  '"+reqObj.imei+"'", function (err, result){
//                                 if(err){
//                                 console.error('SQL error: ', err);
//                                 res.json({"status":'false',"msg":'Something went wrong!'});
//                                 }

//                                 if(result != ""){

//                                             var queryAddWalkingPoints = conn.query("insert into tb_points_guest(imei, points, points_type, device_type, device_token) Values('"+reqObj.imei+"', 10, 1, '"+reqObj.device_type+"', '"+reqObj.device_token+"')", function (err, resultAddWalkingPoints){
//                                                             if(err){
//                                                             console.error('SQL error: ', err);
//                                                             res.json({"status":'false',"msg":'Something went wrong!'});
//                                                             }

//                                                            resolve(true); 
//                                     });  
//                                 }
//                                 else{

//                                     var queryAddUser = conn.query("insert into tb_guestUsers(imei, device_type, device_token, parent_id) Values('"+reqObj.imei+"', '"+reqObj.device_type+"', '"+reqObj.device_token+"', '"+parentID+"')", function (err, resultAddUser){
//                                                             if(err){
//                                                             console.error('SQL error: ', err);
//                                                             res.json({"status":'false',"msg":'Something went wrong!'});
//                                                             }

//                                                                  var queryAddWalkingPoints = conn.query("insert into tb_points_guest(imei, points, points_type, device_type, device_token) Values('"+reqObj.imei+"', 10, 1, '"+reqObj.device_type+"', '"+reqObj.device_token+"')", function (err, resultAddWalkingPoints){
//                                                                     if(err){
//                                                                     console.error('SQL error: ', err);
//                                                                     res.json({"status":'false',"msg":'Something went wrong!'});
//                                                                     }

//                                                                  resolve(true); 
//                                                              }); 
//                                     });  

//                                 }


//                             });
                            
                           
                            


//                         });
//                     }


//                     function getPointsGlobal() {
//                         console.log("agyaaa");
//                         return new Promise(function(resolve,reject) {
                            
//                                     var queryLeaderboardGlobal = conn.query("SELECT tb_guestUsers.id as userid, tb_guestUsers.imei as imei, sum(tb_points_guest.points) as globalPoints FROM tb_points_guest,tb_guestUsers where tb_points_guest.imei=tb_guestUsers.imei and tb_guestUsers.imei='"+reqObj.imei+"'", function (err, resultPointsGlobal){
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





                       
//             addPoints().then(function(data) {
//                     console.log("4 me aaya");
//                     console.log(data);
//                     console.log("4 me aaya");

                    

//                     if(data== true){
                        
//                         getPointsGlobal().then(function(data) {
//                         console.log("3 me aaya1");


//                         var pointsInOrganisation = data;


//                                     var jsonObj = {};
//                                                         if(pointsInOrganisation.userid == null){

                                                           
//                                                             jsonObj.globalPoints = 0
                                                           

//                                                         }
//                                                         else{
                                                            
//                                                             // jsonObj.name = globalPoints.name
//                                                             // jsonObj.email = globalPoints.email
//                                                             // jsonObj.profileImg = globalPoints.profileImg
//                                                             jsonObj.globalPoints = pointsInOrganisation.globalPoints
                                                            
//                                                         }   
                                                        

//                             res.json({"status":'true', "msg":'Data Added!',"response":jsonObj});
//                         });

//                     }
//                     else{
//                         res.json({"status":'false',"msg":'Something went wrong!'});
//                     }
//                     //next();
//                 });
                         

                        

//                 }
// }
// });
// }
// catch(ex){
// console.error("Internal error:"+ex);
// return next(ex);
// }
// });




//get walking history

router.post('/getGuestWalking', middleware, function(req,res,next){
    console.log(1111111);
try{
var reqObj = req.body;        

console.log(reqObj);
        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT *, DATE_FORMAT(date, '%d-%m-%Y %H:%i:%s') as daten, DATE_FORMAT(date, '%d-%m-%Y %r') as dater from tb_walking_history_guest WHERE  tb_walking_history_guest.imei =  '"+reqObj.imei+"' order by tb_walking_history_guest.id desc", function (err, result){
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






//get user Score

router.post('/getGuestScore', middleware, function(req,res,next){


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

    

                    function getStepsScore() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            
                                    var querygetStepsScore = conn.query("SELECT stepscount, date, total_distance, total_calorie FROM `tb_stepscount_history_guest` where imei='"+reqObj.imei+"' order by id DESC limit 1", function (err, resultgetStepsScore){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                        if(resultgetStepsScore == ""){

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
                            
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_guestUsers.id as userid, tb_guestUsers.imei as imei, sum(tb_points_guest.points) as globalPoints FROM tb_points_guest,tb_guestUsers where tb_points_guest.imei=tb_guestUsers.imei and tb_guestUsers.imei='"+reqObj.imei+"'", function (err, resultPointsGlobal){
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





                 
                  getStepsScore().then(function(data) {
                    var stepsScore = data;
                            getPointsGlobal().then(function(data) {
                                    console.log("4 me aaya");
                                    console.log(data);
                                    var pointsInOrganisation = data;


                                    var jsonObj = {};
                                                        if(pointsInOrganisation.userid == null){
                                                            var resultgetStepsScore ={};
                                                            resultgetStepsScore.stepscount = "0"
                                                            resultgetStepsScore.date = ''
                                                            resultgetStepsScore.total_distance = "0"
                                                            resultgetStepsScore.total_calorie = "0"

                                                            jsonObj.globalPoints = 0
                                                            jsonObj.stepsInfo = resultgetStepsScore
                                                           

                                                        }
                                                        else{
                                                            
                                                            // jsonObj.name = globalPoints.name
                                                            // jsonObj.email = globalPoints.email
                                                            // jsonObj.profileImg = globalPoints.profileImg
                                                            jsonObj.globalPoints = pointsInOrganisation.globalPoints
                                                            jsonObj.stepsInfo = stepsScore
                                                            
                                                        }   
                                                        

                                    res.json({"status":'true',"response":jsonObj});
                                    //next();
                                });
                            });
                      
                
}
});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});


//Add Steps


router.post('/addGuestStepsCount', middleware, function(req,res,next){

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
        

        function addStepsCount() {
                  console.log("agyaaa");
                  return new Promise(function(resolve,reject) { 
                  var query = conn.query("SELECT * FROM `tb_stepscount_history_guest` where imei='"+reqObj.imei+"' ORDER BY id DESC limit 1", function (err, result){
                          if(err){
                          console.error('SQL error: ', err);
                          res.json({"status":'false',"msg":'Something went wrong!'});
                          }
                          

                          console.log(44444444);
                          if(result == ""){
                            console.log(23);
                            
                            var points = parseInt(reqObj.stepscount) / 20;
                            var realstp = parseInt(points)*20;
                          }else{
                            console.log(12);

                            var countSteps = parseInt(reqObj.stepscount) - parseInt(result[0].realstp);
                            var points = parseInt(countSteps) / 20;
                            var realstp = parseInt(points)*20 + parseInt(result[0].realstp);
                          }



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

                            
                             var query = conn.query("SELECT * from tb_guestUsers WHERE  tb_guestUsers.imei =  '"+reqObj.imei+"'", function (err, result){
                                 if(err){
                                 console.error('SQL error: ', err);
                                 res.json({"status":'false',"msg":'Something went wrong!'});
                                 }

                                 if(result != ""){

                                             var queryInsertHistory = conn.query("insert into tb_stepscount_history_guest(imei, stepscount, realstp, total_distance, total_calorie) Values('"+reqObj.imei+"', '"+reqObj.stepscount+"', '"+realstp+"', '"+reqObj.total_distance+"', '"+reqObj.total_calorie+"')", function (err, resultInsertHistory){
                                          if(err){
                                          console.error('SQL error: ', err);
                                          res.json({"status":'false',"msg":'Something went wrong!'});
                                          }
                                            if(parseInt(points) > 0){
                                            var queryInsertPoint = conn.query("insert into tb_points_guest(imei, points, points_type, refer_to, device_type, device_token) Values('"+reqObj.imei+"', '"+parseInt(points)+"', 7, 0, '', '')", function (err, resultInsertPoint){
                                                  if(err){
                                                  console.error('SQL error: ', err);
                                                  res.json({"status":'false',"msg":'Something went wrong!'});
                                                  }
                                                  

                                                      
                                                        resolve(true);  
                                                     
                                                  
                                                  });


                                                  } else{

                                                    resolve(true);  
                                                  }
                                              
                                                
                                             
                                          
                                          });  
                                 }
                                 else{

                                     var queryAddUser = conn.query("insert into tb_guestUsers(imei, device_type, device_token, parent_id) Values('"+reqObj.imei+"', '"+reqObj.device_type+"', '"+reqObj.device_token+"', '"+parentID+"')", function (err, resultAddUser){
                                                             if(err){
                                                             console.error('SQL error: ', err);
                                                             res.json({"status":'false',"msg":'Something went wrong!'});
                                                             }

                                                                  var queryInsertHistory = conn.query("insert into tb_stepscount_history_guest(imei, stepscount, realstp, total_distance, total_calorie) Values('"+reqObj.imei+"', '"+reqObj.stepscount+"', '"+realstp+"', '"+reqObj.total_distance+"', '"+reqObj.total_calorie+"')", function (err, resultInsertHistory){
                                          if(err){
                                          console.error('SQL error: ', err);
                                          res.json({"status":'false',"msg":'Something went wrong!'});
                                          }
                                            if(parseInt(points) > 0){
                                            var queryInsertPoint = conn.query("insert into tb_points_guest(imei, points, points_type, refer_to, device_type, device_token) Values('"+reqObj.imei+"', '"+parseInt(points)+"', 7, 0, '', '')", function (err, resultInsertPoint){
                                                  if(err){
                                                  console.error('SQL error: ', err);
                                                  res.json({"status":'false',"msg":'Something went wrong!'});
                                                  }
                                                  

                                                      
                                                        resolve(true);  
                                                     
                                                  
                                                  });


                                                  } else{

                                                    resolve(true);  
                                                  }
                                              
                                                
                                             
                                          
                                          }); 
                                     });  

                                 }


                             });

             

                            
                          
                          });

                  })
                }


        function getPointsGlobal() {
                        console.log("agyaaa");
                        return new Promise(function(resolve,reject) {
                            
                                    var queryLeaderboardGlobal = conn.query("SELECT tb_guestUsers.id as userid, tb_guestUsers.imei as imei, sum(tb_points_guest.points) as globalPoints FROM tb_points_guest,tb_guestUsers where tb_points_guest.imei=tb_guestUsers.imei and tb_guestUsers.imei='"+reqObj.imei+"'", function (err, resultPointsGlobal){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"msg":'Something went wrong!'});
                                    }

                                      console.log(resultPointsGlobal);
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




                    addStepsCount().then(function(data) {

                      if(data== true){
                                                    
                                                    getPointsGlobal().then(function(data) {
                                                    console.log("3 me aaya1");

                                                    var pointsInOrganisation = data;


                                                    var jsonObj = {};
                                                                        if(pointsInOrganisation.userid == null){

                                                                           
                                                                            jsonObj.globalPoints = 0
                                                                           

                                                                        }
                                                                        else{
                                                                            
                                                                            // jsonObj.name = globalPoints.name
                                                                            // jsonObj.email = globalPoints.email
                                                                            // jsonObj.profileImg = globalPoints.profileImg
                                                                            jsonObj.globalPoints = pointsInOrganisation.globalPoints
                                                                            
                                                                        }  
                                                           res.json({"status":'true', "msg":'Successfully saved!',"response":jsonObj});             
                                                    });

                                                }
                                                else{
                                                    res.json({"status":'false',"msg":'Something went wrong!'});
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




