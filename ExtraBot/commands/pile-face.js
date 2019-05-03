const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    if(!args[0]) return require('../error.js').usage(message, config, 'Tape '+config.prefix+ 'pile-face [pile/face] !', commandfile);

    var p_o_f = args[0]; // Retourne "Pile" ou "Face";

    p_o_f = p_o_f.toLowerCase();

    if(p_o_f !== "pile" && p_o_f !== "face"){
        return require('../error.js').usage(message, config, 'Tape '+config.prefix+ 'pile-face [pile/face] !', commandfile);
    }

    // 1 = pile | 2 = face
    min = Math.ceil(1);
    max = Math.floor(3);

    let result = Math.floor(Math.random() * (max - min)) + min;

    //Si le result est pile
    if(result === 1 && p_o_f === "pile"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Bravo ! Vous avez fait Pile et vous avez gagné !')
            .addField("Votre Choix", 'Pile')
            .addField("Résultat", 'Pile')
            .setColor(config.color)
        message.channel.send(good_embed);
        
    }
    if(result === 1 && p_o_f === "face"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Dommage ! Vous avez fait Pile et vous avez perdu !')
            .addField("Votre Choix", 'Face')
            .addField("Résultat", 'Pile')
            .setColor(config.color)
        message.channel.send(good_embed);
        
    }
    //Si result est face
    if(result === 2 && p_o_f === "face"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Bravo ! Vous avez fait Face et vous avez gagné !')
            .addField("Votre Choix", 'Face')
            .addField("Résultat", 'Face')
            .setColor(config.color)
        message.channel.send(good_embed);
        
    }
    if(result === 2 && p_o_f === "pile"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Dommage ! Vous avez fait Face et vous avez perdu !')
            .addField("Votre Choix", 'Pile')
            .addField("Résultat", 'Face')
            .setColor(config.color)
        message.channel.send(good_embed);
        
    }
}

module.exports.help = {
    name:"pile-face",
    desc:"Tire aléatoirement pile ou face !",
    usage:"pile-face [pile/face]",
    group:"fun",
    examples:"$pile-face pile\n$pile-face face "
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}