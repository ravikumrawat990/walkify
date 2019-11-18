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

//sdvsfsdfsdf


hhhh

var gcm = require('node-gcm');
//var sender = new gcm.Sender('AIzaSyCCKNgm9SgRuEnTlxvUVlXAuV8obSR1J4U');
var sender = new gcm.Sender('AIzaSyDdK4zYtqVGNHR1oLVn8H-HYdxTImnglyQ');
var defaultUrl = "http://52.66.124.74:3000/ImagesFiles/";
const {initPayment, responsePayment} = require("../paytm/services/index");
const shortid = require('shortid');

// var cryptLib = require('cryptlib'),
//     iv = 'mindcrewnewapp17', //16 bytes = 128 bit 
//     key = cryptLib.getHashSha256('newapp17mindcrew', 32), //32 bytes = 256 bits 
//     encryptedText = cryptLib.encrypt('159753', key, iv);
//decryptedText = cryptLib.decrypt('AHIpkwOPQ1JGhmwQpX9+PA==', key, iv);

// var cryptLib = require('cryptlib'),
    // iv = cryptLib.generateRandomIV(16), //16 bytes = 128 bit 
    // key = cryptLib.getHashSha256('walkify9!8@7*', 32), //32 bytes = 256 bits 
    // encryptedText = cryptLib.encrypt('adasdadasd', key);
	
	var cryptLib = require('cryptlib'),
    iv = 'mindcrewnewapp17', //16 bytes = 128 bit 
    key = cryptLib.getHashSha256('newapp17mindcrew', 32), //32 bytes = 256 bits 
    encryptedText = cryptLib.encrypt('159753', key, iv);

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
 

/*  All the challenges API is written here */

//******************************** get upcoming challenges **************************//
router.post('/getUpcomingChallengesListPrev', function(req,res,next){
        try{
        var reqObj = req.body; 
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }       
        req.getConnection(function(err, conn){  
             var query = conn.query("select b.userid,a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id left join tb_challenge_joins as b on a.id=b.upcoming_challenge_id and b.userid = '"+reqObj.userid+"' where a.challenge_status = '0'", function (err, result){
                    if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!'});
                    } else {
                        if(result.length>0){
                            // console.log("28 AUG",result)
                                challengesModel.challangeCheckJoin(result,reqObj.userid,function(filterdData){
                                    res.json({"status":'true',"message":'challenges list',"data":filterdData});
                             });
                              
                        }else{
                            res.json({"status":'false',"message":'No challenges found!'});
                        }        
                    }
                });
            });

            }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}); //end of getUpcomingChallengesList API

//****************************** join Challenge API on 30 AUg *****************************//
router.post('/joinChallengeSgtprev', function(req,res,next){
    console.log("11111");
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.payout==undefined || reqObj.payout==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }
        else{
            req.getConnection(function(err, conn){  
                 var query = conn.query("SELECT tblchl.id as challenge_id,tblchl.challenge_name,tblchl.spots,tblchl.join_members,tblchl.entry_fees,tblchl.challenge_status from tb_challenge_leagues as tblchl where tblchl.id='"+reqObj.challenge_id+"' limit 1", function (err,result){
                        if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                        }else{
                            if(result.length>0){
                                if(result[0].challenge_status===0){
                                    if(result[0].spots!=0){
                                        conn.query("select b.userid,b.challenge_id,b.upcoming_challenge_id,a.challenge_status from tb_challenge_joins as b left join tb_challenge_leagues as a on b.upcoming_challenge_id=a.id where b.userid='"+reqObj.userid+"'",function(err,alreadyJoinresult){
                                            if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else{
                                                if(alreadyJoinresult.length>0){
                                                    if(alreadyJoinresult[0].challenge_status===0 && alreadyJoinresult[0].upcoming_challenge_id!=0){
                                                        res.json({"status":'false',"message":'you have already joined the challenge!'});
                                                    }else if(alreadyJoinresult[0].challenge_status===1 && alreadyJoinresult[0].upcoming_challenge_id!=0){
                                                        res.json({"status":'false',"data":'',"message":'you have alreay joined the upcoming challenge!'});
                                                    }else{
                                                        conn.query("SELECT amount as useramount,userid from tb_challenge_wallet where userid='"+reqObj.userid+"'",function(err,walletamtupresult){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else{
                                                            if(walletamtupresult.length>0){
                                                                if(walletamtupresult[0].useramount>=result[0].entry_fees){
                                
                                                                    conn.query("UPDATE tb_challenge_wallet SET amount=('"+walletamtupresult[0].useramount+"'-'"+result[0].entry_fees+"') where userid='"+reqObj.userid+"'",function(err,deductusrupamt){             
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            if(deductusrupamt.affectedRows===1){
                                                                                conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+reqObj.challenge_id+"", function (err,updatespotsupresult){
                                                                                    if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                                    }else{
                                                                                        if(updatespotsupresult.affectedRows===1){
                                                                                            conn.query("update tb_challenge_joins SET upcoming_challenge_id='"+reqObj.challenge_id+"' where userid='"+reqObj.userid+"'", function (err, updatejoinedusrResult){
                                                                                                if(err){
                                                                                                    console.error('SQL error: ', err);
                                                                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                                                                }else{
                                                                                                    if(updatejoinedusrResult.affectedRows===1){
                                                                                                        res.json({"status":"true","data":'',"message":'Congratulations you have successfully join the challenge.'});
                                                                                                    }
                                                                                                }
                                                                                            }); // end of updatejoinedusrResult 
                                                                                        }
                                                                                    }//end of updatespotsupresult else

                                                                                });// end of updatespotsupresult query 
                                                                            } //end of deductusrupamt.affectedRows check
                                                                        } //end of else inside deduct query
                                                                    }); // end of query deductusrupamt result 
                                                                   

                                                                }else{
                                                                    console.log("22222222")
                                                                    jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                        var remaining = result[0].entry_fees - walletamtupresult[0].useramount
																		var orderId =shortid.generate();
																		var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																			console.log(intiatepay,"intiatepay")
																			if(err){
																			res.json({"status":"false","msg":"not inserted"})	
																			}
																			if(intiatepay.affectedRows===1){
																				res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																			}
																			
																		});
                                                                        
                                                                    })
                                                                }// end of walletamtupresult amount check 

                                                            }else{
                                                                //  res.json({"status":'false',"data":"","message":'Please add amount to your wallet!',"token":"","redirecturl":""});
                                                                 jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                    var remaining = result[0].entry_fees;
                                                                    var orderId =shortid.generate();
																	var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																		console.log(intiatepay,"intiatepay")
																		if(err){
																		res.json({"status":"false","msg":"not inserted"})	
																		}
																		if(intiatepay.affectedRows===1){
																			res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																		}
																		
																	});
                                                                })
                                                            } // end of walletamtupresult.length block
                                                        } //end of query else

                                                    }); //end of walletamtupresult query

                                                  } //else for upcoming challenge join
                                                    
                                                    
                                                }else{
                                                    conn.query("SELECT amount as useramount,userid from tb_challenge_wallet where userid='"+reqObj.userid+"'",function(err,walletamtresult){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else{
                                                            if(walletamtresult.length>0){
                                                                if(walletamtresult[0].useramount>=result[0].entry_fees){
                                
                                                                    conn.query("UPDATE tb_challenge_wallet SET amount=('"+walletamtresult[0].useramount+"'-'"+result[0].entry_fees+"') where userid='"+reqObj.userid+"'",function(err,deductusramt){             
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            if(deductusramt.affectedRows===1){
                                                                                conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+reqObj.challenge_id+"", function (err,updatespotsresult){
                                                                                    if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                                    }else{
                                                                                        if(updatespotsresult.affectedRows===1){
                                                                                            conn.query("insert into tb_challenge_joins (upcoming_challenge_id,userid) values("+reqObj.challenge_id+","+reqObj.userid+")", function (err, insertjoinedusrResult){
                                                                                                if(err){
                                                                                                    console.error('SQL error: ', err);
                                                                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                                                                }else{
                                                                                                    if(insertjoinedusrResult.insertId!=0){
                                                                                                        res.json({"status":"true","data":'',"message":'Congratulations you have successfully joined the challenge.'});
                                                                                                    }
                                                                                                }
                                                                                            }); // end of insertjoinedusrResult 
                                                                                        }
                                                                                    }//end of updatespotsresult else

                                                                                });// end of updatespotsresult query 
                                                                            } //end of deductusramt.affectedRows check
                                                                        } //end of else inside deduct query
                                                                    }); // end of query deductusramt result 
                                                                   

                                                                }else{
                                                                    console.log("5555555");
                                                                    jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                        var remaining = result[0].entry_fees - walletamtresult[0].useramount
                                                                        var orderId =shortid.generate();
																		var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																			console.log(intiatepay,"intiatepay")
																			if(err){
																			res.json({"status":"false","msg":"not inserted"})	
																			}
																			if(intiatepay.affectedRows===1){
																				res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																			}
																			
																		});
                                                                    })
                                                                }// end of walletamtresult amount check

                                                            }else{
                                                                // res.json({"status":'false',"data":"","message":'Please add amount to your wallet!',"token":"","redirecturl":""});
                                                                jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                    var remaining = result[0].entry_fees;
                                                                    var orderId =shortid.generate();
																	var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																		console.log(intiatepay,"intiatepay")
																		if(err){
																		res.json({"status":"false","msg":"not inserted"})	
																		}
																		if(intiatepay.affectedRows===1){
																			res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																		}
																		
																	});
                                                               })
                                                                
                                                            } // end of walletamtresult.length block
                                                        } //end of query else

                                                    }); //end of walletamtresult query

                                                } // end of alreadyJoinresult.length else
                                            } // end of else inside query block
                                        }); // end of query inside spots block

                                    }else{
                                         res.json({"status":'false',"data":'',"message":'Challenge has been full. Please try to join another challenge!'});
                                    }// end of spots check block
                                }else if(result[0].challenge_status===1){

                                    res.json({"status":'false',"data":'',"message":'Challenge has been started. Please try to join another challenge!'});
                                }else{
                                    console.log("if===== 30 AUg");

                                    res.json({"status":'false',"data":'',"message":'Challenge has expired!'});

                                } // end of else with challenge_status block
                               
                            }else{
                                res.json({"status":'false',"data":'',"message":'Challenge is not available!'});
                            }
                        } // end of else block inside query
                 }); //end of first query block
            }); //end of getConnection block
        } //end of first else block inside try block      
        
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of joinChallengeSgtagain API

