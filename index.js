const fs = require('fs').promises;
const readLogs = require('./readLogs');

(async () =>
{
    const players = await readLogs();
    await fs.writeFile('./data/players.json', JSON.stringify(players, null, 4));
    console.log(`Got ${players.length} players!`);
})();

