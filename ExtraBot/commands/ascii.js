const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    const figlet = require('figlet');

    if(!args[0]) return require('../error.js').usage(message, config, 'Vous devez entrer un message !', commandfile);
    
    if(args.join(' ').length > 20){
        return require('../error.js').usage(message, config, 'Trop de caractères !', commandfile);
    }
    figlet(args.join(' '), function(err, rdata) {
        if (err) {
            message.reply('une erreur est survenue pendant la conversion...');
            return;
        }
        message.channel.send('```' + rdata + '```');
    });
}

module.exports.help = {
    name:"ascii",
    desc:"Ecrit votre message en ascii !",
    usage:"ascii [message]",
    group:"fun",
    examples:"$ascii Bonjour :O"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}