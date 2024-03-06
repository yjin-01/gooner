// const axios = require("axios");
// const cheerio = require("cheerio");
const scheduler = require('node-schedule');
const puppeteer = require('puppeteer');

const logger = require('../src/util/logger');
const matchModel = require('../src/model/match');
const teamService = require('../src/service/teamService');


module.exprots = {
  // 경기 결과 업데이트
  updateMatchResult: scheduler.scheduleJob('0 0 * * * ', async () => {
    logger.info('UpdateMatchResult');
    try {
      const matchResult = await matchModel.updateMatchResult();

      if (!matchResult.affectedRows) {
        logger.info("Nothing needs to be updated !!");
      } else {
        logger.info("Update match result completed!!");
      }

    } catch (err) {
      logger.error("Error updating match result : ", err);
    }
  }),

  // 클럽별 성적 업데이트 (업데이트 예정 - 경기 끝난 후)
  updateClubPerformance : scheduler.scheduleJob('0 0 * * *', async () =>{
    logger.info("UpdateClubPerformance");

    try{
      // 클럽 리스트 가져오기
      const clubList = await teamService.getClubInfo();

      console.log(clubList);

      for(let)


    } catch (err) {
      logger.error("Error updating club performance : ", err) ;
    }
  })


}
