const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var ms = require('ms');

    var to_delete;

    message.delete();
    
    if(!args[0]) return require('../error.js').usage(message, config, 'Vous devez entrer un nombre de messages à supprimer !', commandfile);

    if(isNaN(args[0]) == true) return require('../error.js').usage(message, config, 'Nombre de messages invalide !', commandfile);

    if(args[0] == "0") return require('../error.js').usage(message, config, 'Impossible de supprimer 0 message !', commandfile);

    let messageSupprimer = parseInt(args[0]);

    if(messageSupprimer > 99) messageSupprimer = 99;

    let messages = await message.channel.fetchMessages({limit: 100});

    if(message.mentions.members.size > 0) {
        messages = messages.array().filter(m=>m.author.id === message.mentions.members.first().id);
        messages.length = messageSupprimer;
    } else {
        messages = messages.array();
        messages.length = messageSupprimer + 1;
    }

    message.channel.bulkDelete(messages);

    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', args[0]+ ' messages de **'+message.mentions.members.first().user.username+'#'+message.mentions.members.first().user.discriminator+'** supprimés !');

    var embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', args[0]+ ' messages supprimés !');

    if(message.mentions.members.size > 0) message.channel.send(message.channel.send(tembed)).then(m =>{
        setTimeout(function(){
            m.delete();
        }, ms('2s'));
    })
    else message.channel.send(embed).then(m =>{
        m.delete();
    }, ms('2s'));
}

module.exports.help = {
    name:"clear",
    desc:"Supprime un nombre de messages dans un temps donné !",
    usage:"clear [nombre] (@membre)",
    group:"modération",
    examples:"$clear 40\n$clear 20 @Raph9213#9213"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}