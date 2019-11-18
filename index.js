var express = require('express');
var router = express.Router();
var asyncLoop = require('node-async-loop');
var cryptLib = require('cryptlib'),
    iv = cryptLib.generateRandomIV(16), //16 bytes = 128 bit 
    key = cryptLib.getHashSha256('walkify9!8@7*', 32), //32 bytes = 256 bits 
    encryptedText = cryptLib.encrypt('adasdadasd', key);

var md5 = require('md5');
var userPoints=require("../routes/userPoints.json")


/* GET home page. */
router.post('/', function(req, res, next) {
	var reqObj = req.body;
	var iv = "ivWalkify@1!2#3";
	//cryptLib.decrypt(reqObj.code, key, iv);	
  //res.render('index', { title: 'Dude, this is Sanjeev :)' });
  return res.json({
                                             status:"true",
                                             msg:cryptLib.decrypt(reqObj.code, key, iv)
                                          })
});

module.exports = router;

function middleware(req,res,next){
   
    var reqObj = req.body; 

    next();
   // req.getConnection(function(err, conn){  
   //  var queryChecktb_ids = conn.query("SELECT * FROM `tb_ids` where  tb_ids.imei =  '"+reqObj.imei+"'", function (err, resultChecktb_ids)
   //                          {

   //                          if(err){
   //                          console.error('SQL error: ', err);
                            
   //                          }

   //                          if(resultChecktb_ids==''){

   //                              res.json({"status":'false',"msg":'Invalid IMEI!'});
   //                          }
   //                          else{
   //                              var key = cryptLib.getHashSha256('walkify9!8@7*', 32);
   //                              var iv = "ivWalkify@1!2#3";
   //                              var plain = cryptLib.decrypt(resultChecktb_ids[0].cypher, key, iv);
   //                              var plainHeader = cryptLib.decrypt(req.headers.wakifykey, key, iv);
   //                              if(plainHeader == plain){
   //                                  next();
   //                                  // return res.json({
   //                                  //          status:plainHeader,
   //                                  //          msg:plain
   //                                  //       })
   //                                 }else{
   //                                      return res.json({
   //                                           status:"false",
   //                                           msg:"You are doing something wrong!"
   //                                        })
   //                                  }
   //                          }

   //                      });
   //  });

   
}

