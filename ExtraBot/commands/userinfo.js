const Discord = require("discord.js");

module.exports.run = async (message, args, client, config) => {

    var the_member = message.mentions.members.first();

    if(!args[0]) the_member = message.member;

    let pseudo = the_member.user.username;
    let tag = the_member.user.discriminator;
    let date_join = printDate(the_member.joinedAt, true);
    let lastmsg = the_member.lastMessage;
    let id = the_member.id;
    let nickname = the_member.nickname;
    let avatar = the_member.avatarURL;
    let date_created = printDate(the_member.user.createdAt, true);
    let salon = (the_member.voiceChannelID) ? 'Connecté dans ' + message.guild.channels.get(the_member.voiceChannelID).name :'Non connecté';

    if(!nickname) nickname = 'Pas de surnom';
    if(!lastmsg) lastmsg = 'Ce membre n\'a jamais envoyé de message.';
    let jeu = the_member.presence.game;
    if(!jeu) jeu = 'Pas de jeu';
    let status = the_member.presence.status;
    if(status === "dnd") status = 'Ne pas déranger';
    if(status === "idle") status = 'Inactif - AFK ';
    if(status === "online") status = 'En ligne';
    if(status === "offline") status = 'Déconnecté';

    let embed = new Discord.RichEmbed()
        .setAuthor('Informations sur ' + pseudo)
        .setThumbnail(avatar)
        .setColor(config.color)
        .addField('Pseudo', pseudo, true)
        .addField('Tag', tag, true)
        .addField('Surnom', nickname, true)
        .addField('Id', id, true)
        .addField('Création Compte', date_created, true)
        .addField('Dernier message', lastmsg, true)
        .addField('Connexion à un salon vocal', salon, true)
        .addField('Jeu', jeu, true)
        .addField('Statut', status, true)
        .addField('Date de join', date_join)
        .setFooter(config.footer, avatar)

    message.channel.send(embed);
    

    function printDate(pdate, displayh){
        var monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];

        var day = pdate.getDate();
        var monthIndex = pdate.getMonth();
        var year = pdate.getFullYear();
        var hour = pdate.getHours();
        var minute = pdate.getMinutes();

        var thedate;
        if(displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
        }
        if(!displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year
        }

        return thedate;
    }
}

module.exports.help = {
    name:"userinfo",
    desc:"Affiche des informations sur un membre !",
    usage:"userinfo [@membre]",
    group:"utils",
    examples:"$userinfo @Raph9213#9213"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}