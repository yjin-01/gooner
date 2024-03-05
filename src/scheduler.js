// const axios = require("axios");
// const cheerio = require("cheerio");
const scheduler = require('node-schedule');
const puppeteer = require('puppeteer');

const logger = require('../src/util/logger');
const matchModel = require('../src/model/match');


// const URL = "https://www.livesport.com/kr/soccer/england/premier-league/#/I3O5jpB2/table/overall";?

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

const crawler = (async () => {
  try {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // 페이지 로드 시간 설정 (기본값 : 30초)
    page.setDefaultNavigationTimeout(60000); // 60초로 설정

    // 페이지로 이동하고 로드될 때까지 대기

    // 브라우저의 뷰포트(viewport) 크기를 설정하는 메서드
    await page.setViewport({
      width: 1920, // 뷰포트의 너비를 1920 픽셀로 설정
      height: 1080, // 뷰포트의 높이를 1080 픽셀로 설정
    });
    // 크롤링할 페이지로 이동
    await page.goto('https://kr.soccerway.com/national/england/premier-league/20232024/regular-season/r76443/', {waitUntil : "domcontentloaded"});

    const rowData = await page.evaluate(() => {
      return document.querySelector('#page_competition_1_block_competition_tables_11').innerText;
    });

    let premierLeagueData = [];
    const rows = rowData.trim().split('\n');

    for (let ranking = 1; ranking < rows.length; ranking += 6) {
      const rowValues = rows[ranking].trim().split(/\s+/);

      if (rowValues.includes('UEFA')) {
        break;
      }

      let last5Matches = [];

      for (let recent = (ranking + 1); recent <= (ranking + 5); recent++) {

        if (rowValues.includes('UEFA')) {
          break;
        }

        let records;
        if(rows[recent]){
          records = rows[recent].trim().split(/\s+/)[0];
          last5Matches.push(records);
        } else {
          console.error ("rows[recent] is not defined or null");
          records= "";
        }
      }

      let teamName = "";
      //
      if(rowValues.length === 10){
        teamName = rowValues[1];
      } else if(rowValues.length === 11){
        teamName = rowValues.slice(1,2).join(" ") + " " + rowValues.slice(2,3).join(" ");
      }else if(rowValues.length === 12){
        teamName = rowValues.slice(1,2).join(" ") + " " + rowValues.slice(2,3).join(" ") +" "+rowValues.slice(3,4).join(" ") ;
      }

      // let teamName = rowValues.slice(1, -9).join(' ');
      // if (rowValues.length > 10) {
      //   teamName += ' ' + rowValues.slice(-9, -).join(' ');
      // }


      let teamData = {
        ranking: rowValues[0],
        team: teamName,
        MP: parseInt(rowValues[rowValues.length - 8]),
        W: parseInt(rowValues[rowValues.length - 7]),
        D: parseInt(rowValues[rowValues.length - 6]),
        L: parseInt(rowValues[rowValues.length - 5]),
        F: parseInt(rowValues[rowValues.length - 4]),
        A: parseInt(rowValues[rowValues.length - 3]),
        GD: parseInt(rowValues[rowValues.length - 2]),
        P: parseInt(rowValues[rowValues.length - 1]),
        last5Matches: last5Matches,
      };

      // console.log(teamData);

      if (!isNaN(parseInt(teamData.ranking))) {
        premierLeagueData.push(teamData);
      }
      ranking += 1;

    }
    console.log(premierLeagueData);
    await browser.close();
  } catch (err) {
    console.error('Error fetching websites : ', err);
  }
})();

module.exports = {
  update_match_result
}