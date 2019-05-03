const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    var hour = 3600000;
    var membersToCheck = message.guild.members.filter(m => m.joinedTimestamp > Date.now()-hour);
    if(membersToCheck.size < 1){
        var embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Selfbots', 'Aucun selfbot trouvé !');
        message.channel.send(embed);
    }
    membersToCheck.array();
    var embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Vérification en cours...', 'Temps estimé : '+ConversionMs(2000 * message.guild.channels.size));
    message.channel.send(embed);
    var selfbots = [];
    message.guild.channels.filter(c => c.type === 'text').forEach(c => {
        c.fetchMessages({limit:99}).then(msgs => {
            membersToCheck.forEach(member => {
                if(selfbots.indexOf(member) < 0){
                    var messages = msgs.filter(m => m.author.id === member.id).filter(m => m.createdTimestamp > Date.now()-hour);
                    if(messages.size > 30) selfbots.push(member);
                }
            });
        });
    });
    setTimeout(function(){
        var embed_desc = '';
        selfbots.forEach(selfb => embed += selfb.user.username+'\n');
        var embed = new Discord.RichEmbed()
            .setAuthor('Selfbots')
            .setDescription('Selfbots trouvés : \n\n'+selfbots)
            .setColor(config.color)
            .setFooter(config.footer)
        message.channel.send(embed);
        selfbots.forEach(m => m.ban({reason:'Selfbot', days:1}));
    }, 2000 * message.guild.channels.size);
    
}

module.exports.help = {
    name:"ban-selfbots",
    desc:"Détecte automatiquement les selfbots !",
    usage:"ban-selfbots",
    group:"administration",
    examples:"$ban-selfbots"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}