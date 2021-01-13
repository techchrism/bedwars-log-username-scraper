const fs = require('fs');
const readline = require('readline');

const killMessages = [
    new RegExp('\\[CHAT\\] (.+) was killed by (.+?)\\.'),
    new RegExp('\\[CHAT\\] (.+) was knocked into the void by (.+?)\\.')
];

async function readLog(logPath)
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

async function readLogs()
{
    const files = await fs.promises.readdir('./data/logs');
    const kills = [];
    for(const file of files)
    {
        const logKills = await readLog(`./data/logs/${file}`);
        for(const kill of logKills)
        {
            kills.push(kill);
        }
    }
    return kills;
}

module.exports = readLogs;
