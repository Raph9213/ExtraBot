const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {
    var fs = require('fs');
    var game = args.join(' ');
    if(!game) return require('../error.js').usage(message, config, 'Vous devez entrer un jeu !', commandfile);
    config.game = game;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    client.user.setActivity(config.game);
    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', 'Jeu mis à jour !');
    message.channel.send(tembed);
}

module.exports.help = {
    name:"setplay",
    desc:"Change le jeu du bot !",
    usage:"setplay [nouveau jeu]",
    group:"owner",
    examples:"$setplay modérer !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}