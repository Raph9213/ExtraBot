
module.exports.usage = (message, config, msg, cmd) => {

    var disc = require('discord.js');
    var embed = new disc.RichEmbed()
        .setColor(0xFF0000)
        .setFooter(config.footer+' • '+cmd.help.name)
        .setTimestamp()
        .addField('Erreur', msg);
    message.channel.send(embed);

}