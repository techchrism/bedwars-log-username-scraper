const fs = require('fs').promises;
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function getUniquePlayers()
{
    const kills = JSON.parse(await fs.readFile('./data/kills.json', 'utf8'));
    const players = [];
    for(const kill of kills)
    {
        if(!players.includes(kill.killer))
        {
            players.push(kill.killer);
        }
        if(!players.includes(kill.killed))
        {
            players.push(kill.killed);
        }
    }
    return players;
}

async function saveData(username)
{
    const data = await (await fetch(`https://plancke.io/hypixel/player/stats/${username}`)).text();
    await fs.writeFile(`./data/pages/${username}.html`, data);
}

async function saveAllPlayers()
{
    const players = JSON.parse(await fs.readFile('./data/players.json', 'utf8'));
    let current = 0;
    for(const player of players)
    {
        current++;
        console.log(`${current} / ${players.length} - ${player}`);
        await saveData(player);
    }
}

async function parsePlayerData(file)
{
    const body = await fs.readFile(file, 'utf8');
    const $ = cheerio.load(body);
    
    const bedwars = $('#stat_panel_BedWars .list-unstyled');
    const overall = $('#stat_panel_BedWars tbody tr').last();
    
    const level = Number(bedwars.children().eq(2).text().substring('Level: '.length).replace(/,/g, ''));
    const wins = Number(overall.children().eq(7).text().replace(/,/g, ''));
    const losses = Number(overall.children().eq(8).text().replace(/,/g, ''));
    const bedsBroken = Number(overall.children().eq(10).text().replace(/,/g, ''));
    const name = $('.card-box').first().children().eq(1).text().trim();
    
    return {name, wins, losses, bedsBroken, level};
}

async function parseAllPlayers()
{
    const files = await fs.readdir('./data/pages');
    const stats = [];
    for(const file of files)
    {
        stats.push(await parsePlayerData(`./data/pages/${file}`));
    }
    return stats;
}

(async () =>
{
    const stats = await parseAllPlayers();
    await fs.writeFile('./data/stats.json', JSON.stringify(stats, null, 4));
})();
