const fs = require('fs');
const readline = require('readline');

const killMessages = [
    new RegExp('\\[CHAT\\] (.+) was killed by (.+?)\\.'),
    new RegExp('\\[CHAT\\] (.+) was knocked into the void by (.+?)\\.')
];
const joinMessage = new RegExp('\\[CHAT\\] (.+) has joined \\(\\d+\\/\\d+\\)!');

async function getKills(logPath)
{
    const kills = [];
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl)
    {
        for(const killMessage of killMessages)
        {
            const matches = killMessage.exec(line);
            if(matches !== null)
            {
                const [,killed, killer] = matches;
                kills.push({killer, killed});
                break;
            }
        }
    }
    return kills;
}

async function getPlayers(logPath)
{
    const players = [];
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl)
    {
        const joinMatch = joinMessage.exec(line);
        if(joinMatch !== null)
        {
            players.push(joinMatch[1]);
        }
    }
    return players;
}

async function readLogs()
{
    const files = await fs.promises.readdir('./data/logs');
    const players = [];
    for(const file of files)
    {
        const logPlayers = await getPlayers(`./data/logs/${file}`);
        for(const player of logPlayers)
        {
            if(!players.includes(player))
            {
                players.push(player);
            }
        }
    }
    return players;
}

function getUniquePlayers(kills)
{
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

module.exports = readLogs;