//******************************* get completechallenge data ************************//
// update on 16 Sept
router.post('/getcompletechallengePrev', function(req,res,next){
    try{
        var reqObj = req.body;
        var getcompletedDataChallenges=[]; 
            if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select completed_challenge_id from tb_challenge_joins where userid='"+reqObj.userid+"'",function(err,result){
                         if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                         }else{
                            if(result.length>0 && result[0].completed_challenge_id!=''){
                              var splitstring = result[0].completed_challenge_id.split(","); //to split complete ids
                              var reverseArray = splitstring.reverse().splice(0,10); // to get reverse and oly 10 ids  
                              console.log("completed ids",reverseArray); 
                              if(reverseArray.length<10){
                                  var remaining_challenges = 10-reverseArray.length;
                                  console.log("query")
                                  conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.visible,a.challenge_rules,a.challenge_desc,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image_full,a.challenge_image,a.entry_fees,b.actual_winningpool,b.actual_poolprice,b.current_winningpool,b.current_poolprice from tb_challenge_leagues as a left join tb_challenge_winningpools as b on b.challenge_id=a.id where a.challenge_status=2 and a.id NOT IN ("+result[0].completed_challenge_id+") order by a.id desc limit "+remaining_challenges+"",function(err,remchlres){
                                       if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                       }else{
                                           if(remchlres.length>0){
                                               asyncLoop(reverseArray, function (item,next)
                                                  {
                                                    if(item!=undefined){
                                                        conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id where a.challenge_status = 2 and a.id='"+item+"'",function(err,getchallengeres){
                                                            if(err){
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                            }else{
                                                                if(getchallengeres.length>0){
                                                                     getcompletedDataChallenges.push({
                                                                        "challenge_id":getchallengeres[0].id,
                                                                        "challenge_name":getchallengeres[0].challenge_name,
                                                                        "spots":getchallengeres[0].spots,
                                                                        "join_members":getchallengeres[0].join_members,
                                                                        "challenge_desc":getchallengeres[0].challenge_desc,
                                                                        "challenge_rules":getchallengeres[0].challenge_rules,
                                                                        "actual_poolprice":getchallengeres[0].actual_poolprice,
                                                                        "actual_winningpool":JSON.parse(getchallengeres[0].actual_winningpool),
                                                                        "entry_fees":getchallengeres[0].entry_fees,
                                                                        "start_date":getchallengeres[0].start_date,
                                                                        "end_date":getchallengeres[0].end_date,
                                                                        "challenge_image_preview":getchallengeres[0].challenge_image,
                                                                        "challenge_image_full":getchallengeres[0].challenge_image_full,
                                                                        "challenge_status":getchallengeres[0].challenge_status,
                                                                        "visible":getchallengeres[0].visible,
                                                                        "iam_join":1
                                                                     }) 
                                                                     
                                                                     next();

                                                                }
                                                            }
                                                        }) // end of getchallengeres  
                                                  
                                                    }
                                                    
                                                }, function (err)
                                                {
                                                    if (err)
                                                    {
                                                        console.error('Error: ' + err.message);
                                                        return;
                                                    }  
                                                    asyncLoop(remchlres, function (item, next)
                                                    {    console.log("itemssss",item.id)
                                                        if(item!=undefined){
                                                            getcompletedDataChallenges.push({
                                                                "challenge_id":item.id,
                                                                "challenge_name":item.challenge_name,
                                                                "spots":item.spots,
                                                                "join_members":item.join_members,
                                                                "challenge_desc":item.challenge_desc,
                                                                "challenge_rules":item.challenge_rules,
                                                                "actual_poolprice":item.actual_poolprice,
                                                                "actual_winningpool":JSON.parse(item.actual_winningpool),
                                                                "entry_fees":item.entry_fees,
                                                                "start_date":item.start_date,
                                                                "end_date":item.end_date,
                                                                "challenge_image_preview":item.challenge_image,
                                                                "challenge_image_full":item.challenge_image_full,
                                                                "challenge_status":item.challenge_status,
                                                                "visible":item.visible,
                                                                "iam_join":0
                                                            })
                                                                
                                                        }
                                                        next();
                                                    }, function (err)
                                                    {
                                                        if (err)
                                                        {
                                                            console.error('Error: ' + err.message);
                                                            return;
                                                        }
                                                        
                                                         res.json({"status":'true',"message":'Complete challenges data!',"data":getcompletedDataChallenges});
                                                    }); //end of inside asyncLoop
                                                      
                           
                                                }); //end of asyncLoop
                                           }else{
                                               //if no challenge is comleted except user's challenges
                                            asyncLoop(reverseArray, function (item,next)
                                              {    

                                                if(item!=undefined){
                                                    conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id where a.challenge_status = 2 and a.id='"+item+"'",function(err,getchallengeres){
                                                        if(err){
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else{
                                                            if(getchallengeres.length>0){
                                                                 getcompletedDataChallenges.push({
                                                                    "challenge_id":getchallengeres[0].id,
                                                                    "challenge_name":getchallengeres[0].challenge_name,
                                                                    "spots":getchallengeres[0].spots,
                                                                    "join_members":getchallengeres[0].join_members,
                                                                    "challenge_desc":getchallengeres[0].challenge_desc,
                                                                    "challenge_rules":getchallengeres[0].challenge_rules,
                                                                    "actual_poolprice":getchallengeres[0].actual_poolprice,
                                                                    "actual_winningpool":JSON.parse(getchallengeres[0].actual_winningpool),
                                                                    "entry_fees":getchallengeres[0].entry_fees,
                                                                    "start_date":getchallengeres[0].start_date,
                                                                    "end_date":getchallengeres[0].end_date,
                                                                    "challenge_image_preview":getchallengeres[0].challenge_image,
                                                                    "challenge_image_full":getchallengeres[0].challenge_image_full,
                                                                    "challenge_status":getchallengeres[0].challenge_status,
                                                                    "visible":getchallengeres[0].visible,
                                                                    "iam_join":1
                                                                 }) 
                                                                 
                                                                 next();

                                                            }
                                                        }
                                                    }) // end of getchallengeres  
                                              
                                                }
                                                
                                            }, function (err)
                                            {
                                                if (err)
                                                {
                                                    console.error('Error: ' + err.message);
                                                    return;
                                                }  

                                               res.json({"status":'true',"message":'Complete challenges data!',"data":getcompletedDataChallenges});
                                                
                                            }); //end of asyncLoop

                                           } //end of remchlres.length else block
                                       }
                                  })// end of remchlres query

                              }else{
                                  console.log("333333");
                                      asyncLoop(reverseArray, function (item,next)
                                      {    

                                        if(item!=undefined){
                                            conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id where a.challenge_status = 2 and a.id='"+item+"'",function(err,getchallengeres){
                                                if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else{
                                                    if(getchallengeres.length>0){
                                                         getcompletedDataChallenges.push({
                                                            "challenge_id":getchallengeres[0].id,
                                                            "challenge_name":getchallengeres[0].challenge_name,
                                                            "spots":getchallengeres[0].spots,
                                                            "join_members":getchallengeres[0].join_members,
                                                            "challenge_desc":getchallengeres[0].challenge_desc,
                                                            "challenge_rules":getchallengeres[0].challenge_rules,
                                                            "actual_poolprice":getchallengeres[0].actual_poolprice,
                                                            "actual_winningpool":JSON.parse(getchallengeres[0].actual_winningpool),
                                                            "entry_fees":getchallengeres[0].entry_fees,
                                                            "start_date":getchallengeres[0].start_date,
                                                            "end_date":getchallengeres[0].end_date,
                                                            "challenge_image_preview":getchallengeres[0].challenge_image,
                                                            "challenge_image_full":getchallengeres[0].challenge_image_full,
                                                            "challenge_status":getchallengeres[0].challenge_status,
                                                            "visible":getchallengeres[0].visible,
                                                            "iam_join":1
                                                         }) 
                                                         
                                                         next();

                                                    }
                                                }
                                            }) // end of getchallengeres  
                                      
                                        }
                                        
                                    }, function (err)
                                    {
                                        if (err)
                                        {
                                            console.error('Error: ' + err.message);
                                            return;
                                        }  

                                       res.json({"status":'true',"message":'Complete challenges data!',"data":getcompletedDataChallenges});
                                        
                                    }); //end of asyncLoop
                                 } // end of else of reverseArray.length block
                              
                             }else{
                                 //if no user completed challenge, but completed ones
                                 console.log("2222");
                                 conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.visible,a.challenge_rules,a.challenge_desc,DATE_FORMAT(a.start_date, '%Y-%m-%d') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as end_date,a.challenge_image_full,a.challenge_image,a.entry_fees,b.actual_winningpool,b.actual_poolprice,b.current_winningpool,b.current_poolprice from tb_challenge_leagues as a left join tb_challenge_winningpools as b on b.challenge_id=a.id where a.challenge_status=2 and a.id order by a.id desc limit 10",function(err,remchlresult){
                                     if(err){
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                     }else{
                                         if(remchlresult.length>0){
                                             asyncLoop(remchlresult, function (item, next)
                                                {    
                                                    if(item!=undefined){
                                                        getcompletedDataChallenges.push({
                                                            "challenge_id":item.id,
                                                            "challenge_name":item.challenge_name,
                                                            "spots":item.spots,
                                                            "join_members":item.join_members,
                                                            "challenge_desc":item.challenge_desc,
                                                            "challenge_rules":item.challenge_rules,
                                                            "actual_poolprice":item.actual_poolprice,
                                                            "actual_winningpool":JSON.parse(item.actual_winningpool),
                                                            "entry_fees":item.entry_fees,
                                                            "start_date":item.start_date,
                                                            "end_date":item.end_date,
                                                            "challenge_image_preview":item.challenge_image,
                                                            "challenge_image_full":item.challenge_image_full,
                                                            "challenge_status":item.challenge_status,
                                                            "visible":item.visible,
                                                            "iam_join":0
                                                        })
                                                            
                                                    }
                                                    next();
                                                }, function (err)
                                                {
                                                    if (err)
                                                    {
                                                        console.error('Error: ' + err.message);
                                                        return;
                                                    }
                                                    
                                                     res.json({"status":'true',"message":'Complete challenges data!',"data":getcompletedDataChallenges});
                                                }); //end of inside asyncLoop
                                         }else{
                                             res.json({"status":"false","message":"No challenge has been completed yet!!"})
                                         }
                                     }

                                 });
                             } //end of else of result 
                         } // end of else of query
                     }); // end of result query
                }); //end of getconnection

            } //end of else block
           
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of getcompletechallenge API

