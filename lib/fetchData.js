
const fetch = require('node-fetch');

const fetchStats = function(collectiveUrl) {
  return fetch(`${collectiveUrl}.json`, { timeout: 1500 })
  .then(res => res.json())
  .then((json) => {
    const {
      currency,
      balance,
      yearlyIncome,
      backersCount,
      contributorsCount
    } = json;

    return {
      currency,
      balance,
      yearlyIncome,
      backersCount,
      contributorsCount
    };
  })
  .catch(e => null);
}

const fetchLogo = function(logoUrl) {
  if (!logoUrl.match(/^https?:\/\//)) {
    return "";
  }
  return fetch(logoUrl, { timeout: 1500 })
    .then(res => {
      if (res.status === 200 && res.headers.get('content-type').match(/^text\/plain/)) return res.text();
      else return "";
    })
    .catch(e => null);
}

module.exports = {
  fetchLogo, fetchStats
};