const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {
    
    var quickdb = require('quick.db');
    quickdb.init('./raph.sqlite');
    var warns_db = new quickdb.table('warns');

    var member = message.mentions.members.first();
    if(!member) return require('../error.js').usage(message, config, 'Vous devez mentionner un membre !', commandfile);
    var raison = args.slice(1).join(' ');
    if(!raison) return require('../error.js').usage(message, config, 'Vous devez préciser une raison !', commandfile);
    var warns = warns_db.get(message.guild.id+'.'+member.id);
    if(!warns){
        warns_db.set(message.guild.id+'.'+member.id, 0);
        warns = 1;
    }
    if(warns > 5){
        warns_db.set(message.guild.id+'.'+member.id, 0);
        member.ban('Plus de 5 warns');
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', member+' avait plus de 5 warns, il vient d\'être banni.');
        message.channel.send(tembed);
    } else {
        warns_db.add(message.guild.id+'.'+member.id, 1);
        member.send('Vous venez d\'être averti par **'+message.author.username+'** sur le serveur **'+message.guild.name+'** pour **'+raison+'**.\nC\'est votre `'+String(parseInt(warns)+1)+'`eme avertissement. Au bout du 5eme, vous serez banni.');
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', member+' vient d\'être averti !');
        message.channel.send(tembed);
    }
    
}

module.exports.help = {
    name:"warn",
    desc:"Averti un membre en messages privés (plus de 5 warns résulte d\'un ban.)",
    usage:"warn [@membre] [raison]",
    group:"modération",
    examples:"$warn @Raph9213#9213 Spam"
}

module.exports.settings = {
    permissions:"KICK_MEMBERS",
    disabled:"false",
    owner:"false"
}