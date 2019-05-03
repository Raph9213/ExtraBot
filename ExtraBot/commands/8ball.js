const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    let username = (message.member.nickname) ? message.member.nickname : message.author.username;

    if(!args[0]) return require('../error.js').usage(message, config, 'Veuillez entrer une question !', commandfile);

    let replies = [
        "il est certain !",
        "c'est décidément sur.",
        "sans aucun doute.",
        "oui, j'en suis sur et certain !",
        "probablement...",
        "oui !",
        "non !",
        "des signes me font dire oui...",
        "demandez à nouveau plus tard :\\",
        "mieux vaut ne pas te le dire maintenant...",
        "je ne peux pas prédire maintenant.",
        "concentrez-vous et demandez à nouveau !",
        "ne compte pas la dessus.",
        "ma réponse est non.",
        "mes sources disent que non...",
        "oh... J'en doute !"
    ];

    let result = Math.floor((Math.random() * replies.length));

    var embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer, message.author.displayAvatarURL)
        .setTimestamp()
        .addField(args.join(' '), replies[result].charAt(0).toUpperCase()+replies[result].substr(1, replies[result].length));

    message.channel.send(embed);
}

module.exports.help = {
    name:"8ball",
    desc:"Tire une réponse aléatoire pour répondre à vos questions !",
    usage:"8ball [question]",
    group:"fun",
    examples:"$8ball Suis-je gentil ?"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}