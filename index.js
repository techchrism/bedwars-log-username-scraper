const fs = require('fs').promises;
const readLogs = require('./readLogs');

(async () =>
{
    const kills = await readLogs();
    await fs.writeFile('./data/kills.json', JSON.stringify(kills, null, 4));
    console.log(`Got ${kills.length} kills!`);
})();