//*********************************** */ BELOW ARE THE IOS  blocked API****************************************************//
router.post('/getUpcomingChallengesList', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});
}); //end of getUpcomingChallengesList API

router.post('/joinChallengeSgt', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});
}); //end of joinChallengeSgtagain API

router.post('/completechallenge', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});
}) //end of completechallengeSgt API

router.post('/getactivechallenge', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});  
}) //end of getactivechallenge API

router.post('/challengeLeaderboard', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});
}) //end of challengeLeaderboard API

router.post('/getcompletechallenge', function(req,res,next){
    res.json({"status":"false","message":"please update your app"});
}) // end of getcompletechallenge API

//*********************************** */ ABOVE ARE THE IOS  blocked ****************************************************//


//***************************** get Joined users ***************************************//
router.post('/getjoinedusers', function(req,res,next){
    try{
        var reqObj = req.body; 
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else{
            req.getConnection(function(err, conn){  
                 var query = conn.query("select tblchjoin.userid,tbluser.name,tbluser.profileImg,tbluser.gender from tb_challenge_joins as tblchjoin left join  tb_users as tbluser on tblchjoin.userid = tbluser.id where tblchjoin.upcoming_challenge_id='"+reqObj.challenge_id+"'", function (err, result){
                        if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                        } else {
                            if(result.length>0){
                                  challengesModel.joinedusers(result,reqObj.userid,function(filterdData){
                                      conn.query("select actual_winningpool,actual_poolprice from tb_challenge_winningpools where challenge_id='"+reqObj.challenge_id+"'",function(err,poolresult){
                                          if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else{
                                                if(poolresult.length>0){
                                                    res.json({"status":'true',"message":'joined user list',"percentage_text":"If total no. of participants will be less than 50, then the winning prize will be different based on total joined participants.","data":filterdData,"actual_poolprice":poolresult[0]['actual_poolprice'],"actual_winningpool":JSON.parse(poolresult[0]['actual_winningpool'])});
                                                }
                                            }
                                      }); //end of poolresult query
                                    
                                }); // end of filterdData function
                            }else{
                                 res.json({"status":'false',"message":'No users found for this challenge'});
                            }        
                        }
                    }); //end of query
                }); //end of getconnection
            }  
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of getjoinedusers API

//******************************* to start survey *********************************************//

router.post('/startchallenge', function(req,res,next){
    try{
        var reqObj = req.body; 
            if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                  console.log("starttttt");
                 var query = conn.query("select id as challenge_id,tbchlg.spots,tbchlg.join_members,tbchlg.min_member_to_start,tbchlg.challenge_status,tbchlg.start_date,tbchlg.end_date from tb_challenge_leagues as tbchlg where tbchlg.id='"+reqObj.challenge_id+"'", function (err,challengeresult){
                        if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                        } else {
                            if(challengeresult.length>0){
                                if(challengeresult[0]['challenge_status']===0){
                                    if(challengeresult[0]['join_members']>=challengeresult[0]['min_member_to_start'])
                                    {
                                        conn.query("select userid from tb_challenge_joins where upcoming_challenge_id='"+challengeresult[0]['challenge_id']+"'",function(err,checkjoinres){
                                            if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else
                                            {
                                                if(checkjoinres.length>0){
                                                    conn.query("update tb_challenge_leagues as a left join tb_challenge_joins as b on b.upcoming_challenge_id=a.id set a.challenge_status=1, b.challenge_id=b.upcoming_challenge_id,b.upcoming_challenge_id=0 where a.id='"+challengeresult[0]['challenge_id']+"' and b.upcoming_challenge_id='"+challengeresult[0]['challenge_id']+"'",function(err,statusresult){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else
                                                        {
                                                            asyncLoop(checkjoinres, function (item, next)
                                                            {
                                                                
                                                                conn.query("insert into tb_challengepoints(userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points) values('"+item.userid+"','"+reqObj.challenge_id+"',0,0,0,0)",function(err,insertres){
                                                                    if(err){
                                                                        console.error('SQL error: ', err);
                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                    }else{
                                                                        next();
                                                                    }
                                                                    
                                                                })
                                                               
                                                                
                                                            }, function (err)
                                                            {
                                                                if (err)
                                                                {
                                                                    console.error('Error: ' + err.message);
                                                                    return;
                                                                }
                                                                res.json({"status":'true',"message":'Challenge has been started!'});
                                                             
                                                            });
                                                            
                                                            
                                                        }

                                                    }) // end of statusresult query
                                                }else{
                                                    conn.query("update tb_challenge_leagues set challenge_status=1 where id='"+challengeresult[0]['challenge_id']+"'",function(err,updatestatus){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else
                                                        {
                                                           res.json({"status":'true',"message":'Challenge has been started2!'});  
                                                        }
                                                    }) //end of updatestatus query
                                                }
                                                
                                            }
                                        }) // end of checkjoinres
                                        
                                    }else{
                                        res.json({"status":'false',"message":'Challenge has expired due to less mumber of joiners!'});
                                    }
                                }else if(challengeresult[0].challenge_status===1){
                                    res.json({"status":'false',"message":'Challenge has been started. Please try to join another challenge!'});
                                }else{
                                    res.json({"status":'false',"message":'Challenge has expired!'});

                                }
                            }
                        }
                    }); //end of query
                }); //end of getconnection 

            } //end of else block
        
            
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of startchallenge API

//******************************* get leaderBoardofCompletechallenge data ************************//
router.post('/getcompletechallengeboard', function(req,res,next){
    try{
        var reqObj = req.body;
            if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select p.userid,p.challenge_id,c.name,c.gender,c.profileImg,IFNULL(p.step_points,0) as step_points,IFNULL(p.bonus_points,0) as bonus_points,IFNULL(p.outdoor_points,0) as outdoor_points,IFNULL(p.total_challenge_points,0) as total_challenge_points,rank() over (order by p.total_challenge_points desc)rank  from tb_allchallengepoints as p left join tb_challenge_joins as b on b.userid=p.userid left join tb_users as c on c.id=p.userid  where p.challenge_id='"+reqObj.challenge_id+"' and find_in_set('"+reqObj.challenge_id+"',completed_challenge_id)>0 ORDER BY p.total_challenge_points DESC",function(err,result){
                         if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                         }else{
                             if(result.length>0){
                                 conn.query("select current_winningpool,current_poolprice from tb_challenge_winningpools where challenge_id='"+reqObj.challenge_id+"'",function(err,poolresult){
                                     if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                    }else{
                                        if(poolresult.length>0){
                                           challengesModel.getuserdatawithwinningamt(result,poolresult,reqObj.userid,function(filterdData){
                                               res.json({"status":'true',"message":'pooldata',"data":filterdData,"current_poolprice":poolresult[0]['current_poolprice'],"current_winningpool":JSON.parse(poolresult[0]['current_winningpool'])});
                                           });

                                        }else{
                                            res.json({"status":'false',"message":'Something went wrong!'});
                                        }
                                    }

                                 })
                                 
                             }else{
                                 res.json({"status":'false',"message":'No challenge is active for now'});
                             }
                         }
                     }); // end of result query
                }); //end of getconnection

            } //end of else block   
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of getcompletechallenge API

