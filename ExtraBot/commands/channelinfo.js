const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var channel = message.mentions.channels.first() || message.guild.channels.get(args[0]);
    if(!channel) return require('../error.js').usage(message, config, 'Veuillez mentionner un salon !', commandfile);
    if(channel.type !== 'text'){
        if(channel.type === 'voice') return require('../error.js').usage(message, config, '**'+channel.name+'** n\'est pas un salon textuel !', commandfile);
        else {
            return require('../error.js').usage(message, config, 'Le type de salon `'+channel.type+'` n\'est pas pris en charge par cette commande.', commandfile);
        }

    }

    var isnsfw = (channel.nsfw) ? 'Oui' : 'Non';
    var cat = (channel.parent) ? channel.parent.name : 'Aucune'
    var top = (channel.topic) ? channel.topic : 'Aucune'

    var embed = new Discord.RichEmbed()
        .setAuthor('Information sur le salon '+channel.name)
        .addField('Nom', channel, true)
        .addField('ID', channel.id, true)
        .addField('NSFW', isnsfw, true)
        .addField('Position', channel.position, true)
        .addField('Description', top, true)
        .addField('Catégorie', cat , true)
        .addField('Utilisateurs', channel.members.size+' membres peuvent lire les messages du **#'+channel.name+'**')
        .setColor(config.color)
        .setFooter(config.footer)
    
    message.channel.send(embed);
}

module.exports.help = {
    name:"channelinfo",
    desc:"Affiche des informations sur le salon !",
    usage:"channelinfo [#channel/ID]",
    group:"utils",
    examples:"$channelinfo #general"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}