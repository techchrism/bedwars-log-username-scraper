const fs = require('fs').promises;

(async () =>
{
    const stats = JSON.parse(await fs.readFile('./data/stats.json', 'utf8'));
    
    let wins = 0;
    let losses = 0;
    let bedsBroken = 0;
    let level = 0;
    
    let highestLevel = 0;
    
    for(const player of stats)
    {
        wins += player.wins;
        losses += player.losses;
        bedsBroken += player.bedsBroken;
        level += player.level;
        
        if(player.level > highestLevel)
        {
            highestLevel = player.level;
        }
    }
    
    console.log(`Wins: ${(wins / stats.length).toFixed(2)}`);
    console.log(`Losses: ${(losses / stats.length).toFixed(2)}`);
    console.log(`Beds broken: ${(bedsBroken / stats.length).toFixed(2)}`);
    console.log(`Level: ${(level / stats.length).toFixed(2)}`);
    console.log(`Highest Level: ${highestLevel}`);
})();
