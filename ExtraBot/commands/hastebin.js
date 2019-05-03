const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    const fetch = require('node-superfetch');

    var content = args.join(' ');
    if(!args[0]) return require('../error.js').usage(message, config, 'Veuillez entrer un message', commandfile);

    fetch.post(`https://hastebin.com/documents`).send(content).then(body => {
        var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', `Contenu posté sur HasteBin !\n\nVotre lien : https://hastebin.com/${body.body.key}`);
        message.channel.send(tembed)
    });

}

module.exports.help = {
    name:"hastebin",
    desc:"Envoyez simplement votre texte sur HasteBin !",
    usage:"hastebin [texte]",
    group:"général",
    examples:"$hastebin Ce message sera envoyé sur HasteBin et un lien vers celui-ci va m'être donné !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}