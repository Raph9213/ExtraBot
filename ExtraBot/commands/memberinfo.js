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

    let embed = new Discord.RichEmbed()
        .setAuthor('Informations sur ' + pseudo)
        .setThumbnail(avatar)
        .setColor(the_member.displayHexColor)
        .addField('Pseudo', pseudo, true)
        .addField('Surnom', nickname, true)
        .addField('Rôle le plus haut', the_member.highestRole, true)
        .addField('Fondateur', (the_member.guild.ownerID === the_member.id ? 'Oui' : 'Non'), true)
        .addField('Administrateur', (the_member.hasPermission('ADMINISTRATOR') ? 'Oui' : 'Non'), true)
        .addField('Modérateur', (the_member.hasPermission('MANAGE_MESSAGES') ? 'Oui' : 'Non'), true)
        .addField('Rôles', (the_member.roles.size < 10 ? the_member.roles.map(r => r).join(", ")  : "Trop de rôles à afficher (" + the_member.roles.size + ")"))
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
    name:"memberinfo",
    desc:"Affiche des informations sur un guildmember !",
    usage:"memberinfo [@membre]",
    group:"utils",
    examples:"$memberinfo @Raph9213#9213"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}