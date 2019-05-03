const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var ms = require('ms');

    var quickdb = require('quick.db');
    quickdb.init('./raph.sqlite');
    var unmutes = new quickdb.table('unmutes');

    var user = message.mentions.members.first();
    if(!user) return require('../error.js').usage(message, config, 'Mentionne un membre !', commandfile);

    var time = args[1];
    if(!time || isNaN(ms(time))) return require('../error.js').usage(message, config, 'Tu dois préciser un temps valide !', commandfile);
    
    var reason = args.slice(2).join(' ');
    if(!reason) reason = 'Pas de raison donnée';

    user.send(`Tu viens d'être mute sur ${message.guild.name} par ${message.author.username} pendant ${time} pour ${reason} !`);

    var tembed = new Discord.RichEmbed()
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()
        .addField('Succès !', `**${user.user.username}#${user.user.discriminator}** est mute pendant **${time}** pour **${reason}**`);
    message.channel.send(tembed);
    
    var mute_object = {
        "member_id":user.id,
        "guild_id":message.guild.id
    }

    var ftime = Date.now()+ms(time);
    ftime = Math.floor(ftime / 1000);
    ftime = String(ftime);
    
    var cdata = unmutes.get(ftime);
    if(!cdata) unmutes.set(ftime, []);
    unmutes.push(ftime, mute_object);

    message.guild.channels.forEach(ch => ch.overwritePermissions( user.user, { SEND_MESSAGES: false }));
    
}

module.exports.help = {
    name:"mute",
    desc:"Mute le membre pendant un temps donné !",
    usage:"mute [@membre] [temps] [raison]",
    group:"modération",
    examples:"$mute @Androz#2452 10m Spam"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}