//****************** update dummy users point **************************//
router.post('/MCTuserschallengePoints', function(req,res,next){
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
            }else{
                var total_challenge_points = parseInt(reqObj.points)+parseInt(reqObj.bonus_point)+parseInt(reqObj.outdoor_point);
                req.getConnection(function(err, conn){  
                    console.log("update tb_challengepoints set step_points=step_points+'"+parseInt(reqObj.points)+"',bonus_points=bonus_points+'"+parseInt(reqObj.bonus_point)+"',outdoor_points=outdoor_points+'"+parseInt(reqObj.outdoor_point)+"',total_challenge_points=total_challenge_points+'"+total_challenge_points+"' where userid='"+reqObj.userid+"'");
                     var query = conn.query("update tb_challengepoints set step_points=step_points+'"+reqObj.points+"',bonus_points=bonus_points+'"+reqObj.bonus_point+"',outdoor_points=outdoor_points+'"+reqObj.outdoor_point+"',total_challenge_points=total_challenge_points+'"+total_challenge_points+"' where userid='"+reqObj.userid+"'",function(err,result){
                         if(err){
                            res.json({"status":'false',"message":'Something went wrong!'});
                          }else{
                              res.json({"status":'true',"message":'Updated challenge points!'});
                          }
                     }) //end of query
                }); //end of getconnection

            } //end of else block   
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of MCTuserschallengePoints API

//****************** update dummy users join **************************//
router.post('/MCTuserschallengeJoin', function(req,res,next){
    try{
        var reqObj = req.body;
            if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select userid from tb_challenge_joins where userid='"+reqObj.userid+"' and upcoming_challenge_id='"+reqObj.challenge_id+"'",function(err,result){
                          if(err){
                            res.json({"status":'false',"message":'Something went wrong!'});
                          }else{
                              if(result.length>0){
                                res.json({"status":'false',"message":'You have already joined this challenge!'});
                              }else{
                                  conn.query("insert into tb_challenge_joins(userid,upcoming_challenge_id) values('"+reqObj.userid+"','"+reqObj.challenge_id+"')",function(err,joinedres){
                                          if(err){
                                            res.json({"status":'false',"message":'Something went wrong!'});
                                          }else{
                                              conn.query("update tb_challenge_leagues set join_members=join_members+1,spots=spots-1 where id='"+reqObj.challenge_id+"'",function(err,upres){
                                                  if(err){
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                  }else{
                                                      res.json({"status":'true',"message":'Joined!!'});
                                                  }
                                              })
                                          }
                                      })

                              }
                          }
                     }) //end of query
                }); //end of getconnection

            } //end of else block   
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of MCTuserschallengeJoin API


//****************************** end of OLD challenges API ******************************//


// ***************************** challenges new API module with multiple join ***************************//
//******************************** get upcoming challenges updated on 4 oct **************************//
router.post('/getUpcomingChallengesListnew', function(req,res,next){
    try{
    var reqObj = req.body; 
    if(reqObj.userid==undefined || reqObj.userid==''){
        res.json({"status":'false',"message":'Request parameter is missing'});
        return false;
    }       
    req.getConnection(function(err, conn){  
         var query = conn.query("select b.userid,a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d %H:%i:%s') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d %H:%i:%s') as end_date,DATE_FORMAT(a.start_date, '%Y-%m-%d') as nstart_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as nend_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id left join tb_challenge_joins as b on a.id=b.upcoming_challenge_id and b.userid ='"+reqObj.userid+"' where a.challenge_status = 0", function (err, result){
                if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"message":'Something went wrong!'});
                } else {
                    if(result.length>0){
                        // console.log("28 AUG",result)
                            challengesModel.challangeCheckJoinNew(result,reqObj.userid,function(filterdData){
                                res.json({"status":'true',"message":'challenges list',"data":filterdData});
                         });
                          
                    }else{
                        res.json({"status":'false',"message":'No challenges found!'});
                    }        
                }
            });
        });

        }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of getUpcomingChallengesList API


router.post('/getUpcomingChallengesListnewtest', function(req,res,next){
    try{
    var reqObj = req.body; 
    if(reqObj.userid==undefined || reqObj.userid==''){
        res.json({"status":'false',"message":'Request parameter is missing'});
        return false;
    }       
    req.getConnection(function(err, conn){  
         var query = conn.query("select b.userid,a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d %H:%i:%s') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d %H:%i:%s') as end_date,DATE_FORMAT(a.start_date, '%Y-%m-%d') as nstart_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as nend_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues_test as a left join tb_challenge_winningpools as p on p.challenge_id = a.id left join tb_challenge_joins as b on a.id=b.upcoming_challenge_id and b.userid ='"+reqObj.userid+"' where a.challenge_status = 0", function (err, result){
                if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"message":'Something went wrong!'});
                } else {
                    if(result.length>0){
                        // console.log("28 AUG",result)
                            challengesModel.challangeCheckJoinNew(result,reqObj.userid,function(filterdData){
                                res.json({"status":'true',"message":'challenges list',"data":filterdData});
                         });
                          
                    }else{
                        res.json({"status":'false',"message":'No challenges found!'});
                    }        
                }
            });
        });

        }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of getUpcomingChallengesList API

//****************************** join Challenge API on 4 OCT *****************************//
router.post('/joinChallengeSgtnew', function(req,res,next){
    console.log("11111");
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.payout==undefined || reqObj.payout==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }
        else{
            req.getConnection(function(err, conn){  
                 var query = conn.query("SELECT tblchl.id as challenge_id,tblchl.challenge_name,tblchl.spots,tblchl.join_members,tblchl.entry_fees,tblchl.challenge_status from tb_challenge_leagues as tblchl where tblchl.id='"+reqObj.challenge_id+"' limit 1", function (err,result){
                        if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                        }else{
                            if(result.length>0){
                                if(result[0].challenge_status===0){
                                    if(result[0].spots!=0){
                                        conn.query("select b.userid,b.challenge_id,b.upcoming_challenge_id,a.challenge_status from tb_challenge_joins as b left join tb_challenge_leagues as a on b.upcoming_challenge_id=a.id where b.userid='"+reqObj.userid+"' and b.upcoming_challenge_id='"+reqObj.challenge_id+"'",function(err,alreadyJoinresult){
                                            if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong!'});
                                            }else{
                                                if(alreadyJoinresult.length>0){
                                                    if(alreadyJoinresult[0].challenge_status===0 && alreadyJoinresult[0].upcoming_challenge_id===parseInt(reqObj.challenge_id)){
                                                        res.json({"status":'false',"message":'you have already joined the challenge!'});
                                                    }else if(alreadyJoinresult[0].challenge_status===1 && alreadyJoinresult[0].upcoming_challenge_id!=0){
                                                        res.json({"status":'false',"data":'',"message":'you have alreay joined the upcoming challenge!'});
                                                    }else{
                                                        conn.query("SELECT amount as useramount,userid from tb_challenge_wallet where userid='"+reqObj.userid+"'",function(err,walletamtupresult){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else{
                                                            if(walletamtupresult.length>0){
                                                                if(walletamtupresult[0].useramount>=result[0].entry_fees){
                                
                                                                    conn.query("UPDATE tb_challenge_wallet SET amount=('"+walletamtupresult[0].useramount+"'-'"+result[0].entry_fees+"') where userid='"+reqObj.userid+"'",function(err,deductusrupamt){             
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            if(deductusrupamt.affectedRows===1){
                                                                                conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+reqObj.challenge_id+"", function (err,updatespotsupresult){
                                                                                    if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                                    }else{
                                                                                        if(updatespotsupresult.affectedRows===1){
                                                                                            conn.query("insert into tb_challenge_joins (upcoming_challenge_id,userid) values("+reqObj.challenge_id+","+reqObj.userid+")", function (err, insertjoinedusrResult){
                                                                                                    if(err){
                                                                                                        console.error('SQL error: ', err);
                                                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                                                    }else{
                                                                                                        if(insertjoinedusrResult.insertId!=0){
                                                                                                            res.json({"status":"true","data":'',"message":'Congratulations you have successfully joined the challenge.'});
                                                                                                        }
                                                                                                    }
                                                                                                }); // end of insertjoinedusrResult 
                                                                                        }
                                                                                    }//end of updatespotsupresult else

                                                                                });// end of updatespotsupresult query 
                                                                            } //end of deductusrupamt.affectedRows check
                                                                        } //end of else inside deduct query
                                                                    }); // end of query deductusrupamt result 
                                                                   

                                                                }else{
                                                                    console.log("22222222")
                                                                    jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                        var remaining = result[0].entry_fees - walletamtupresult[0].useramount
																		var orderId =shortid.generate();
																		var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																			console.log(intiatepay,"intiatepay")
																			if(err){
																			res.json({"status":"false","msg":"not inserted"})	
																			}
																			if(intiatepay.affectedRows===1){
																				res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																			}
																			
																		});
                                                                        
                                                                    })
                                                                }// end of walletamtupresult amount check 

                                                            }else{
                                                                //  res.json({"status":'false',"data":"","message":'Please add amount to your wallet!',"token":"","redirecturl":""});
                                                                 jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                    var remaining = result[0].entry_fees;
                                                                    var orderId =shortid.generate();
																	var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																		console.log(intiatepay,"intiatepay")
																		if(err){
																		res.json({"status":"false","msg":"not inserted"})	
																		}
																		if(intiatepay.affectedRows===1){
																			res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																		}
																		
																	});
                                                                })
                                                            } // end of walletamtupresult.length block
                                                        } //end of query else

                                                    }); //end of walletamtupresult query

                                                  } //else for upcoming challenge join
                                                    
                                                    
                                                }else{
                                                    conn.query("SELECT amount as useramount,userid from tb_challenge_wallet where userid='"+reqObj.userid+"'",function(err,walletamtresult){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                        }else{
                                                            if(walletamtresult.length>0){
                                                                if(walletamtresult[0].useramount>=result[0].entry_fees){
                                
                                                                    conn.query("UPDATE tb_challenge_wallet SET amount=('"+walletamtresult[0].useramount+"'-'"+result[0].entry_fees+"') where userid='"+reqObj.userid+"'",function(err,deductusramt){             
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            if(deductusramt.affectedRows===1){
                                                                                conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+reqObj.challenge_id+"", function (err,updatespotsresult){
                                                                                    if(err){
                                                                                        console.error('SQL error: ', err);
                                                                                        res.json({"status":'false',"message":'Something went wrong!'});
                                                                                    }else{
                                                                                        if(updatespotsresult.affectedRows===1){
                                                                                            conn.query("insert into tb_challenge_joins (upcoming_challenge_id,userid) values("+reqObj.challenge_id+","+reqObj.userid+")", function (err, insertjoinedusrResult){
                                                                                                if(err){
                                                                                                    console.error('SQL error: ', err);
                                                                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                                                                }else{
                                                                                                    if(insertjoinedusrResult.insertId!=0){
                                                                                                        res.json({"status":"true","data":'',"message":'Congratulations you have successfully joined the challenge.'});
                                                                                                    }
                                                                                                }
                                                                                            }); // end of insertjoinedusrResult 
                                                                                        }
                                                                                    }//end of updatespotsresult else

                                                                                });// end of updatespotsresult query 
                                                                            } //end of deductusramt.affectedRows check
                                                                        } //end of else inside deduct query
                                                                    }); // end of query deductusramt result 
                                                                   

                                                                }else{
                                                                    console.log("5555555");
                                                                    jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                        var remaining = result[0].entry_fees - walletamtresult[0].useramount
                                                                        var orderId =shortid.generate();
																		var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																			console.log(intiatepay,"intiatepay")
																			if(err){
																			res.json({"status":"false","msg":"not inserted"})	
																			}
																			if(intiatepay.affectedRows===1){
																				res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																			}
																			
																		});
                                                                    })
                                                                }// end of walletamtresult amount check

                                                            }else{
                                                                // res.json({"status":'false',"data":"","message":'Please add amount to your wallet!',"token":"","redirecturl":""});
                                                                jsonwebtoken.jwtSign(req.body,(token)=>{
                                                                    var remaining = result[0].entry_fees;
                                                                    var orderId =shortid.generate();
																	var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+remaining+"','"+reqObj.userid+"')",function(err,intiatepay){
																		console.log(intiatepay,"intiatepay")
																		if(err){
																		res.json({"status":"false","msg":"not inserted"})	
																		}
																		if(intiatepay.affectedRows===1){
																			res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+remaining+"&action=paytmPayment&orderId="+orderId+"","message":'Please add money to your wallet!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
																		}
																		
																	});
                                                               })
                                                                
                                                            } // end of walletamtresult.length block
                                                        } //end of query else

                                                    }); //end of walletamtresult query

                                                } // end of alreadyJoinresult.length else
                                            } // end of else inside query block
                                        }); // end of query inside spots block

                                    }else{
                                         res.json({"status":'false',"data":'',"message":'Challenge has been full. Please try to join another challenge!'});
                                    }// end of spots check block
                                }else if(result[0].challenge_status===1){

                                    res.json({"status":'false',"data":'',"message":'Challenge has been started. Please try to join another challenge!'});
                                }else{
                                    console.log("if===== 30 AUg");

                                    res.json({"status":'false',"data":'',"message":'Challenge has expired!'});

                                } // end of else with challenge_status block
                               
                            }else{
                                res.json({"status":'false',"data":'',"message":'Challenge is not available!'});
                            }
                        } // end of else block inside query
                 }); //end of first query block
            }); //end of getConnection block
        } //end of first else block inside try block      
        
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of joinChallengeSgtagain API