router.post('/leaderboradOrg', function(req,res,next){


try{
var reqObj = req.body;
	
req.getConnection(function(err, conn){
    
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

	if(!reqObj.organisation_id || reqObj.organisation_id == "")
		{

			res.json({"status":'false',"msg":'Organisation Id is missing!'});
		}
		else{

				    



				    function getLeaderboardByOrg() {
				        
				        return new Promise(function(resolve,reject) {
				            		if(reqObj.organisation_id != 0 && reqObj.organisation_id != '0'){
									//var queryLeaderboardByOrg = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"'  GROUP BY tb_users.id ORDER BY totalpoints DESC", function (err, resultLeaderboardByOrg){

									if(!reqObj.userid || reqObj.userid==''){
				        				var query = "SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"'  and tb_points.status=0  GROUP BY tb_users.id ORDER BY totalpoints DESC limit 100";
				        			}else{
				        				var query = "(select * from (SELECT  rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"' and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid = '"+reqObj.userid+"')UNION(select * from (SELECT  rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender,IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"' and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid <> '"+reqObj.userid+"' limit 100)";
				        			}

									var queryLeaderboardByOrg = conn.query(query, function (err, resultLeaderboardByOrg){	
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultLeaderboardByOrg == ""){

											
											resolve(resultLeaderboardByOrg);

										}else{

											

											resolve(resultLeaderboardByOrg);
										}


									});
							}else{
								resultLeaderboardByOrg = [];
								resolve(resultLeaderboardByOrg);
							}


				        });
				    }



				    

				        	getLeaderboardByOrg().then(function(data) {
							    	
							        var organisationLeaderboard = data;
							        
							        if(organisationLeaderboard.length < 1){
							        	msgOL = '';
							        }else{
							        	var msgOL = organisationLeaderboard[0].org_msg;	
							        }
							        
							        	
							        		res.json({"status":'true', "organisationLeaderboardMsg":msgOL, "organisationLeaderboard":organisationLeaderboard});
							        
							        	
							   
							        
							        //next();
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




router.post('/leaderboradGLB', function(req,res,next){


try{
var reqObj = req.body;
	
req.getConnection(function(err, conn){
    
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

	

				    function getLeaderboardGlobal() {
				        
				        return new Promise(function(resolve,reject) {

				        			if(!reqObj.userid || reqObj.userid==''){
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a )UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a ) limit 100";
				        			}else{
				        			
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid ='"+reqObj.userid+"')UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid <>'"+reqObj.userid+"' limit 100)";
				        			}
				            
									var queryLeaderboardGlobal = conn.query(query, function (err, resultLeaderboardGlobal){
									if(err){
									//console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultLeaderboardGlobal == ""){

											//
											resolve(resultLeaderboardGlobal);

										}else{

											//

											resolve(resultLeaderboardGlobal);
										}


									});


				        });
				    }


				    



				    getLeaderboardGlobal().then(function(data) {
				    	

				    	var globalLeaderboard = data;

				        if(data){

				        	res.json({"status":'true', "globalLeaderboardMsg":globalLeaderboard[0].org_msg, "globalLeaderboard":globalLeaderboard});
				        }
				        //next();
				    });

				
}
});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});
//v15.1 start
router.post('/leaderboradCL', function(req,res,next){
	res.json({"status":'false',"msg":"please update app"});
});
//v15.1 end

//v15.2
router.post('/leaderboradCLvfone', function(req,res,next){
res.json({"status": "false", "msg": "Update app" });
});
//v15.2
// router.post('/leaderboradCLFTwo', function(req,res,next){


// 	try{
// 	var reqObj = req.body;
// 		
// 	req.getConnection(function(err, conn){
// 		
// 	if(err)
// 	{
// 	
// 	res.json({"status":'false',"msg":'Something went wrong!'});
// 	}
// 	else
// 	{
// 						function getLeaderboardGlobalPrize() {
// 							
// 							return new Promise(function(resolve,reject) {
	
// 										if(!reqObj.userid || reqObj.userid==''){
// 											var query = "(select * from (SELECT rank() OVER (ORDER BY leaguetotalpoint DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender,  IFNULL(tb_newpoint.points, 0) as steppoints, IFNULL(tb_newpoint.bonus_point, 0) as bonuspoints, IFNULL(tb_newpoint.outdoor_point, 0) as outdoorpoint, IFNULL(tb_newpoint.total_league_steps, 0) as leaguesteps,IFNULL(tb_newpoint.total_league_point,0) as leaguetotalpoint FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id  where tb_users.bannuseres<>1 GROUP BY tb_users.id ORDER BY leaguetotalpoint DESC) as a limit 250)"
// 										}else{
// 											var query = "(select * from (SELECT rank() OVER (ORDER BY leaguetotalpoint DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender,  IFNULL(tb_newpoint.points, 0) as steppoints, IFNULL(tb_newpoint.bonus_point, 0) as bonuspoints, IFNULL(tb_newpoint.outdoor_point, 0) as outdoorpoint, IFNULL(tb_newpoint.total_league_steps, 0) as leaguesteps,IFNULL(tb_newpoint.total_league_point,0) as leaguetotalpoint FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id  where tb_users.bannuseres<>1 GROUP BY tb_users.id ORDER BY leaguetotalpoint DESC) as a limit 250)"
// 										}
										
// 										var queryLeaderboardGlobal = conn.query(query, function (err, resultLeaderboardGlobal){
// 										if(err){
// 										console.error('SQL error: ', err);
// 										res.json({"status":'false',"msg":err});
// 										}
// 										var query1 = "(select * from (SELECT rank() OVER (ORDER BY leaguetotalpoint DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender,  tb_newpoint.points as steppoints, tb_newpoint.bonus_point as bonuspoints, tb_newpoint.outdoor_point as outdoorpoint, tb_newpoint.total_league_steps as leaguesteps,IFNULL(tb_newpoint.total_league_point, 0) as leaguetotalpoint FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id  where tb_users.bannuseres<>1 GROUP BY tb_users.id ORDER BY leaguetotalpoint DESC) as a where userid = '"+reqObj.userid+"' )"
// 										var queryLeaderboardGlobal = conn.query(query1, function (err, resultLeaderboardGlobal01){
// 											var abc={};
// 											if(resultLeaderboardGlobal == ""){
// 												
// 												abc.resultLeaderboardGlobal=resultLeaderboardGlobal;
// 												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
// 												resolve(abc);
	
// 											}else{
	
// 												
// 												abc.resultLeaderboardGlobal=resultLeaderboardGlobal;
// 												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
// 												resolve(abc);
// 											}
// 										});
	
// 										});
	
	
// 							});
// 						}
	
	
	
	
					
	
	
						
// 										getLeaderboardGlobalPrize().then(function(data) {
// 											
// 											var prizeGBL = data.resultLeaderboardGlobal;
// 											var prizeGBL1 = data.resultLeaderboardGlobal01;
// 											res.json({"status":'true', "globalLeaderboardMsg":prizeGBL[0].org_msg,  "userdata":prizeGBL1, "globalLeaderboardPrize":prizeGBL});
											
// 										})
										
						
	
					
// 	}
// 	});
// 	}
// 	catch(ex){
// 	console.error("Internal error:"+ex);
// 	return next(ex);
// 	}
// });
//v15.3
/// without league
// router.post('/leaderboradCLFTwo', function(req,res,next){
// 	try{
// 	var reqObj = req.body;
// 	req.getConnection(function(err, conn){
// 	if(err)
// 	{
// 	res.json({"status":'false',"msg":'Something went wrong!'});
// 	}
// 	else
// 	{
// 						function getLeaderboardGlobalPrize() {
// 							return new Promise(function(resolve,reject) {
// 								  if(reqObj.userid =='' || reqObj==undefined){
// 									  res.json({"status": "false", "msg": "Userid Not register"})
// 								  }else{
// 										var query1 = "(select * from (SELECT rank() OVER (ORDER BY leaguetotalpoint DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, tb_newpoint.points as steppoints, tb_newpoint.bonus_point as bonuspoints, tb_newpoint.outdoor_point as outdoorpoint, tb_newpoint.total_league_steps as leaguesteps,tb_newpoint.total_league_point as leaguetotalpoint FROM tb_newpoint RIGHT JOIN tb_users ON tb_newpoint.userid = tb_users.id GROUP BY tb_users.id ORDER BY leaguetotalpoint DESC) as a where userid = '"+reqObj.userid+"' )"
// 										var queryLeaderboardGlobal = conn.query(query1, function (err, resultLeaderboardGlobal01){
// 											var abc={};
// 											if(resultLeaderboardGlobal01 == ""){
												
// 												abc.resultLeaderboardGlobal=0;
// 												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
// 												resolve(abc);
	
// 											}else{
	
												
// 												abc.resultLeaderboardGlobal=0;
// 												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
// 												resolve(abc);
// 											}
// 										});
// 									}
// 							});
// 						}
// 										getLeaderboardGlobalPrize().then(function(data) {
											
// 											var prizeGBL = data.resultLeaderboardGlobal;
// 											var prizeGBL1 = data.resultLeaderboardGlobal01;
// 											// res.json({"status":'true', "globalLeaderboardMsg":prizeGBL[0].org_msg,  "userdata":prizeGBL1, "globalLeaderboardPrize":prizeGBL});
// 											res.json({"status":'true', "globalLeaderboardMsg": "It's a challenge week. You will not get the league money but you will be rewarded with the participation prize of ₹ 2. (Note: Your current rank is just for motivation)",  "userdata":prizeGBL1, "globalLeaderboardPrize":[]});											
// 										})
										
						
	
					
// 	}
// 	});
// 	}
// 	catch(ex){
// 	console.error("Internal error:"+ex);
// 	return next(ex);
// 	}
// });
// without league api
router.post('/leaderboradWinnerList', function(req,res,next){


try{
var reqObj = req.body;
	
req.getConnection(function(err, conn){
    
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

	
				    function getWinnersList() {
				        
				        return new Promise(function(resolve,reject) {
                              //SELECT tb_users.name, tb_users.profileImg , tb_users.gender, sum(tb_wallet.amount) as amount, CONCAT('Last winners were on ',(select date_format (date,'%d %M %Y') from tb_wallet ORDER by date desc limit 1),'.') as winners_msg FROM `tb_wallet`, tb_users where tb_users.id=tb_wallet.userid GROUP by tb_wallet.userid ORDER by amount desc
				        			var query = "SELECT tb_users.name, tb_users.profileImg , tb_users.gender,tb_wallet.userid, group_concat(amount separator ',')as winprice ,group_concat(DATE_FORMAT(date, '%Y-%m-%d') separator ',') as `winpricedatewise`, sum(tb_wallet.amount) as amount, CONCAT('Last winners were on ',(select date_format (date,'%d %M %Y') from tb_wallet ORDER by date desc limit 1),'.') as winners_msg FROM `tb_wallet`, tb_users where tb_users.id=tb_wallet.userid GROUP by tb_wallet.userid ORDER by amount desc";
									
									var queryWinnersList = conn.query(query, function (err, resultWinnersList){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultWinnersList == ""){

											
											resolve(resultWinnersList);

										}else{

											

											resolve(resultWinnersList);
										}


									});


				        });
				    }



				    


				   
							        	getWinnersList().then(function(data) {
							        		var msgWin = data[0].winners_msg;	
							        		res.json({"status":'true',  "winnerMsg":msgWin,  "winnerList":data});
							        	})
							        	
							       
				
}
});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});

// Api for leader-borad
router.post('/leaderborad', middleware, function(req,res,next){


try{
var reqObj = req.body;
	
req.getConnection(function(err, conn){
    
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

	if(!reqObj.organisation_id || reqObj.organisation_id == "")
		{

			res.json({"status":'false',"msg":'Organisation Id is missing!'});
		}
		else{

				    function getLeaderboardGlobal() {
				        
				        return new Promise(function(resolve,reject) {

				        			if(!reqObj.userid || reqObj.userid==''){
				        				//var query = "SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_organisations.org_msg as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id=0 and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC";
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a )UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a ) limit 100";
				        			}else{
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id  GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid ='"+reqObj.userid+"')UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid <>'"+reqObj.userid+"' limit 100)";
				        			}
				            
									var queryLeaderboardGlobal = conn.query(query, function (err, resultLeaderboardGlobal){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultLeaderboardGlobal == ""){

											
											resolve(resultLeaderboardGlobal);

										}else{

											

											resolve(resultLeaderboardGlobal);
										}


									});


				        });
				    }


				    function getLeaderboardGlobalPrize() {
				        
				        return new Promise(function(resolve,reject) {

				        			if(!reqObj.userid || reqObj.userid==''){
				        				
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status = 0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a )UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status = 0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a ) limit 100";
				        			}else{
				        				var query = "(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status = 0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid ='"+reqObj.userid+"')UNION(select * from (SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, (SELECT org_msg FROM `tb_organisations` where id = 0 limit 1) as org_msg,tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.status = 0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid <>'"+reqObj.userid+"' limit 100)";
				        			}
				            
									var queryLeaderboardGlobal = conn.query(query, function (err, resultLeaderboardGlobal){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultLeaderboardGlobal == ""){

											
											resolve(resultLeaderboardGlobal);

										}else{

											

											resolve(resultLeaderboardGlobal);
										}


									});


				        });
				    }


				    function getWinnersList() {
				        
				        return new Promise(function(resolve,reject) {

				        			var query = "SELECT tb_users.name, tb_users.profileImg , tb_users.gender, sum(tb_wallet.amount) as amount, CONCAT('Last winners were on ',(select date_format (date,'%d %M %Y') from tb_wallet ORDER by date desc limit 1),'.') as winners_msg FROM `tb_wallet`, tb_users where tb_users.id=tb_wallet.userid GROUP by tb_wallet.userid ORDER by amount desc";
				            
									var queryWinnersList = conn.query(query, function (err, resultWinnersList){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultWinnersList == ""){

											
											resolve(resultWinnersList);

										}else{

											

											resolve(resultWinnersList);
										}


									});


				        });
				    }



				    function getLeaderboardByOrg() {
				        
				        return new Promise(function(resolve,reject) {
				            		if(reqObj.organisation_id != 0 && reqObj.organisation_id != '0'){
									//var queryLeaderboardByOrg = conn.query("SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_users.email,tb_users.profileImg, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"'  GROUP BY tb_users.id ORDER BY totalpoints DESC", function (err, resultLeaderboardByOrg){

									if(!reqObj.userid || reqObj.userid==''){
				        				var query = "SELECT rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"'  and tb_points.status=0  GROUP BY tb_users.id ORDER BY totalpoints DESC limit 100";
				        			}else{
				        				var query = "(select * from (SELECT  rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender, IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"' and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid = '"+reqObj.userid+"')UNION(select * from (SELECT  rank() OVER (ORDER BY totalpoints DESC) as rank, tb_users.id as userid, tb_users.name, tb_organisations.org_msg as org_msg, tb_users.email,tb_users.profileImg, tb_users.gender,IFNULL(sum(tb_points.points), 0) as totalpoints FROM tb_points RIGHT JOIN tb_users ON tb_points.userid = tb_users.id and tb_points.organisation_id = tb_users.organisation_id RIGHT JOIN tb_organisations ON tb_organisations.id=tb_users.organisation_id where tb_users.organisation_id='"+reqObj.organisation_id+"' and tb_points.status=0 GROUP BY tb_users.id ORDER BY totalpoints DESC) as a where userid <> '"+reqObj.userid+"' limit 100)";
				        			}

									var queryLeaderboardByOrg = conn.query(query, function (err, resultLeaderboardByOrg){	
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":err});
									}

										if(resultLeaderboardByOrg == ""){

											
											resolve(resultLeaderboardByOrg);

										}else{

											

											resolve(resultLeaderboardByOrg);
										}


									});
							}else{
								resultLeaderboardByOrg = [];
								resolve(resultLeaderboardByOrg);
							}


				        });
				    }



				    getLeaderboardGlobal().then(function(data) {
				    	

				    	var globalLeaderboard = data;

				        if(data){

				        	getLeaderboardByOrg().then(function(data) {
							        var organisationLeaderboard = data;
							        
							        if(organisationLeaderboard.length < 1){
							        	msgOL = '';
							        }else{
							        	var msgOL = organisationLeaderboard[0].org_msg;	
							        }
							        getLeaderboardGlobalPrize().then(function(data) {
							        	var prizeGBL = data;
							        	getWinnersList().then(function(data) {
							        		var msgWin = data[0].winners_msg;	
							        		res.json({"status":'true', "globalLeaderboardMsg":globalLeaderboard[0].org_msg, "organisationLeaderboardMsg":msgOL, "winnerMsg":msgWin, "globalLeaderboard":globalLeaderboard, "organisationLeaderboard":organisationLeaderboard, "globalLeaderboardPrize":prizeGBL, "winnerList":data});
							        	})
							        	
							        })
							        
							        //next();
							    });
				        }
				        //next();
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



// Api for rewards
router.post('/getRewards', middleware, function(req,res,next){


try{
var reqObj = req.body;
	
req.getConnection(function(err, conn){
    
if(err)
{

res.json({"status":'false',"msg":'Something went wrong!'});
}
else
{

	if(!reqObj.organisation_id || reqObj.organisation_id == "")
		{

			res.json({"status":'false',"msg":'Organisation Id is missing!'});
		}
		else{

				    function getRewardsGlobal() {
				        
				        return new Promise(function(resolve,reject) {
				            
									var queryLeaderboardGlobal = conn.query("SELECT rank, organisation_id, image, url, jsonrank from tb_reward_prizes WHERE  tb_reward_prizes.organisation_id =  '0'", function (err, resultRewardsGlobal){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":'Something went wrong!'});
									}

										if(resultRewardsGlobal == ""){

											
											resolve(resultRewardsGlobal);

										}else{

											

											resolve(resultRewardsGlobal);
										}


									});


				        });
				    }


				    function getRewardsByOrg() {
				        
				        return new Promise(function(resolve,reject) {
				            		if(reqObj.organisation_id != 0 && reqObj.organisation_id != '0'){
									var queryLeaderboardByOrg = conn.query("SELECT rank, organisation_id, image, url from tb_reward_prizes WHERE  tb_reward_prizes.organisation_id =  '"+reqObj.organisation_id+"'", function (err, resultRewardsByOrg){
									if(err){
									console.error('SQL error: ', err);
									res.json({"status":'false',"msg":'Something went wrong!'});
									}

										if(resultRewardsByOrg == ""){

											
											resolve(resultRewardsByOrg);

										}else{

											

											resolve(resultRewardsByOrg);
										}


									});
							}else{
								resultRewardsByOrg = [];
								resolve(resultRewardsByOrg);
							}


				        });
				    }



				    getRewardsGlobal().then(function(data) {
				    	

				    	var globalRewards = data;

				        if(data){

				        	getRewardsByOrg().then(function(data) {
							        var organisationRewards = data;
							        res.json({"status":'true',"globalRewards":globalRewards, "organisationRewards":organisationRewards,  "rankRewardsGlobal":JSON.parse(globalRewards[0].jsonrank)});
							        //next();
							    });
				        }
				        //next();
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


//get diseases list

router.get('/getdiseases', function(req,res,next){
    
try{
var reqObj = req.body;        


        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT * from tb_disease", function (err, result){
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


// secretID
router.post('/auth', function(req,res,next){
    
try{
var reqObj = req.body;        

		
        req.getConnection(function(err, conn){  

        	var otp = Math.floor(Math.random()*90000) + 10000;
        	var hash = md5('Walk'+reqObj.dt+otp);
        	var iv = 'ivWalkify@1!2#3';
        	var cipher = cryptLib.encrypt(hash, key, iv)
	
            var query = conn.query("delete from tb_ids where imei like '%"+reqObj.dt+"%'", function (err, result){
            if(err){
            console.error('SQL error: ', err);
            res.json({"status":'false',"msg":'Something went wrong!'});
            }
            	var query = conn.query("INSERT INTO `tb_ids`(`imei`, `generated_id`, `cypher`) VALUES ('"+reqObj.dt+"','"+hash+"','"+cipher+"')", function (err, result){
		            if(err){
		            console.error('SQL error: ', err);
		            res.json({"status":'false',"msg":'Something went wrong!'});
		            }
		            if(result==''){

		            res.json({"status":'false',"msg":'No record found'});
		                
		            }else{


		                    
		                res.json({"status":'true',"msg":'Successful',"response":hash});
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


router.get('/getpendingreq', function(req,res,next){
    
	try{
	var reqObj = req.body;        
		
	
			req.getConnection(function(err, conn){  
				var query = conn.query("SELECT tb_challenge_wallet.*,updated_at AS date, tb_users.name, tb_users.email from tb_challenge_wallet, tb_users where tb_challenge_wallet.is_withdrawn_resuested_generated=1 and tb_challenge_wallet.is_withdrawal=0 and tb_users.id=tb_challenge_wallet.userid", function (err, result){
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


router.get('/getwithdrawedreq', function(req,res,next){
    
try{
var reqObj = req.body;        
	

        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT tb_wallet.*, tb_users.name, tb_users.email from tb_wallet, tb_users where tb_wallet.is_withdrawn_resuested_generated=1 and tb_wallet.is_withdrawal=1 and tb_users.id=tb_wallet.userid", function (err, result){
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


router.get('/getallreq', function(req,res,next){
    
try{
var reqObj = req.body;        
	

        req.getConnection(function(err, conn){  
            var query = conn.query("SELECT tb_wallet.*, tb_users.name, tb_users.email from tb_wallet, tb_users where tb_wallet.is_withdrawn_resuested_generated=1 and tb_users.id=tb_wallet.userid", function (err, result){
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

router.get('/paymentrequestCompleted', function(req,res,next){
    
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
	
router.get('/winnersLeagueGlobalHC', function(req,res,next){
    
		try{
			var reqObj = req.body;   
					req.getConnection(function(err, conn){  
						conn.query("(select rank() over (order by a.total_league_point desc)as rank, b.id as userid,b.name,ifnull(a.total_league_point,0) as totalpoints from tb_newpoint as a left join tb_users as b on a.userid=b.id  ORDER BY a.total_league_point DESC) limit 250", function (err, result){	
						 if(err){
						console.error('SQL error: ', err);
						res.json({"status":'false',"msg":'Something went wrong!'});
						  }
						if(result==''){
						res.json({"status":'false',"msg":'No record found'});
						 }else{
						  
								  var rewardJson = result;
					var updatedArr=[];
					var rankArr=[];
					asyncLoop(rewardJson, function (item, next)
						{
							if(rankArr.findIndex(p => p.rank == item.rank)==-1){
								updatedArr.push(rewardJson.filter(x => x.rank == item.rank));
								rankArr.push({
									rank:item.rank
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
						 
									var amount=0.00;
									asyncLoop(updatedArr, function (item1, next)
										{
											var rank=item1[0].rank;
											
											var rankIndex=userPoints.findIndex(r => r.rank == rank)
											var rankHolderlength=rankIndex+item1.length;
											 for(var i=rankIndex;i<rankHolderlength;i++){
												 amount=amount+parseFloat(userPoints[i].amount);
												 if(i==rankHolderlength-1){
													 amount=amount/item1.length
													 asyncLoop(item1, function (item2, next1)
														{
															 conn.query("SELECT userid FROM `tb_challenge_wallet` where userid = '"+item2.userid+"'", function(err, useridcheck){
																 if(err){
																	res.json({"status":'false',"msg":'Something went wrong!'});
																 }
																 else{
																	 if(useridcheck.length>0){
																		 conn.query("UPDATE `tb_challenge_wallet` SET `amount` = amount+'"+amount.toFixed(2)+"', updated_at = NOW() WHERE `userid` = '"+item2.userid+"'", function(err, resultudpatewallet){
																			if(err){
																				res.json({"status":'false',"msg":err});
																			 }
																			 else{
																				var query = conn.query("insert into tb_wallet(userid, amount) Values('"+item2.userid+"','"+amount.toFixed(2)+"')", function (err, result){
																					if(err){
																						res.json({"status":'false',"msg":err});
																					}
																					conn.query("UPDATE tb_notwinner set claim_status = 1 WHERE userid = '"+item2.userid+"'", function (err, result123){
																						if(err){
																							res.json({"status":'false',"msg":err});
																						}
																						next1();
																					  });
																					});
																			 }
																			 
																		 });
																		 
																		 
																	 }
																	 // if user id exist
																	 else{
																		conn.query("INSERT INTO `tb_challenge_wallet` (`userid`, `amount`, `created_at`, `updated_at`) VALUES ('"+item2.userid+"', '"+amount.toFixed(2)+"', NOW(), NOW())", function(err, resultudpatewallet){
																			if(err){
																				res.json({"status":'false',"msg":err});
																			 }
																			 else{
																				var query = conn.query("insert into tb_wallet(userid, amount) Values('"+item2.userid+"','"+amount.toFixed(2)+"')", function (err, result){
																					if(err){
																						res.json({"status":'false',"msg":err});
																					}
																					conn.query("UPDATE tb_notwinner set claim_status = 1 WHERE userid = '"+item2.userid+"'", function (err, result123){
																						if(err){
																							res.json({"status":'false',"msg":err});
																						}
																						next1();
																					  });
																					});
																			 }
																			 
																		 });
																		 
																	 }
																	 //if user id not exist
																 }//else end challenge
	
															 });//check userid tb_challange table end
															 //next1();
														}, function (err)
														{
															if (err)
															{
																console.error('Error: ' + err.message);
																return;
															}
															amount=0.00;
															next();
														});
												 }
											}
											
											//next();
										}, function (err)
										{
											if (err)
											{
												console.error('Error: ' + err.message);
												return;
											}
										 
											res.json({
												"status": "true",
												"rewardJson": updatedArr,
												"userPoints": userPoints
											})
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

router.get('/resetGlobalLBHC', function(req,res,next){
	try{
	var reqObj = req.body;        
		
			req.getConnection(function(err, conn){  
				var query = conn.query("update `tb_points` set status=1", function (err, result){
				if(err){
				console.error('SQL error: ', err);
				res.json({"status":'false',"msg":'Something went wrong!'});
				}
				
				  var set_zero = "TRUNCATE TABLE tb_newpoint";
						conn.query(set_zero, (err, result2)=>{
							if(err){
								res.json({"status":'false',"msg":'Something went wrong!'});
							}
						conn.query("TRUNCATE TABLE tb_stepscount_newhistory", (err, result02)=>{
							if(err){
								res.json({"status":'false',"msg":'Something went wrong! truncate'});
							}
						conn.query("TRUNCATE TABLE tb_bonuspoint", (err, result12)=>{
							if(err){
								res.json({"status":'false',"msg":'Something went wrong! truncate'});
							}
					  res.json({"status":'true',"msg":'Successful',"response":result});
					});
				});
				});
				});
				});
	
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});

//mct insentive

router.get('/NotWinnerUsersTable', function(req,res,next){    
    try{
    var reqObj = req.body;        
            req.getConnection(function(err, conn){
                conn.query("TRUNCATE TABLE tb_notwinner", (err, resulttrunc)=>{
                    if(err){
                        res.json({"status": "false", "message": err})
                    }
                    else{   
                      conn.query("INSERT INTO tb_notwinner(userid) SELECT userid FROM tb_newpoint", (err, resultc)=>{
                        if(err){
                            res.json({"status": "false", "message": err})
                        }
                        else{
                            res.json({"status": "true", "message": resultc})
                        }
                    });
                    }
                });
               })     
    
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
//mct insentive



router.post('/leaderboradCLFTwo', function(req,res,next){


	try{
	var reqObj = req.body;
		
	req.getConnection(function(err, conn){
		
	if(err)
	{
	
	res.json({"status":'false',"msg":'Something went wrong!'});
	}
	else
	{
						function getLeaderboardGlobalPrize() {
							
							return new Promise(function(resolve,reject) {
	
										if(!reqObj.userid || reqObj.userid==''){
											var query = "(select b.id as userid,b.name,b.profileImg,b.gender,ifnull(a.points,0) as steppoints,ifnull(a.bonus_point,0) as bonuspoints,ifnull(a.outdoor_point,0) as outdoorpoint, ifnull(a.total_league_point,0) as leaguetotalpoint,rank() over (order by a.total_league_point desc)as rank from tb_newpoint as a left join tb_users as b on a.userid=b.id ORDER BY a.total_league_point DESC) limit 250"
										}else{
											var query = "(select b.id as userid,b.name,b.profileImg,b.gender,ifnull(a.points,0) as steppoints,ifnull(a.bonus_point,0) as bonuspoints,ifnull(a.outdoor_point,0) as outdoorpoint, ifnull(a.total_league_point,0) as leaguetotalpoint,rank() over (order by a.total_league_point desc)as rank from tb_newpoint as a left join tb_users as b on a.userid=b.id ORDER BY a.total_league_point DESC) limit 250"
										}
										
										var queryLeaderboardGlobal = conn.query(query, function (err, resultLeaderboardGlobal){
										if(err){
										console.error('SQL error: ', err);
										res.json({"status":'false',"msg":err});
										}
										var query1 = "SELECT a.userid,b.name,b.gender,b.profileImg,ifnull(a.points,0) as steppoints,ifnull(a.bonus_point,0) as bonuspoints,ifnull(a.outdoor_point,0) as outdoorpoint, ifnull(a.total_league_point,0) as leaguetotalpoint,(SELECT COUNT(*)+1 FROM tb_newpoint WHERE total_league_point>a.total_league_point)as rank FROM tb_newpoint as a right join tb_users as b on b.id=a.userid WHERE a.userid = '"+reqObj.userid+"'"
										var queryLeaderboardGlobal = conn.query(query1, function (err, resultLeaderboardGlobal01){
											if(err){
												res.json({"status":"false", "msg": err})
											}else{
											conn.query("SELECT org_msg  FROM `tb_organisations` where id = 0 limit 1", (err, resultorg_msg)=>{
                                                  if(err){
													  res.json({"status":"false", "msg": err})
												  }else{

												
											var abc={};
											if(resultLeaderboardGlobal == ""){
												
												abc.resultLeaderboardGlobal=resultLeaderboardGlobal;
												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
												abc.resultorg_msg=resultorg_msg;
												resolve(abc);
	
											}else{
	
												
												abc.resultLeaderboardGlobal=resultLeaderboardGlobal;
												abc.resultLeaderboardGlobal01=resultLeaderboardGlobal01;
												abc.resultorg_msg=resultorg_msg;
												resolve(abc);
											}
										}
										   });
										  }
										 });
										});
	
	
							});
						}
										getLeaderboardGlobalPrize().then(function(data) {
											
											var prizeGBL = data.resultLeaderboardGlobal;
											var prizeGBL1 = data.resultLeaderboardGlobal01;
											var prizeGBL3 = data.resultorg_msg;
											// res.json({"status":'true', "globalLeaderboardMsg":"Next paid league will start from 28th October 2019.",  "userdata":prizeGBL1, "globalLeaderboardPrize":prizeGBL, "showrank":"This week does NOT pay money for league, its a free (non paid) league."});This week does NOT pay money for league, its a free league.
											
											res.json({"status":'true', "globalLeaderboardMsg":prizeGBL3[0].org_msg,  "userdata":prizeGBL1, "globalLeaderboardPrize":prizeGBL, "showrank":""});
											
										})
					
	}
	});
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});

router.post('/walletWinnerList', function(req,res,next){
	try{
	var reqObj = req.body;
	if(reqObj.userid=="" || reqObj.userid=="undefined"){
		res.json({"status": "false", "message": "Invalid user"})
	}else{
		req.getConnection(function(err, conn){
			if(err)
			{
				res.json({"status":'false',"msg":'Something went wrong!'});
			}
			else
			{
							function getWinnersList() {
							return new Promise(function(resolve,reject) {
									//SELECT tb_users.name, tb_users.profileImg , tb_users.gender, sum(tb_wallet.amount) as amount, CONCAT('Last winners were on ',(select date_format (date,'%d %M %Y') from tb_wallet ORDER by date desc limit 1),'.') as winners_msg FROM `tb_wallet`, tb_users where tb_users.id=tb_wallet.userid GROUP by tb_wallet.userid ORDER by amount desc
										var query = "SELECT tb_wallet.userid, group_concat(amount separator ',')as winprice,group_concat(DATE_FORMAT(date, '%Y-%m-%d') separator ',') as `winpricedatewise`, sum(tb_wallet.amount) as amount from tb_wallet where tb_wallet.userid='"+reqObj.userid+"' GROUP by tb_wallet.userid";
										//SELECT tb_wallet.userid, group_concat(amount separator ',')as winprice,group_concat(DATE_FORMAT(date, '%Y-%m-%d') separator ',') as `winpricedatewise`, sum(tb_wallet.amount) as amount from tb_wallet where tb_wallet.userid='"+reqObj.userid+"' GROUP by tb_wallet.userid ORDER by amount desc";
										
										var queryWinnersList = conn.query(query, function (err, resultWinnersList){
										if(err){
										console.error('SQL error: ', err);
										res.json({"status":'false',"msg":err});
										}else{
											if(resultWinnersList.length==0){
												res.json({"status":"false","message":"User not found"})
											}else{
												if(resultWinnersList == ""){
													
													resolve(resultWinnersList);
												   }else{
														   resolve(resultWinnersList);
												   }
											}

										}
											
							});
								});
								}
										getWinnersList().then(function(data) {
														var msgWin = data[0].winners_msg;
														var zeroprice =[];
														if(data[0].winprice==0){
														res.json({"status":"true","winnerList":zeroprice})
														}else{
															res.json({"status":'true',  "winnerMsg":msgWin,  "winnerList":data});
														}	
														
													})
												}
			});
	}
	
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
	});