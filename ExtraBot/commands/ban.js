const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var member = message.mentions.members.first();
    if(!member) return require('../error.js').usage(message, config, 'Vous devez mentionner un membre !', commandfile);
    var raison = args.slice(1).join(' ');
    if(!raison) raison = 'pas de raison donnée';
    member.send('Vous venez d\'être banni du serveur **'+message.guild.name+'** par **'+message.author.username+"** pour **"+raison+'** !');
    var embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', 'Membre banni !');
    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Echec !', 'Une erreur est survenue. Ai-je bien les permissions de bannir ce membre ?');
    member.ban(raison).then( () => 
        message.channel.send(embed)
    ).catch(err => message.channel.send(tembed));

}

module.exports.help = {
    name:"ban",
    desc:"Banni un membre du serveur !",
    usage:"ban [@membre] (raison)",
    group:"modération",
    examples:"$ban @Raph9213#9213 Spam"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    disabled:"false",
    owner:"false"
}