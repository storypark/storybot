const utcToZonedTime = require('date-fns-tz/utcToZonedTime');
const formatTz = require('date-fns-tz/format');
const format = require('date-fns/format');
const add = require('date-fns/add');

const CURRENT_YEAR = new Date().getFullYear();
const MONDAYISED_HOLIDAYS = [ // Don't forget months are indexed from zero 🤡
  new Date(CURRENT_YEAR, 3, 25), // Anzac day
  new Date(CURRENT_YEAR, 5, 7), // Queen's birthday
].map(d => {
  const currentWeekDay = d.getDay();

  // TODO: use math bro
  if (currentWeekDay === 0) { return add(d, { days: 1 }); }
  if (currentWeekDay === 6) { return add(d, { days: 2 }); }

  return d;
});

module.exports = function shouldIRun() {
  if (process.env.SLACK_CHANNEL === '') { return false; }

  const dateInNZST = utcToZonedTime(new Date(), 'Pacific/Auckland');
  const dayOfWeek = dateInNZST.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) { return false; }

  if (MONDAYISED_HOLIDAYS.find(d => {
    return format(d, 'yyyy-MM-dd') === formatTz(dateInNZST, 'yyyy-MM-dd');
  })) { return false; }

  return true;
}