const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {
    
    var ms = require('ms');
    
    var embed = new Discord.RichEmbed()
        .setAuthor('Invitations')
        .addField('Invitez le bot sur votre propre serveur !', 'Génération...')
        .addField('Serveur Support', 'Génération...')
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp();

    var new_embed = new Discord.RichEmbed()
        .setAuthor('Invitations')
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp();

    client.generateInvite('ADMINISTRATOR').then(invite =>{
        new_embed.addField('Invitez le bot sur votre propre serveur !', invite)
    });

    client.channels.get('550815796423819284').createInvite({
        maxAge : '0'
    }).then(invite =>{
        new_embed.addField('Serveur Support', invite.url)
    });

    message.channel.send(embed).then(m =>{
        setTimeout(function(){
            m.edit(new_embed);
        }, ms('1.5s'));
    });

}

module.exports.help = {
    name:"invite",
    desc:"Obtenez l'invitation du bot et son support !",
    usage:"invite",
    group:"général",
    examples:"$invite"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}