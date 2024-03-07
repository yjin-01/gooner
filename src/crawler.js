const puppeteer = require('puppeteer');

module.exports = {
  // 시즌별 전체 전적 가져오기
  totalMatchesBySeason: async () => {
    try {

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      // 페이지 로드 시간 설정 (기본값 : 30초)
      page.setDefaultNavigationTimeout(60000); // 60초로 설정

      // 크롤링할 페이지로 이동
      await page.goto('https://uk.soccerway.com/national/england/premier-league/20232024/regular-season/r76443/', { waitUntil: 'domcontentloaded' });

      const rowData = await page.evaluate(() => {
        return document.querySelector('#page_competition_1_block_competition_tables_10').innerText;
      });

      let premierLeagueData = [];

      const rows = rowData.trim().split('\n');

      for (let ranking = 1; ranking < rows.length; ranking += 6) {
        const rowValues = rows[ranking].trim().split(/\s+/);

        if (rowValues.includes('UEFA')) {
          break;
        }

        let last5Matches = '';

        for (let recent = (ranking + 1); recent <= (ranking + 5); recent++) {

          if (rowValues.includes('UEFA')) {
            break;
          }

          let records;
          if (rows[recent]) {
            records = rows[recent].trim().split(/\s+/)[0];
            last5Matches += records;
          } else {
            // console.error('rows[recent] is not defined or null');
            records = '';
          }
        }

        let teamName = '';

        if (!isNaN(parseInt(rowValues[2]))) {
          teamName = rowValues[1];
        } else if (!isNaN(parseInt(rowValues[3]))) {
          teamName = rowValues.slice(1, 2).join(' ') + ' ' + rowValues.slice(2, 3).join(' ');
        } else if (!isNaN(parseInt(rowValues[4]))) {
          teamName = rowValues.slice(1, 2).join(' ') + ' ' + rowValues.slice(2, 3).join(' ') + ' ' + rowValues.slice(3, 4).join(' ');
        }

        // 위의 식 개선
        // let teamName = rowValues.slice(1, -9).join(' ');
        // if (rowValues.length > 10) {
        //   teamName += ' ' + rowValues.slice(-9, -).join(' ');
        // }

        // 공백 제거
        // teamName = teamName.replace(/\s+$/,"");

        // 크롤링 시, 웹 사이트의 결과값이 아래와 같이 오기 때문에 제거해주기 위해 사용
        teamName = teamName.replace('…', '');

        let teamData = {
          ranking: rowValues[0],
          team: teamName,
          totalMatches: parseInt(rowValues[rowValues.length - 8]),
          win: parseInt(rowValues[rowValues.length - 7]),
          draw: parseInt(rowValues[rowValues.length - 6]),
          lose: parseInt(rowValues[rowValues.length - 5]),
          score: parseInt(rowValues[rowValues.length - 4]),
          conceded: parseInt(rowValues[rowValues.length - 3]),
          gainLossDifference: parseInt(rowValues[rowValues.length - 4]) - parseInt(rowValues[rowValues.length - 3]),
          point: parseInt(rowValues[rowValues.length - 1]),
          last5Matches: last5Matches,
        };


        if (!isNaN(parseInt(teamData.ranking))) {
          premierLeagueData.push(teamData);
        }
        ranking += 1;

      }
      await browser.close();

      return premierLeagueData;
    } catch (err) {
      console.error('Error fetching websites : ', err);
    }
  },

};