//****************************** on LIVE join Challenge API on 4 OCT *****************************//


router.post('/joinChallengeSgtnew2', function(req,res,next){
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.payout==undefined || reqObj.payout==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }
        else{
            req.getConnection(function(err, conn){  
                conn.query("select * from tb_challenge_joins where upcoming_challenge_id='"+reqObj.challenge_id+"' and userid='"+reqObj.userid+"'",function(err,alreadyJoinresult){
                    if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!'});
                    }else{
                        if(alreadyJoinresult.length>0){
                            res.json({"status":'false',"message":'you have already joined the challenge!'});
                        }else{
                            conn.query("select spots from tb_challenge_leagues where id = '"+reqObj.challenge_id+"'",function(err,alreadyfullspot){
                                if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong!'});
                                }else{
                                    if(alreadyfullspot[0].spots===0){
                                        res.json({"status":'false',"message":'Spots has been full. Please try to join another challenge!'});
                                    }else{
                                        jsonwebtoken.jwtSign(req.body,(token)=>{
                                            var orderId =shortid.generate();
                                            var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid,challenge_id) VALUES('"+orderId+"','"+token+"','"+reqObj.payout+"','"+reqObj.userid+"','"+reqObj.challenge_id+"')",function(err,intiatepay){
                                                console.log(intiatepay,"intiatepay")
                                                if(err){
                                                res.json({"status":"false","msg":"not inserted"})    
                                                }
                                                if(intiatepay.affectedRows===1){
                                                    res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+reqObj.payout+"&action=paytmPaymentNew&orderId="+orderId+"","message":'Please pay via payTm to join challenge!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponsenew","token":token});
                                                }
                                                
                                            });
                                        })

                                    }
                                }

                            }) //alreadyfullspot loop
                        }
                    }
                });
                
            }); //end of getConnection block
        } //end of first else block inside try block      
        
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of joinChallengeSgtagain API


// ******************************* check joined user on 10OCt***********************************//
router.post('/checkuserjoinedchallenge', function(req,res,next){
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }
        else{
            req.getConnection(function(err, conn){  
                var query = conn.query("select * from tb_challenge_joins where userid='"+reqObj.userid+"' and upcoming_challenge_id='"+reqObj.challenge_id+"'",function(err,getjoineduser){
                    if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!'});
                     }else{
                         if(getjoineduser.length>0){
                            res.json({"status":"true","data":'',"message":'Congratulations you have successfully joined the challenge.'});
                         }else{
                            res.json({"status":"false","data":'',"message":'You have not joined this challenge!'});
                         }
                     }
                })
            }); //end of getConnection block
        } //end of first else block inside try block      
        
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of joinChallengeSgtagain API

// update on 4 october
router.post('/getactivechallengenew', function(req,res,next){
    try{
        var reqObj = req.body; 
            if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select b.userid,a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d %H:%i:%s') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d %H:%i:%s') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id left join tb_challenge_joins as b on a.id=b.challenge_id and b.userid = '"+reqObj.userid+"' where a.challenge_status = '1'",function(err,result){
                         if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                         }else{
                             if(result.length>0){
                                 challengesModel.challangeCheckJoin1(result,reqObj.userid,function(filterdData){
                                    res.json({"status":'true',"message":'Active challenge data',"data":filterdData});
                                 }); // end of filteredData block
                                
  
                             }else{
                                 res.json({"status":'false',"message":'No challenge is active for now'});
                             }
                         }
                     }); // end of result query
                }); //end of getconnection

            } //end of else block
           
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of getactivechallenge API

// ***************************** get leaderboard challenge ***************************//
router.post('/challengeLeaderboardnew', function(req,res,next){
    try{
        var reqObj = req.body; 
        console.log(reqObj);
            if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select b.userid,c.name,c.gender,c.profileImg,IFNULL(p.step_points,0) as step_points,IFNULL(p.bonus_points,0) as bonus_points,IFNULL(p.outdoor_points,0) as outdoor_points,IFNULL(p.total_challenge_points,0) as total_challenge_points,rank() over (order by p.total_challenge_points desc)rank from tb_challengepoints as p left join tb_challenge_joins as b on p.userid=b.userid left join tb_users as c on b.userid=c.id where p.challenge_id='"+reqObj.challenge_id+"' and b.challenge_id='"+reqObj.challenge_id+"' ORDER BY p.total_challenge_points DESC",function(err,result){
                         if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                         }else{
                            if(result.length>0){
                                conn.query("select DATE_FORMAT(b.end_date, '%Y-%m-%d %H:%i:%s') as end_date,a.actual_winningpool,a.actual_poolprice,a.current_winningpool,a.current_poolprice from tb_challenge_winningpools as a left join tb_challenge_leagues as b on a.challenge_id=b.id where a.challenge_id='"+reqObj.challenge_id+"'",function(err,poolresult){
                                  if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                    }else{
                                        if(poolresult.length>0){
                                            challengesModel.getuserdatawithrank(result,reqObj.userid,function(filterdData){
                                                res.json({"status":'true',"message":'joined user list',"challengeLeaderboardMsg": "Challenge will be ends on "+poolresult[0].end_date,"userdata":filterdData,"data":result,"current_poolprice":poolresult[0]['current_poolprice'],"current_winningpool":JSON.parse(poolresult[0]['current_winningpool'])});
                                             }); // end of filteredData block
                                            
                                        }
                                    }
                                }); //end of poolresult query

                            }else{
                              res.json({"status":"true","message":"No leaderboard!"})
                            }

                        } //end of else block

                     })// end of result query
                }); //end of getconnection

            } //end of else block
           
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of challengeLeaderboard API

