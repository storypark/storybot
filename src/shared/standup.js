const shuffle = require('@architect/shared/shuffle');
const utcToZonedTime = require('date-fns-tz/utcToZonedTime');
const formatTz = require('date-fns-tz/format');

const specialCases = [
  ['2021-11-25', "No standup today — there's some kind of all team offsite thing!"],
];

module.exports = function standup(team, userNames) {
  if (!team.standupCaptains) { return null; }
  if (!team.standupMessage) { return null; }

  const dateInNZST = utcToZonedTime(new Date(), 'Pacific/Auckland');
  const c = specialCases.find(([d]) => d === formatTz(dateInNZST, 'yyyy-MM-dd'));
  if (c) { return c[1]; }

  const [main, backup] = shuffle(team.standupCaptains);

  return team.standupMessage(userNames[main], userNames[backup]);
}
