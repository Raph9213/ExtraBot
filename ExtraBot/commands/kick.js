const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    const Discord = require("discord.js");


    var member = message.mentions.members.first();
    if(!member) return require('../error.js').usage(message, config, 'Vous devez mentionner un membre !', commandfile);
    var raison = args.slice(1).join(' ');
    if(!raison) raison = 'pas de raison donnée';
    member.send('Vous venez d\'être expulsé du serveur **'+message.guild.name+'** par **'+message.author.username+"** pour **"+raison+'** !');
    var embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', 'Membre expulsé !');
    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Echec !', 'Une erreur est survenue. Ai-je bien les permissions d\'expulser ce membre ?');
    member.kick(raison).then( () => 
        message.channel.send(embed)
    ).catch(err => message.channel.send(tembed));

}

module.exports.help = {
    name:"kick",
    desc:"Expulse un membre du serveur !",
    usage:"kick [@membre] (raison)",
    group:"modération",
    examples:"$kick @Raph9213#9213 Spam"
}

module.exports.settings = {
    permissions:"KICK_MEMBERS",
    disabled:"false",
    owner:"false"
}