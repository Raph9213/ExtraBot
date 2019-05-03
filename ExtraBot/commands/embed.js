const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var params_array = args.join(' ').split(' | ');
    var [color,title,msg,footer] = params_array;
    if(!color || !title || !msg || !footer) return require('../error.js').usage(message, config, 'Il manque des paramètres ! Nous vous conseillons de taper `'+config.prefix+'help embed` !', commandfile); 
   
    var embed = new Discord.RichEmbed()
        .setAuthor(title)
        .setDescription(msg)
        .setColor(color)
        .setFooter(footer)
    
    message.channel.send(embed).then( () => message.delete());

}

module.exports.help = {
    name:"embed",
    desc:"Générez un embed personnalisé !",
    usage:"embed color | title | texte | footer",
    group:"administration",
    examples:"$embed #FF0000 | Bonjour tout le monde ! | Nous vous conseillons de copier l'exemple pour comprendre le fonctionnement de la commande ! | Extrabot "
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}