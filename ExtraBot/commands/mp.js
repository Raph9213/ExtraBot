const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var the_id = args[0];
    if(!the_id) return require('../error.js').usage(message, config, 'entrez une id !', commandfile);
    
    var the_message = args.slice(1).join(' ');
    if(!the_message) return require('../error.js').usage(message, config, 'entrez un message !', commandfile);
    
    client.fetchUser(the_id).then(user => {
        user.send(the_message).then( () => {
            var tembed = new Discord.RichEmbed()
                .setColor(config.color)
                .setFooter(config.footer)
                .setTimestamp()
                .addField('Succès !', 'Message envoyé !');
            message.channel.send(tembed)
        }).catch(err => {
            return require('../error.js').usage(message, config, user.username+' n\'accepte pas mes mps...', commandfile);
        })
    }).catch(err => {
        return require('../error.js').usage(message, config, 'Aucun utilisateur ne possède l\'ID `'+the_id+'` !', commandfile);
    })

}

module.exports.help = {
    name:"mp",
    desc:"Envoyez un mp via le bot !",
    usage:"mp [ID] [message]",
    group:"owner",
    examples:"$mp 453254164798111754 Bonjour !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}