const Discord = require("discord.js");

module.exports.run = async (message, args, client, config, owner, commandfile) => {

    var texte = args[0];
    if(!texte) return require('../error.js').usage(message, config, 'Entre un mot !', commandfile);

    var the_request = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+texte;

    var file_name = texte;

    message.channel.send('Génération de votre QR pour "' + texte + '" en cours...').then(m => {
        m.edit('QR code généré !');
    })

    message.channel.send({
        files: [{
          attachment: the_request,
          name: `${file_name}.png` //.gif si c'est un gif
        }]
    });

}

module.exports.help = {
    name:"qrcode",
    desc:"Génère un QrCode scannable contenant votre mot !",
    usage:"qrcode [mot]",
    group:"fun",
    examples:"$qrcode Bonjour"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}