const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    var member = message.mentions.members.first() || message.member;

    var embed = new Discord.RichEmbed()
        .setAuthor('Avatar de '+member.user.username)
        .setImage(member.user.displayAvatarURL)
        .setColor(config.color)
        .setFooter(config.footer)
    message.channel.send(embed);

}

module.exports.help = {
    name:"avatar",
    desc:"Affiche en grand la photo de profil d\'un membre !",
    usage:"avatar [@membre]",
    group:"fun",
    examples:"$avatar @Raph9213#9213"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}