//last update on 04 october
router.post('/completechallengenew', function(req,res,next){
    try{
        var reqObj = req.body; 
            if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){ 

                    function checkuserinchallenge(){
                       return new Promise(function(resolve,reject) {
                           var query = conn.query("select a.id as challenge_id from tb_challenge_leagues as a where a.id='"+reqObj.challenge_id+"' and a.challenge_status=1",function(err,challengeresult){
                               if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong1!'});
                                }else{
                                    if(challengeresult.length>0){
                                        conn.query("select userid from tb_challenge_joins where challenge_id='"+reqObj.challenge_id+"'",function(err,checkjoinres){
                                            if(err){
                                                console.error('SQL error: ', err);
                                                res.json({"status":'false',"message":'Something went wrong2!'});
                                            }else{
                                                if(checkjoinres.length>0){
                                                  conn.query("update tb_challenge_joins as a left join tb_challenge_leagues as b on a.challenge_id=b.id set a.completed_challenge_id=a.challenge_id,a.challenge_id=0, b.challenge_status=2 where a.challenge_id ='"+reqObj.challenge_id+"'",function(err,finalres){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong3!'});
                                                        }else{
                                                            conn.query("insert into tb_allchallengepoints (userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at,updated_at) select userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at,updated_at from tb_challengepoints where challenge_id='"+reqObj.challenge_id+"'",function(err,shifttosectable){
                                                                if(err){
                                                                    console.error('SQL error: ', err);
                                                                    res.json({"status":'false',"message":'Something went wrong4!'});
                                                                }else{
                                                                    // res.json({"status":'true',"message":'Challenge has been completed!'});
                                                                    resolve(true);
                                                                }
                                                            })// end of shifttosectable query block
         
                                                        }
                                                    }); //end of finalres
                                                }else{
                                                    conn.query("update tb_challenge_leagues set challenge_status=2 where id='"+reqObj.challenge_id+"'",function(err,updatestatus){
                                                        if(err){
                                                            console.error('SQL error: ', err);
                                                            res.json({"status":'false',"message":'Something went wrong5!'});
                                                        }else
                                                        {
                                                           res.json({"status":'true',"message":'Challenge has been completed2!'});  
                                                        }
                                                    }) //end of updatestatus query
                                                }
                                            }
                                        }); //end of checkjoinres
                                        
                                    }else{
                                        res.json({"status":'false',"message":'Challenge either completed or cancelled!'});

                                    }
                                }
                           });
                           
                       }); //end of promise
                    } //end of checkuserinchallenge function definition

                    function getcompletedata(){
                       return new Promise(function(resolve,reject) {
                           var query = conn.query("select p.userid,p.challenge_id,c.name,c.gender,c.profileImg,IFNULL(p.step_points,0) as step_points,IFNULL(p.bonus_points,0) as bonus_points,IFNULL(p.outdoor_points,0) as outdoor_points,IFNULL(p.total_challenge_points,0) as total_challenge_points,rank() over (order by p.total_challenge_points desc)rank  from tb_allchallengepoints as p left join tb_challenge_joins as b on b.userid=p.userid left join tb_users as c on c.id=p.userid  where p.challenge_id='"+reqObj.challenge_id+"' and find_in_set('"+reqObj.challenge_id+"',completed_challenge_id)>0 ORDER BY p.total_challenge_points DESC",function(err,result){
                               if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong6!'});
                                }else{
                                    if(result.length>0){
                                        resolve(result);
                                    }else{
                                        res.json({"status":"false","message":"No data found for this challenge"});
                                    }
                                }
                           });
                           
                       }); //end of promise
                    } //end of getcompletedata function definition

                    function getfinaluserRank(data){
                        // console.log(data);
                       return new Promise(function(resolve,reject) {
                           conn.query("select current_winningpool,current_poolprice from tb_challenge_winningpools where challenge_id='"+reqObj.challenge_id+"'",function(err,poolresult){
                                     if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong7!'});
                                    }else{
                                        if(poolresult.length>0){
                                            challengesModel.getuserdatawithwinningamtstg(data,poolresult,conn,function(filterdData){
                                                if(filterdData.length>0){
                                                    resolve(filterdData); 
                                                }else{
                                                    resolve(true); 
                                                }
                                                       
                                         });

                                        }else{
                                            res.json({"status":'false',"message":'Something went wrong8!'});
                                        }
                                    }

                                 })
                           
                       }); //end of promise
                    } //end of getfinaluserRank function definition

                    function distributePrice(data){
                        // console.log(data)

                       return new Promise(function(resolve,reject) {
                           if(data===true){
                               resolve(true);
                           }else{
                               asyncLoop(data, function (item, next)
                                {
                                    conn.query("SELECT userid FROM tb_challenge_wallet where userid = '"+item.userid+"'", function(err, useridcheck){
                                         if(err){
                                            res.json({"status":'false',"msg":'Something went wrong9!'});
                                         }
                                         else{
                                             if(useridcheck.length>0){
                                                 conn.query("update tb_challenge_wallet set amount=amount+'"+item.price+"' where userid='"+item.userid+"'",function(err,upresult){
                                                     if(err){
                                                         console.log(err);
                                                        res.json({"status":'false',"msg":'Something went wrong12!'});
                                                     }else{
                                                         conn.query("insert into tb_wallet(userid,amount) values('"+item.userid+"','"+item.price+"')",function(err,inresult2){
                                                             if(err){
                                                                 console.log(err);
                                                                res.json({"status":'false',"msg":'Something went wrong13!'});
                                                             }else{
                                                                 next();  
                                                             }
                                                         })
                                                        
                                                     }
                                                 })
                                                 
                                             }else{
                                                 conn.query("insert into tb_challenge_wallet(userid,amount) values('"+item.userid+"','"+item.price+"')",function(err,inresult){
                                                     if(err){
                                                         console.log(err);
                                                        res.json({"status":'false',"msg":'Something went wrong10!'});

                                                     }else{
                                                         conn.query("insert into tb_wallet(userid,amount) values('"+item.userid+"','"+item.price+"')",function(err,inresult2){
                                                             if(err){
                                                                 console.log(err);
                                                                res.json({"status":'false',"msg":'Something went wrong11!'});
                                                             }else{
                                                                 next();
                                                                
                                                             }
                                                         })
                                                     }
                                                 })
                                                 
                                             }
                                             
                                         }//else end challenge

                                     });//check userid tb_challange table end
                                    
                                }, function (err)
                                {
                                    if (err)
                                    {
                                        console.error('Error: ' + err.message);
                                        return;
                                    }
                                    console.log("userdata 23 SEPT",data);
                                    resolve(true);

                                }); //end of asyncLoop
                           }//end of first else 
                           
                       }); //end of promise
                    } //end of distributePrice function definition

                    checkuserinchallenge().then(function(check){
                        if(check==true){
                            getcompletedata().then(function(data){
                                getfinaluserRank(data).then(function(userrank){
                                    distributePrice(userrank).then(function(status){
                                        if(status==true){
                                            res.json({"status":"true","message":"Challenge has been completed!"});
                                        }
                                    }) //end of distributePrice
                                }) //end of getfinaluserRank
                            }) // end of getcompletedata
                        }
                        
                    }) //end of checkuserinchallenge
                    
                }); //end of getconnection 
            } //end of else block   
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of completechallengeSgt API

// update on 04 october
router.post('/getcompletechallengenew', function(req,res,next){
    try{
        var reqObj = req.body;
        var getcompletedDataChallenges=[]; 
            if(reqObj.userid==undefined || reqObj.userid==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                     var query = conn.query("select completed_challenge_id from tb_challenge_joins where userid='"+reqObj.userid+"' order by id desc",function(err,result){
                         if(err){
                            console.error('SQL error: ', err);
                            res.json({"status":'false',"message":'Something went wrong!'});
                         }else{
                             if(result.length>0){
                                 asyncLoop(result,function(item,next){
                                     if(item!=undefined){
                                         if(item.completed_challenge_id!=0){
                                             conn.query("select a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d %H:%i:%s') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d %H:%i:%s') as end_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id where a.challenge_status = 2 and a.id='"+item.completed_challenge_id+"'",function(err,getchallengeres){
                                                 if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                 }else{
                                                     if(getchallengeres.length>0){
                                                         getcompletedDataChallenges.push({
                                                            "challenge_id":getchallengeres[0].id,
                                                            "challenge_name":getchallengeres[0].challenge_name,
                                                            "spots":getchallengeres[0].spots,
                                                            "join_members":getchallengeres[0].join_members,
                                                            "challenge_desc":getchallengeres[0].challenge_desc,
                                                            "challenge_rules":getchallengeres[0].challenge_rules,
                                                            "actual_poolprice":getchallengeres[0].actual_poolprice,
                                                            "actual_winningpool":JSON.parse(getchallengeres[0].actual_winningpool),
                                                            "entry_fees":getchallengeres[0].entry_fees,
                                                            "start_date":getchallengeres[0].start_date,
                                                            "end_date":getchallengeres[0].end_date,
                                                            "challenge_image_preview":getchallengeres[0].challenge_image,
                                                            "challenge_image_full":getchallengeres[0].challenge_image_full,
                                                            "challenge_status":getchallengeres[0].challenge_status,
                                                            "visible":getchallengeres[0].visible,
                                                            "iam_join":1
                                                         }) 
                                                         next();

                                                     }else
                                                     {
                                                         next();
                                                     }
                                                 }
                                             })//end of completeresult query
                                             
                                         }else{
                                             next();
                                         }
                                     }

                                 },function(err){
                                     if (err)
                                    {
                                        console.error('Error: ' + err.message);
                                        return;
                                    }
                                    res.json({"status":'true',"message":'Complete challenges data!',"data":getcompletedDataChallenges});
                                 }) //end of asyncLoop

                             }else{
                                 res.json({"status":'false',"message":'No challenge has been completed yet!!'});
                             } //end of result.length else
                             
                         } // end of else of query
                     }); // end of result query
                }); //end of getconnection

            } //end of else block
           
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of getcompletechallenge API

