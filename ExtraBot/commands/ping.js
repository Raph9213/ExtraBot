const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    message.channel.send('Pong ! Ma latence est de `' + `x` + '` ms !').then(m => {
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', 'Pong ! Ma latence est de `' + `${Date.now() - m.createdTimestamp}` + '` ms !');
        m.edit(tembed);
    });
    
}

module.exports.help = {
    name:"ping",
    desc:"Obtenez la latence du bot !",
    usage:"ping",
    group:"général",
    examples:"$ping"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}