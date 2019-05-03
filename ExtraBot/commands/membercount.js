const Discord = require("discord.js");

module.exports.run = async (message, args, bot, config, owner, commandfile) => {
    
    var quickdb = require('quick.db');
    quickdb.init('../raph.sqlite');
    var membercount = new quickdb.table('membercount');

    var id = args[0];
    var channel = message.guild.channels.get(id);
    if(!channel) return require('../error.js').usage(message, config, 'Aucun salon trouvé avec cet id !', commandfile);
    membercount.set(message.guild.id, channel.id);

    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', 'Membercount activé !');
    message.channel.send(tembed)
}

module.exports.help = {
    name:"membercount",
    desc:"Défini un salon pour afficher le nombre de membres !",
    usage:"membercount [id]",
    group:"administration",
    examples:"$membercount 93930782798729"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}