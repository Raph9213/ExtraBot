const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var msg_to_say = args.join(' ');
    if(!msg_to_say) return require('../error.js').usage(message, config, 'Vous devez entrer un message !', commandfile);
    message.delete();
    message.channel.send(msg_to_say);

}

module.exports.help = {
    name:"say",
    desc:"Envoie un message via le bot !",
    usage:"say [message]",
    group:"administration",
    examples:"$say Bonjour"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}