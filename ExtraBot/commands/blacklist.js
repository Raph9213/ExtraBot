const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    
    var quickdb = require('quick.db');
    quickdb.init('./raph.sqlite');
    var blacklist = new quickdb.table('blacklist');

    var status = args[0];
    if(!status) return require('../error.js').usage(message, config, 'Vous devez choisir une des trois options !', commandfile);

    if(status === 'list'){
        var array = blacklist.get('words');
        var msg = '__**Affichage des mots blacklist :**__\n\n';
        var embed = new Discord.RichEmbed()
            .setAuthor('Blacklist')
            .setColor(config.color)
            .setFooter(config.footer);
        if(array.length > 0){
            array.forEach(word => {
                msg += '• '+word+'\n';
            })
        } else {
            msg += 'Aucun mot actuellement enregistré !';
        }
        embed.setDescription(msg);
        message.channel.send(embed);
    }

    if(status === 'add'){
        var array = blacklist.get('words');
        var word = args[1];
        if(!word) return require('../error.js').usage(message, config, 'Tu dois entrer un mot !', commandfile);
        if(array.length > 0){
            var isAlreadyInBlacklist = false;
            array.forEach(tword => {
                if(tword === word) isAlreadyInBlacklist = true;
            });
            if(isAlreadyInBlacklist) return require('../error.js').usage(message, config, 'Ce mot est déjà enregistré !', commandfile);
        }
        blacklist.push('words', word);
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', 'Mot enregistré dans la blacklist !');
        message.channel.send(tembed);
    }

    if(status === 'remove'){
        var array = blacklist.get('words');
        var word = args[1];
        if(!word) return require('../error.js').usage(message, config, 'Tu dois entrer un mot !', commandfile);
        if(array.length > 0){
            var isAlreadyInBlacklist = false;
            array.forEach(tword => {
                if(tword === word) isAlreadyInBlacklist = true;
            });
            if(!isAlreadyInBlacklist) return require('../error.js').usage(message, config, 'Ce mot n\'est pas enregistré', commandfile);
        }
        var narray = [];
        array.forEach(mot => {
            if(mot !== word) narray.push(mot);
        });
        blacklist.set('words', narray);
        var tembed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(config.footer)
            .setTimestamp()
            .addField('Succès !', 'Mot supprimé de la blacklist !');
        message.channel.send(tembed);
    }

}

module.exports.help = {
    name:"blacklist",
    desc:"Gérez la blacklist tel que le vous le souhaitez !",
    usage:"blacklist [list/add/remove] (mot)",
    group:"owner",
    examples:"$blacklist list\n$blacklist add vache\n$blacklist remove vache"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}