router.post('/truncatechallengepointstable', function(req,res,next){
    try{
            req.getConnection(function(err, conn){  
                var query = conn.query("insert into tb_challengepoints_backup (userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at,updated_at)select userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points,created_at,updated_at from tb_challengepoints",function(err,result){
                    if(err){
                        res.json({"status":'false',"message":'Something went wrong1!'});
                    }else{
                        conn.query("truncate table tb_challengepoints",function(err,truncateres){
                            if(err){
                                res.json({"status":'false',"message":'Something went wrong2!'});
                            }else{
                                res.json({"status":'true',"message":'You have done a great job!! Reset & Successfully took a backup!!'});
                            }
                        })
                    }
                })
            }); //end of getconnection   
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) // end of truncatechallengepointstable API



const verifyTokenIsUndefined=(req,res,next)=>{
    const bearerHeader=req.headers["authorization"];
    if(typeof bearerHeader !=='undefined'){
        const bearer=bearerHeader.split(' ');
        const bearerToken=bearer[1];
        req.token=bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

const verifyToken=(req,res,next)=>{
    jsonwebtoken.jwtVerify(req.token,(verifiedToken)=>{
        if(verifiedToken!==false){
           res.authData=verifiedToken;
           next(); 
       } else {
           res.sendStatus(403);
       }
   })
}
//verifyTokenIsUndefined,verifyToken,

router.post("/paywithpaytm",verifyTokenIsUndefined,verifyToken, (req, res) => {
	var reqObj = req.body;
	var orderId =shortid.generate();
	token =req.token
	//var token ="abc"
	req.getConnection(function(err,conn){
                if(err){
                    console.log("token inserted")
                    res.json({"status": "false", "msg": "Somthing wnet wrong"})
						}
	var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid) VALUES('"+orderId+"','"+token+"','"+reqObj.amount+"','"+reqObj.userid+"')",function(err,intiatepay){
	console.log(intiatepay,"intiatepay")
	if(err){
	res.json({"status":"false","msg":"not inserted"})	
	}
	else{
		
		res.json({
			"status":"true",
			"msg":"please procced for paytm payment",
			"paytmFinalUrl":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+reqObj.amount+"&action=paytmPayment&userid="+reqObj.userid+"&orderId="+orderId+""
			
			})
	}
	})					
	})
	

    
  });


router.post("/paywithpaytmresponseprev", (req, res) => {
    var reqObj = req.body;
    console.log("*******************************")
    console.log(reqObj);
    console.log("*******************************")
    req.getConnection(function(err,conn){
        if(err){
            console.log("one1")
            res.json({"status": "false", "msg": "Somthing wnet wrong"})
        }
        else{
                if(reqObj.STATUS != 'TXN_FAILURE'){
                    var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=1,jwt_token='' where ORDERID='"+reqObj.ORDERID+"'",function(err,pay){
                        if(err){
                            res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                        }
                        else{
                            if(pay.affectedRows===1){
                                conn.query("select a.userid,b.amount from tb_paytm as a left join tb_challenge_wallet as b on a.userid=b.userid where ORDERID='"+reqObj.ORDERID+"'",function(err,userres){
                                    if(err){
                                        res.json({"status": "false", "msg": "Somthing wnet wrong4"})
                                    }else{
                                        console.log("112234",userres);
                                        console.log("112234",userres[0].userid);
                                        console.log("amount",userres[0].amount)
                                        if(userres[0].amount=='null' || userres[0].amount==null){
                                            console.log("inside null");
                                            conn.query("insert into tb_challenge_wallet(userid,amount) values('"+userres[0].userid+"','"+reqObj.TXNAMOUNT+"')",function(err,insertres){
                                                console.log("after query",err);
                                                if(err){
                                                    res.json({"status": "false", "msg": "Somthing wnet wrong5"})
                                                    
                                                }else{
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
                                        }else{
                                            conn.query("update tb_challenge_wallet set amount=amount+'"+reqObj.TXNAMOUNT+"' where userid='"+userres[0].userid+"'",function(err,updateres){
                                                if(err){
                                                    res.json({"status": "false", "msg": "Somthing wnet wrong6"})
    
                                                }else{
                                                    responsePayment(req.body).then(
                                                        success => {
                                                            res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                                                        },
                                                        error => {
                                                            res.send(error);
                                                        }
                                                    );
    
                                                }
                                            });
                                        }    
                                           
                                    } //end of else of useres 
                               }) //end of useres query
                                    
                            }
                        
                        } 
                       // console.log(pay,"update paytm info");
                        
                    })
        } else if(reqObj.STATUS == 'TXN_FAILURE') {
                var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=2 where ORDERID='"+reqObj.ORDERID+"',jwt_token=''",function(err,pay){
                    if(err){
                        res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                    } 
                    console.log(pay,"update paytm info");
                    if(pay.affectedRows===1){
                    // var url = req.url;
                    //  console.log(url);
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



// new callback API for PAytm
router.post("/paywithpaytmresponse", (req, res) => {
    var reqObj = req.body;
    req.getConnection(function(err,conn){
        if(err){
            console.log("one1")
            res.json({"status": "false", "msg": "Somthing wnet wrong"})
        }
        else{
                if(reqObj.STATUS != 'TXN_FAILURE'){
                    var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=1,jwt_token='' where ORDERID='"+reqObj.ORDERID+"'",function(err,pay){
                        if(err){
                            console.log("pay1",pay)
                            res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                        }
                        else{
                            if(pay.affectedRows===1){
                                conn.query("select challenge_id,userid from tb_paytm where ORDERID='"+reqObj.ORDERID+"'",function(err,challengeid){
                                    console.error('challengeid', challengeid);
                                    if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                    }else{
                                        if(challengeid.length>0){
                                            conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+challengeid[0].challenge_id+"", function (err,updatespotsresult){
                                                if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else{
                                                    if(updatespotsresult.affectedRows===1){
                                                        conn.query("insert into tb_challenge_joins (upcoming_challenge_id,userid) values("+challengeid[0].challenge_id+","+challengeid[0].userid+")", function (err, insertjoinedusrResult){
                                                            if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                            }else{
                                                                if(insertjoinedusrResult.insertId!=0){
                                                                    responsePayment(req.body).then(
                                                                        success => {
                                                                            res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                                                                        },
                                                                        error => {
                                                                            res.send(error);
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }); // end of insertjoinedusrResult 
                                                    }
                                                }//end of updatespotsresult else

                                            });// end of updatespotsresult query

                                        }else{
                                            res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                                        }
                                    }
                                })  
                                    
                            }
                        
                        } 
                       // console.log(pay,"update paytm info");
                        
                    })
        } else if(reqObj.STATUS == 'TXN_FAILURE') {
                var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=2 where ORDERID='"+reqObj.ORDERID+"',jwt_token=''",function(err,pay){
                    if(err){
                        res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                    } 
                    console.log(pay,"update paytm info");
                    if(pay.affectedRows===1){
                        responsePayment(req.body).then(
                            success => {
                                res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                            },
                            error => {
                                res.send(error);
                            }
                        );
                        
                    }else{
                        res.json({"status": "false", "msg": "Somthing wnet wrong"})
                    }
                })
                                    }
        }
      
    });
});

// For Live testing on 4th November 2019 //
router.post('/getUpcomingChallengesListnew5', function(req,res,next){
    try{
    var reqObj = req.body; 
    if(reqObj.userid==undefined || reqObj.userid==''){
        res.json({"status":'false',"message":'Request parameter is missing'});
        return false;
    }       
    req.getConnection(function(err, conn){  
         var query = conn.query("select b.userid,a.id,a.challenge_name,a.spots,a.join_members,a.entry_fees,a.challenge_desc,a.challenge_rules,a.visible,DATE_FORMAT(a.start_date, '%Y-%m-%d %H:%i:%s') as start_date,DATE_FORMAT(a.end_date, '%Y-%m-%d %H:%i:%s') as end_date,DATE_FORMAT(a.start_date, '%Y-%m-%d') as nstart_date,DATE_FORMAT(a.end_date, '%Y-%m-%d') as nend_date,a.challenge_image,a.challenge_image_full,a.challenge_status,p.actual_winningpool,p.actual_poolprice  from tb_challenge_leagues as a left join tb_challenge_winningpools as p on p.challenge_id = a.id left join tb_challenge_joins as b on a.id=b.upcoming_challenge_id and b.userid ='"+reqObj.userid+"' where a.challenge_status = 5", function (err, result){
                if(err){
                    console.error('SQL error: ', err);
                    res.json({"status":'false',"message":'Something went wrong!'});
                } else {
                    if(result.length>0){
                        // console.log("28 AUG",result)
                            challengesModel.challangeCheckJoinNew(result,reqObj.userid,function(filterdData){
                                res.json({"status":'true',"message":'challenges list',"data":filterdData});
                         });
                          
                    }else{
                        res.json({"status":'false',"message":'No challenges found!'});
                    }        
                }
            });
        });

        }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of getUpcomingChallengesList API

router.post("/paywithpaytmresponsenew", (req, res) => {
    var reqObj = req.body;
    req.getConnection(function(err,conn){
        if(err){
            
            res.json({"status": "false", "msg": "Somthing wnet wrong"})
        }
        else{
                if(reqObj.STATUS == 'TXN_SUCCESS'){
                    var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=1,jwt_token='' where ORDERID='"+reqObj.ORDERID+"'",function(err,pay){
                        if(err){
                            console.log("pay1",pay)
                            res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                        }
                        else{
                            if(pay.affectedRows===1){
                                conn.query("select challenge_id,userid from tb_paytm where ORDERID='"+reqObj.ORDERID+"'",function(err,challengeid){
                                    console.error('challengeid', challengeid);
                                    if(err){
                                        console.error('SQL error: ', err);
                                        res.json({"status":'false',"message":'Something went wrong!'});
                                    }else{
                                        if(challengeid.length>0){
                                            conn.query("select * from tb_challenge_joins where userid='"+challengeid[0].userid+"' and upcoming_challenge_id='"+challengeid[0].challenge_id+"'",function(err,checkuser){
                                                if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else{
                                                    if(checkuser.length>0){
                                                        res.json({"status":'false',"message":'You have already challenge!'});
                                                    }else{
                                                        conn.query("update tb_challenge_leagues set spots=spots-1,join_members=join_members+1 where id="+challengeid[0].challenge_id+"", function (err,updatespotsresult){
                                                            if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                            }else{
                                                                if(updatespotsresult.affectedRows===1){
                                                                    conn.query("insert into tb_challenge_joins (upcoming_challenge_id,userid) values("+challengeid[0].challenge_id+","+challengeid[0].userid+")", function (err, insertjoinedusrResult){
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            if(insertjoinedusrResult.insertId!=0){
                                                                                responsePayment(req.body).then(
                                                                                    success => {
                                                                                        res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                                                                                    },
                                                                                    error => {
                                                                                        res.send(error);
                                                                                    }
                                                                                );
                                                                            }
                                                                        }
                                                                    }); // end of insertjoinedusrResult 
                                                                }
                                                            }//end of updatespotsresult else
            
                                                        });// end of updatespotsresult query
                                                    } // checkuser length block
                                                } 
                                            });
                                            

                                        }else{
                                            res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                                        }
                                    }
                                })  
                                    
                            }
                        
                        } 
                       // console.log(pay,"update paytm info");
                        
                    })
        } else {
                var query =conn.query("update `tb_paytm` SET TXNID='"+reqObj.TXNID+"',MID='"+reqObj.MID+"',CHECKSUMHASH='"+reqObj.CHECKSUMHASH+"',TXNAMOUNT='"+reqObj.TXNAMOUNT+"',PAYMENTMODE='"+reqObj.PAYMENTMODE+"', CURRENCY='"+reqObj.CURRENCY+"',TXNDATE='"+reqObj.TXNDATE+"',paytm_status='"+reqObj.STATUS+"',RESPCODE='"+reqObj.RESPCODE+"',RESPMSG='"+reqObj.RESPMSG+"',GATEWAYNAME='"+reqObj.GATEWAYNAME+"',BANKTXNID='"+reqObj.BANKTXNID+"',BANKNAME='"+reqObj.BANKNAME+"', walkify_status=2 where ORDERID='"+reqObj.ORDERID+"',jwt_token=''",function(err,pay){
                    if(err){
                        res.json({"status": "false", "msg": "Somthing wnet wrong3"})
                    } 
                    console.log(pay,"update paytm info");
                    if(pay.affectedRows===1){
                        responsePayment(req.body).then(
                            success => {
                                res.render("response.ejs", {resultData: "true", responseData: success, "data":pay});
                            },
                            error => {
                                res.send(error);
                            }
                        );
                        
                    }else{
                        res.json({"status": "false", "msg": "Somthing wnet wrong"})
                    }
                })
            }
        }
      
    });
});// end

router.post('/joinChallengeSgtnew3', function(req,res,next){
    try{
        var reqObj = req.body;
        if(reqObj.userid==undefined || reqObj.userid==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }else if(reqObj.payout==undefined || reqObj.payout==''){
            res.json({"status":'false',"message":'Request parameter is missing'});
            return false;
        }
        else{
            req.getConnection(function(err, conn){  
                conn.query("select * from tb_challenge_joins where upcoming_challenge_id='"+reqObj.challenge_id+"' and userid='"+reqObj.userid+"'",function(err,alreadyJoinresult){
                    if(err){
                        console.error('SQL error: ', err);
                        res.json({"status":'false',"message":'Something went wrong!'});
                    }else{
                        if(alreadyJoinresult.length>0){
                            res.json({"status":'false',"message":'you have already joined the challenge!'});
                        }else{
                            jsonwebtoken.jwtSign(req.body,(token)=>{
                                var orderId =shortid.generate();
                                var query =conn.query("INSERT INTO `tb_paytm` (`ORDERID`,`jwt_token`,TXNAMOUNT,userid,challenge_id) VALUES('"+orderId+"','"+token+"','"+reqObj.payout+"','"+reqObj.userid+"','"+reqObj.challenge_id+"')",function(err,intiatepay){
                                    console.log(intiatepay,"intiatepay")
                                    if(err){
                                    res.json({"status":"false","msg":"not inserted"})    
                                    }
                                    if(intiatepay.affectedRows===1){
                                        res.json({"status":'wallet',"data":""+config.public_ip+"/PaytmKit/paytm_payment.php?amount="+reqObj.payout+"&action=paytmPayment&orderId="+orderId+"","message":'Please pay via payTm to join challenge!',"redirecturl":""+config.base_url+"/api/challenges/paywithpaytmresponse","token":token});
                                    }
                                    
                                });
                            })
                        }
                    }
                });
                
            }); //end of getConnection block
        } //end of first else block inside try block      
        
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
}); //end of joinChallengeSgtagain API


router.post('/startchallengepercentage', function(req,res,next){
    try{
        var reqObj = req.body; 
            if(reqObj.challenge_id==undefined || reqObj.challenge_id==''){
                res.json({"status":'false',"message":'Request parameter is missing'});
                return false;
            }else{
                req.getConnection(function(err, conn){  
                    function challengeStarted(){
                    return new Promise(function(resolve,reject) {
                        var query = conn.query("select id as challenge_id,tbchlg.spots,tbchlg.join_members,tbchlg.min_member_to_start,tbchlg.challenge_status,tbchlg.start_date,tbchlg.end_date from tb_challenge_leagues as tbchlg where tbchlg.id='"+reqObj.challenge_id+"'", function (err,challengeresult){
                            if(err){
                                console.error('SQL error: ', err);
                                res.json({"status":'false',"message":'Something went wrong!'});
                            } else {
                                if(challengeresult.length>0){
                                    if(challengeresult[0]['challenge_status']===5){
                                        if(challengeresult[0]['join_members']>=challengeresult[0]['min_member_to_start'])
                                        {
                                            conn.query("select userid from tb_challenge_joins where upcoming_challenge_id='"+challengeresult[0]['challenge_id']+"'",function(err,checkjoinres){
                                                if(err){
                                                    console.error('SQL error: ', err);
                                                    res.json({"status":'false',"message":'Something went wrong!'});
                                                }else
                                                {
                                                    if(checkjoinres.length>0){
                                                        conn.query("update tb_challenge_leagues as a left join tb_challenge_joins as b on b.upcoming_challenge_id=a.id set a.challenge_status=1, b.challenge_id=b.upcoming_challenge_id,b.upcoming_challenge_id=0 where a.id='"+challengeresult[0]['challenge_id']+"' and b.upcoming_challenge_id='"+challengeresult[0]['challenge_id']+"'",function(err,statusresult){
                                                            if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                            }else
                                                            {
                                                                asyncLoop(checkjoinres, function (item, next)
                                                                {
                                                                    
                                                                    conn.query("insert into tb_challengepoints(userid,challenge_id,step_points,bonus_points,outdoor_points,total_challenge_points) values('"+item.userid+"','"+reqObj.challenge_id+"',0,0,0,0)",function(err,insertres){
                                                                        if(err){
                                                                            console.error('SQL error: ', err);
                                                                            res.json({"status":'false',"message":'Something went wrong!'});
                                                                        }else{
                                                                            next();
                                                                        }
                                                                        
                                                                    })
                                                                   
                                                                    
                                                                }, function (err)
                                                                {
                                                                    if (err)
                                                                    {
                                                                        console.error('Error: ' + err.message);
                                                                        return;
                                                                    }
                                                                    //res.json({"status":'true',"message":'Challenge has been started!'});
                                                                    resolve(true);
                                                                });
                                                                
                                                                
                                                            }
    
                                                        }) // end of statusresult query
                                                    }else{
                                                        conn.query("update tb_challenge_leagues set challenge_status=1 where id='"+challengeresult[0]['challenge_id']+"'",function(err,updatestatus){
                                                            if(err){
                                                                console.error('SQL error: ', err);
                                                                res.json({"status":'false',"message":'Something went wrong!'});
                                                            }else
                                                            {
                                                               res.json({"status":'true',"message":'Challenge has been started2!'});  
                                                               
                                                            }
                                                        }) //end of updatestatus query
                                                    }
                                                    
                                                }
                                            }) // end of checkjoinres
                                            
                                        }else{
                                            res.json({"status":'false',"message":'Challenge has expired due to less mumber of joiners!'});
                                        }
                                    }else if(challengeresult[0].challenge_status===1){
                                        res.json({"status":'false',"message":'Challenge has been started. Please try to join another challenge!'});
                                    }else{
                                        //resolve(true);
                                        res.json({"status":'false',"message":'Challenge has expired!'});
                                    }
                                }
                            }
                        }); //end of query
                    })
                    }//end of function
                    function updatepoolprice(){
                        return new Promise(function(resolve,reject) {
                            conn.query("select join_members,entry_fees from tb_challenge_leagues where id='"+reqObj.challenge_id+"'",function(err,result){
                                    if(err){
                                    console.error('SQL error: ', err);
                                    res.json({"status":'false',"message":'Something went wrong1!'});
                                }else{
                                    challengesModel.getuserdatawithrankdynamic(reqObj.challenge_id,result[0].join_members,result[0].entry_fees,function(filterdData){
                                        var aa=JSON.stringify(filterdData);
                                       
                                        if(err){
                                            res.json({"status":"false","message":'Something went wrong!!'})
                                        }else{
                                            if(filterdData.length>0){
                                                var totalamount = result[0].join_members*result[0].entry_fees;
                                                var query=conn.query("update tb_challenge_winningpools set current_winningpool='"+aa+"',current_poolprice='"+totalamount+"' where challenge_id='"+reqObj.challenge_id+"'",function(err,updated){
                                                    //console.log(query);
                                                    if(err){
                                                        res.json({"status":"false","message":"something went wrong!!!"})
                                                    }else{
                                                        resolve(filterdData);
                                                    }
                                                })
                                            }else{
                                                res.json({"status":"false","message":"Something went wrong!!!!"})
                                            }
                                            
                                        }//end of else
                                    
                            })
                        } //end of else 
                            })//end of result
                          

                          })
                    }//end of function

                    challengeStarted().then(function(data){
                       if(data==true){
                            updatepoolprice().then((data)=>{
                                res.json({"status":"true","data":data,"message":'Challenge has been started!'});
                            })
                      }
                    })//end of function invoke

                }); //end of getconnection 

            } //end of else block
        
            
        }
        catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
        }
}) //end of startchallenge API
