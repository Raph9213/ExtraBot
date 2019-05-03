const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var ms = require('ms');

    var the_name = args[0];

    if(!the_name) return require('../error.js').usage(message, config, 'Entrez un nom de réaction !', commandfile);

    var the_emote = message.guild.emojis.find(e => e.name === the_name);

    if(!the_emote) the_emote = client.emojis.find(e => e.name === the_name);

    if(!the_emote) return require('../error.js').usage(message, config, 'Aucun émoji ne porte le nom "'+the_name+'" sur mes serveurs !', commandfile);

    message.delete();

    if(!args[1]){
        setTimeout(function(){
            message.channel.fetchMessages({ limit: 1 }).then(messages => {
                var the_message = messages.first();
                the_message.react(the_emote).catch(err =>{
                    return message.reply('une erreur est survenue...');
                });
            }).catch(err => {
                return message.reply('pas de message dans ce salon...');
            });
        }, ms('1.5s'));
    }
    if(args[1] && !args[2]){
        if(isNaN(args[1])) return message.reply('entre une ID de salon valide !');
        var the_channel = client.channels.get(args[1]);
        if(!the_channel) return message.reply('le salon avec comme ID `'+args[1]+'` n\'a pas été trouvé...');
        setTimeout(function(){
            the_channel.fetchMessages({ limit: 1 }).then(messages => {
                var the_message = messages.first();
                the_message.react(the_emote).catch(err =>{
                    return message.reply('une erreur est survenue...');
                });
            }).catch(err =>{
                return message.reply('pas de message dans ce salon...');
            });
        }, ms('1.5s'));
    }
    if(args[1] && args[2]){
        if(isNaN(args[1])) return require('../error.js').usage(message, config, 'Entre une ID de channel valide !', commandfile);
        if(isNaN(args[2])) return require('../error.js').usage(message, config, 'Entre une ID de message valide !', commandfile);
        var the_channel = client.channels.get(args[1]);
        if(!the_channel) return require('../error.js').usage(message, config, 'le salon avec comme ID `'+args[1]+'` n\'a pas été trouvé...', commandfile);
        setTimeout(function(){
            the_channel.fetchMessage(args[2]).then(m => {
                m.react(the_emote);
            }).catch(err =>{
                return message.reply('le message avec l\'ID `'+args[2]+'` n\'a pas été trouvé...');
            });
        }, ms('1.5s'));
        
    }
}

module.exports.help = {
    name:"react",
    desc:"Ajoute une réaction au message !",
    usage:"react [reaction] (id du salon) (id du message)",
    group:"modération",
    examples:"$react gg\n$react gg 552954373303697410"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}