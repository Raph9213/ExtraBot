const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    var quickdb = require('quick.db');
    quickdb.init('./raph.sqlite');
    var raidmode_db = new quickdb.table('raidmode');

    var status = raidmode_db.get(message.guild.id);
    if(status === 'active'){
        raidmode_db.set(message.guild.id, 'null');
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', 'Raidmode désactivé !');
        message.channel.send(tembed)
    } else {
        raidmode_db.set(message.guild.id, 'active');
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', 'Raidmode activé !');
        message.channel.send(tembed)
    }
}

module.exports.help = {
    name:"raidmode",
    desc:"Active ou désactive le raidmode !",
    usage:"raidmode",
    group:"administration",
    examples:"$raidmode"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}