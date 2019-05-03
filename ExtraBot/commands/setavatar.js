const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    var url = args[0];
    if(!url) return message.reply('vous devez entrer une url vers l\'avatar !')
    
    if(checkURL(url)){
        client.user.setAvatar(url).then( () => {
            return message.channel.send('Action correctement effectuée !');
        }).catch(err => {
            return message.channel.send('Une erreur s\'est produite. Soit :\n  - L\'image n\'est pas valide.\n  - Vous avez changé trop de fois l\'avatar et il vous faut patienter avant de pouvoir à nouveau le changer.');
        });
    } else {
        return message.channel.send('URL vers l\'avatar invalide.');
    }

    function checkURL(url) {
        return(url.match(/\.(jpeg|jpg|webp|png)$/) != null);
    }
}

module.exports.help = {
    name:"setavatar",
    desc:"Change la photo de profil du bot !",
    usage:"setavatar [url]",
    group:"owner",
    examples:"$setavatar https://une-image.com"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}