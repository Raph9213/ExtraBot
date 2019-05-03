const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfilee) => {

    if(args[0]){

        if(args[0] === 'play'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : play")
                .addField('Utilisation : ', config.prefix+'play (nom chanson)', true)
                .addField('Exemple(s) : ', config.prefix+'play Major Lazer', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Joue de la musique !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }

        if(args[0] === 'pause'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : play")
                .addField('Utilisation : ', config.prefix+'pause', true)
                .addField('Exemple(s) : ', config.prefix+'pause', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Je mets pause !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'resume'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : resume")
                .addField('Utilisation : ', config.prefix+'resume', true)
                .addField('Exemple(s) : ', config.prefix+'resume', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Je reprends la musique !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'queue'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : queue")
                .addField('Utilisation : ', config.prefix+'queue', true)
                .addField('Exemple(s) : ', config.prefix+'queue', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Affiche la liste d\'attente !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'skip'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : skip")
                .addField('Utilisation : ', config.prefix+'skip', true)
                .addField('Exemple(s) : ', config.prefix+'skip', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Je saute la chanson !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'np'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : np")
                .addField('Utilisation : ', config.prefix+'np', true)
                .addField('Exemple(s) : ', config.prefix+'np', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Now playing, affiche la chanson en cours de lecture !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'volume'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : volume")
                .addField('Utilisation : ', config.prefix+'volume [1/100]', true)
                .addField('Exemple(s) : ', config.prefix+'volume 90', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Change mon volume !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'join'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : join")
                .addField('Utilisation : ', config.prefix+'join', true)
                .addField('Exemple(s) : ', config.prefix+'join', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Je rejoins votre salon !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }
        if(args[0] === 'leave'){
            /* Génération de l'embed */
            var group_embed = new Discord.RichEmbed()
                .setAuthor("Aide : leave")
                .addField('Utilisation : ', config.prefix+'leave', true)
                .addField('Exemple(s) : ', config.prefix+'leave', true)
                .addField('Groupe : ', 'Musique', true)
                .addField('Description : ', 'Je quitte votre salon !', true)
                .setColor(config.color)
                .setFooter(config.footer)

            return message.channel.send(group_embed);
        }


        /* Recherche de la commande */
        let commandfile = client.commands.get(args[0]);
        if(!commandfile) return require('../error.js').usage(message, config, 'La commande `' + args[0] +'` est introuvable !', commandfilee);

        /* Recherche du groupe */
        var the_group = commandfile.help.group.charAt(0).toUpperCase() + commandfile.help.group.substring(1).toLowerCase();
        /* Recherche des exemples */
        var examples = commandfile.help.examples.replace(/[$_]/g,config.prefix);

        /* Génération de l'embed */
        var group_embed = new Discord.RichEmbed()
            .setAuthor("Aide : " + commandfile.help.name)
            .addField('Utilisation : ', config.prefix+commandfile.help.usage, true)
            .addField('Exemple(s) : ', examples, true)
            .addField('Groupe : ', the_group, true)
            .addField('Description : ', commandfile.help.desc, true)
            .setColor(config.color)
            .setFooter(config.footer)

        /* Vérifications et ajouts des paramètres */
        if(commandfile.settings.permissions !== "false") group_embed.addField('Permissions : ', `\`${commandfile.settings.permissions}\`` , true) 
        if(commandfile.settings.disabled === "true") group_embed.setDescription('Cette commande est actuellement désactivée', true); 
        if(commandfile.settings.owner === "true") group_embed.setDescription('Seul `'+owner.user.username+'#'+owner.user.discriminator+'` peut effectuer cette commande !', true);

        /* Envoi de l'embed */
        return message.channel.send(group_embed);
    }

    var help_embed = new Discord.RichEmbed()
        .setDescription('Pour avoir de l\'aide sur une commande tapez `' + config.prefix + 'help <commande>` !')
        .setColor(config.color)
        .setFooter(config.footer)
        .setTimestamp()

    var groups = [];
    var all_nb_cmd = 0;
    client.commands.forEach(element => {
        all_nb_cmd++;
        _the_group = element.help.group;
        if(groups.indexOf(_the_group) < 0){
            groups.push(_the_group);
            var current_commands = "";
            var nb_cmd = 0;
            client.commands.forEach(commande => {
                if(commande.help.group === _the_group){
                    current_commands += ' `'+commande.help.name+'`';
                    nb_cmd++;
                }
            });
            current_commands = current_commands.replace(/[' '_]/g,', ');
            current_commands = current_commands.substr(1);
            _the_group = _the_group.charAt(0).toUpperCase() + _the_group.substring(1).toLowerCase();
            if(nb_cmd > 0){
                var commands_nb = nb_cmd;
                help_embed.addField(_the_group + ' - ('+commands_nb+')', current_commands);
            }
        }
    });
    help_embed.addField('Musique - (9)', '`play`, `pause`, `resume`, `queue`, `skip`, `np`, `volume`, `join`, `leave`')
    var total = (all_nb_cmd) + 9;
    help_embed.setAuthor('Liste des commandes - (' + total + ')');
    message.channel.send(help_embed);

}

module.exports.help = {
    name:"help",
    desc:"Affiche l'aide du bot",
    usage:"help (commande)",
    group:"général",
    examples:"$help\n$help ban"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}