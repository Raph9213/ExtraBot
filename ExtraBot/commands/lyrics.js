const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {
    
    var song_name = args.join(' ');
    if(!song_name) return require('../error.js').usage(message, config, 'Vous devez entrer un titre !', commandfile);

    song_name.toLowerCase()
    .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
    .split(" ").join("%20");

    var axios = require('axios');
    var cheerio = require('cheerio');

    var embed = new Discord.RichEmbed()
        .setAuthor('Paroles de '+song_name)
        .setColor(config.color)
        .setFooter(config.footer)

    axios.get(`https://www.musixmatch.com/search/${song_name}`).then(async(result) => {
    
        let $ = await cheerio.load(result.data);
        let link = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

            await axios.get(link).then(async(res) => {

                let $$ = await cheerio.load(res.data);
                let lyrics = await $$("p[class=\"mxm-lyrics__content \"]").text();

                if(lyrics.length > 2048) {
                    lyrics = lyrics.substr(0, 2031);
                    lyrics = lyrics + `\n**Et plus...** (https://www.musixmatch.com/search/${song_name})[Cliquez ici pour la suite]`;
                } else if(lyrics.length === 0) {
                    return require('../error.js').usage(message, config, 'Aucune paroles trouvées pour `'+song_name+'` !', commandfile);
                }

                embed.setDescription(lyrics);
                message.channel.send(embed);

            }).catch((err) => {
                if(err) return require('../error.js').usage(message, config, 'Une erreur est survenue lors de la recherche des paroles pour `'+song_name+'` !', commandfile);
            });

    }).catch((err) => {
        if(err)return require('../error.js').usage(message, config, 'Une erreur est survenue lors de la recherche des paroles pour `'+song_name+'` !', commandfile);
    });

    
}


module.exports.help = {
    name:"lyrics",
    desc:"Envoie les paroles d'une chanson !",
    usage:"lyrics [nom]",
    group:"fun",
    examples:"$lyrics Skyfall"
}


module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}