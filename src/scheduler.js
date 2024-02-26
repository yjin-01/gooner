const axios = require("axios");
const cheerio = require("cheerio");
const scheduler = require('node-schedule');

const logger = require('../util/logger');
const matchModel = require('../model/match');

const URL = "https://www.livesport.com/kr/soccer/england/premier-league/#/I3O5jpB2/table/overall";

// 경기 결과 업데이트
const update_match_result = scheduler.scheduleJob('0 0 * * * ', async () => {
  logger.info('update_match_result');
  try{
    const matchResult = await matchModel.updateMatchResult();

    if(!matchResult.affectedRows) {
      logger.info("Nothing needs to be updated !!");
    } else {
      logger.info("Update match result completed!!");
    }

  } catch (err){
    logger.error("Error updating match result : ",err);
  }
});

// const crawlWebsite = scheduler.scheduleJob("59 23 * * * ",async ()=>{
//   try{
//     const response = await axios.get(URL);
//     const $ = cheerio.load(response.data);
//
//     //원하는 데이터 추출
//
//     console.log($);
//
//   } catch (err) {
//
//   }
// })

module.exports = {
  update_match_result
}