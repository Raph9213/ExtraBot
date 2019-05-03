const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    const translate = require('google-translate-api');

    var Langs = [];

    require('request')('https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20190305T104446Z.c19fdcb6cb199045.235f5d43d1bf746032cccde613c62e87f6bbd96b', { json: true }, function (error, response, body) {
        body.dirs.forEach(l => Langs.push(l));

        if (!args[0]) return require('../error.js').usage(message, config, 'Entrez une langue !', commandfile);
        
        if(args[0] === "langs-list"){
            var nombre = 1;
            var langs_message1 = "**Liste des langues :**\n\n```Css\n";
            var langs_message2 = "```Css\n";
            Langs.forEach(element => {
                if(langs_message1.length > 1900){
                    langs_message2 += '#'+nombre+' - '+element + '\n'
                } else {
                    langs_message1 += '#'+nombre+' - '+element + '\n'
                }
                nombre++;
            });
            langs_message1 += '```';
            langs_message2 += '```';
            message.author.send(langs_message1)
            message.author.send(langs_message2);
            var tembed = new Discord.RichEmbed()
                .setColor(config.color)
                .setFooter(config.footer)
                .setTimestamp()
                .addField('Succès !', 'Langues envoyées en message privé !');
            message.channel.send(tembed);    
        }

        if (!args[1]) return require('../error.js').usage(message, config, 'Vous devez entrer un message !', commandfile);

        let language = args[0].toLowerCase();

        let to_translate = args.slice(1).join(' ');

        let translation;

        if (!Langs.includes(language)) return require('../error.js').usage(message, config, `La traduction \`${language}\` n'existe pas.. La liste des langues : "${config.prefix}translate langs-list" !`, commandfile);

        require('request')('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190305T104446Z.c19fdcb6cb199045.235f5d43d1bf746032cccde613c62e87f6bbd96b&text='+to_translate+'&lang='+language+'&format=plain', { json: true }, function (error, response, body) {
            const embed = new Discord.RichEmbed()
                .setAuthor("Traducteur", client.user.displayAvatarURL)
                .addField(`${language.split('-')[0]}`, `\`\`\`${to_translate}\`\`\``)
                .setColor(config.color)
                .addField(`${language.split('-')[1]}`, `\`\`\`${body.text[0]}\`\`\``);

            return message.channel.send(embed);
        });
    });
}

module.exports.help = {
    name:"translate",
    desc:"Traduit votre texte !",
    usage:"translate [langue] [texte]",
    group:"général",
    examples:"$translate english Bonjour !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}