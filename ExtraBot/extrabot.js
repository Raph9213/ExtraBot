// Connection du client

const Discord = require('discord.js');
const client = new Discord.Client();

const YouTube = require('simple-youtube-api'),
ytdl = require('ytdl-core'),
youtube = new YouTube("AIzaSyBCNMlyaRrxksWtcy-NNJE40Jd_wkmXbI0"),
queue = new Map(),
util = require('util');

const fs = require('fs');
var config = require('./config.json');
const quickdb = require('quick.db');
quickdb.init('./raph.sqlite');

const ms = require('ms');

const raidmode = new quickdb.table('raidmode');
const warns_db = new quickdb.table('warns');
const blacklist_db = new quickdb.table('blacklist');
const unmutes_db = new quickdb.table('unmutes');
const membercount_db = new quickdb.table('membercount');

var CronJob = require('cron').CronJob;

client.login(config.token);
client.commands = new Discord.Collection();

var owner = {
    id:config.raph,
    user:null
}

fs.readdir("./commands/", (err, files) => {
    if(err){
        console.log(err);
    }
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0){
      console.log("Je n'ai trouvé aucune commande...");
      return;
    }
    jsfiles.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      client.commands.set(props.help.name, props);
    });
});

new CronJob('* * * * * *', function() {
    var time = Math.floor(Date.now()/1000);
    time = String(time);
    var cm = unmutes_db.get(time);
    if(cm){
        cm.forEach(unmute => {
            var guild = client.guilds.get(unmute.guild_id);
            if(guild){
                var member = guild.members.get(unmute.member_id);
                if(member){
                    guild.channels.forEach(ch => ch.overwritePermissions( member.user, { SEND_MESSAGES: null }));
                }
            }
        });
    }
}, null, true, "Europe/Paris");

client.on('ready' , () => {

	setInterval(setGame, ms('45s'));

    function setGame(){
        client.user.setActivity(`-help | ${client.guilds.size} serveurs | ExtraBot`);
        setTimeout(function(){
            client.user.setActivity(`-help | ${client.users.size} membres | ExtraBot`);
        }, ms('16s'));
        setTimeout(function(){
            client.user.setActivity(`-help | admin@extrabot.xyz | -help`);
        }, ms('32s'));
	}
	
    client.fetchUser(config.raph).then(user => {
       owner.user = user;
    });
});


client.on('guildCreate', (guild) =>{

    var textu = 0, vocal = 0;

    guild.channels.forEach(element =>{ if(element.type === "text") textu++; if(element.type === "voice") vocal++;});
    
	var the_channel = guild.channels.filter(channel => channel.type === "text");
	
	var new_guild = new Discord.RichEmbed()
		.setAuthor(guild.name, guild.iconURL)
		.setDescription('Serveur '+ guild.name + ' rejoint !')
		.addField('Nombre de membres', guild.memberCount, true)
		.addField('ID', guild.id, true)
		.addField('Fondateur', guild.owner.user.username + '#' + guild.owner.user.discriminator, true)
		.addField('Création', printDateonts(guild.createdTimestamp), true)
		.addField('Salons', textu + ' textuels | ' + vocal + ' vocals', true)
		.setColor(0x009933)
		.setThumbnail(guild.iconURL)
		.setTimestamp();

	var options = { maxAge : 0, reason : "Invitation générée automatiquement par mes soins." };

	the_channel.first().createInvite(options).then(i => new_guild.addField('Lien', '**'+i.url+'**') && client.users.get(owner.user.id).send(new_guild)).catch(err =>  new_guild.addField('Lien', 'Indisponible...') && client.users.get(owner.user.id).send(new_guild));

});

client.on('guildMemberAdd', (member) => {
	var channel = membercount_db.get(member.guild.id);
	if(channel){
		var the_channel = member.guild.channels.get(channel);
		if(the_channel) the_channel.setName('〖👥〗Membres : '+member.guild.memberCount);
	}
});

client.on('guildMemberRemove', (member) => {
	var channel = membercount_db.get(member.guild.id);
	if(channel){
		var the_channel = member.guild.channels.get(channel);
		if(the_channel) the_channel.setName('〖👥〗Membres : '+member.guild.memberCount);
	}
});
// Message du client

client.on('message', async message => { 

    if(message.channel.type === 'dm'){
        if(message.author.id === client.user.id) return;
        var embed = new Discord.RichEmbed()
            .setAuthor(message.author.username+'#'+message.author.discriminator, message.author.displayAvatarURL)
            .addField('Contenu', '**'+message.content+'**')
            .addField('ID Message', message.id, true)
            .addField('ID Auteur', message.author.id, true)
            .addField('ID Salon', message.channel.id, true)
            .setColor(config.color)
            .setFooter(config.footer)
        client.channels.get('552085932270944256').send(embed);
    }

    if(!message.author.client && !message.member.hasPermission('MANAGE_MESSAGES')){
        var isInBlacklist = false;
        blacklist.get('words').forEach(bm => {
            if(message.content.includes(bm)){
                if(isInBlacklist) return;
                message.delete();
                isInBlacklist = true;
                message.channel.send(author+', vous avez entré un mot blacklist ! Veuillez éditer votre message (il vous a été envoyé en privé pour que vous puissiez le copier et le modifier) !');
                return message.author.send('```'+message.content+'```');
            }
        });
    }

    if(raidmode.get(message.guild.id) === 'active' && !message.member.hasPermission('MANAGE_MESSAGES')){
        return message.delete();
    }

    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    let commandfile = client.commands.get(command); // Cherche si la cmd existe dans la collection de cmd

    if(commandfile){
        if(commandfile.settings.permissions !== "false"){
            if(!message.member.hasPermission(commandfile.settings.permissions)) return message.channel.send('Vous ne disposez pas des permissions nécessaires (`'+commandfile.settings.permissions+'`) pour cette commande !');
        }
        if(commandfile.settings.owner === 'true'){
            if(message.author.id !== config.raph && message.author.id !== config.androz) return message.channel.send('Seul `'+owner.user.username+'#'+owner.user.discriminator+'` peut effectuer ces commandes.')
        }
        if(commandfile.settings.disabled === 'true'){
            return message.channel.send('La commande `' + commandfile.help.name + '` est actuellement désactivée.')
        }
        return commandfile.run(message, args, client, config, owner, commandfile);
    }

});



client.on('message', async msg => {

	if (msg.author.bot) return;
	if (!msg.content.startsWith(config.prefix))
		return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(config.prefix.length)

if (command === 'play') {

	const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) 
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: `Connecte toi pour m'écouter !`,
			},
		});

       


		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: `La playlist **${playlist.title}** a été ajouté à la file d\'attente !`,
			},
		});
			
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send({embed: {
						color: 37372,
						title: "Musique",
						description: `__**Résulats les plus cohérents :**__\n\n\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\n\n\nVeuillez indiquer une valeur pour sélectionner l'un des résultats de recherche compris entre 1 et 10.`,
					},
				});
				try {
					var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
						maxMatches: 1,
						time: 10000,
						errors: ['time'],
					});
				} catch (err) {
					console.error(err);
					return msg.channel.send({embed: {
						color: 37372,
						title: "Musique",
						description: `Annulation, temps de réponse écoulé.`,
					},
				});
						
			}
				const videoIndex = parseInt(response.first().content);
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				console.error(err);
				return msg.channel.send({embed: {
					color: 37372,
					title: "Musique",
					description: `J'ai fouillé tout YouTube, rien de correspond à ta recherche :\\`,
				},
		});		
		}
	}
		return handleVideo(video, msg, voiceChannel);
}
}else if (command === 'join') {
	if (!msg.member.voiceChannel) 
		return msg.channel.send('Vous n\'êtes pas dans un canal vocal!');
        	msg.member.voiceChannel.join();
        	msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: `Je rejoins ton salon`,
			},
		});
    	return;
}else if (command === 'leave') {

    let voiceChannel = msg.guild.channels

	if (!msg.member.voiceChannel) 
		return msg.channel.send('Vous n\'êtes pas dans un salon vocal!');
	if (serverQueue) 

    var leave_embed_queue = new Discord.RichEmbed()
    .addField("Musique ", ` Je quitte le channel`)
    .setColor(config.color)
    msg.channel.send({embed: leave_embed_queue});
    
    msg.member.voiceChannel.leave();



    return undefined;



}else if (command === 'skip') {
	if (!msg.member.voiceChannel) 
		return msg.channel.send('Vous n\'êtes pas dans un salon vocal!');
	if (!serverQueue) 
		return msg.channel.send({embed: {
		color: 37372,
		title: "Musique",
		description: `Erreur, aucun titre...`,
	},
});
		
	serverQueue.dispatcher.end('La commande de skip a été utilisée!');
	return undefined;
}else if(command === 'volume'){
	const message = msg.content.trim();
	const command = message.substring(config.prefix.length).split(/[ \n]/)[0].toLowerCase().trim();
	const suffix = message.substring(config.prefix.length + command.length).trim();
	const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

		if (voiceConnection === null) return msg.channel.send({embed: {
			color: 37372,
			title: "Musique",
			description: `Erreur : Pas de musique en cours de lecture`,
		},
	})

		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 100 || suffix < 0) return msg.channel.send({embed: {
			color: 37372,
			title: "Musique",
			description: `Erreur, entre un volume entre 1 et 100.`,
		},
	})

		if(!suffix) return msg.channel.send({embed: {
			color: 37372,
			title: "Musique",
			description: `Erreur, entre un volume entre 1 et 100.`,
		},
	})

		volume_embed = new Discord.RichEmbed()
		.setTitle(`Musique`)
		.setDescription("Volume actuel : " + suffix+"%")
		.setColor(0xe74c3c);

		msg.channel.sendEmbed(volume_embed)

		dispatcher.setVolume((suffix/100));

}else if (command === 'np') {
	if (!serverQueue) 
		return msg.channel.send('Erreur, aucun titre...');
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: `Lecture en cours : **${serverQueue.songs[0].title}**`,
				},
			});
}
else if (command === 'queue') {
	let index = "", titles = "", big_q = "";
    let server = serverQueue;
	let limit = 10;
	let numberOfSongs = !server.songs ? 0 : server.songs.length;
    let numberOfPages = Math.ceil(numberOfSongs/limit);
    let i = 0;
    	if (!serverQueue.songs) {
        	index += `#\n`; titles += `Rien.\n`; big_q = "_ _\n";
        } else {
            let long_queue = server.songs.length > limit;
        	for (i = 0; i < (long_queue ? limit : server.songs.length); i++) {
            	if (i == 0) {
                    index += `#\n`;
                    titles += server.songs[i].title > 22 ? `\`${server.songs[i].title.substr(0, 22)}...\`\n` : `\`${server.songs[i].title}\`\n`;
                } else if (i > 0) {
                    index += `${i}\n`
                    titles += server.songs[i].title > 22 ? `\`${server.songs[i].title.substr(0, 22)}...\`\n` : `\`${server.songs[i].title}\`\n`;
                }
            }
            if (long_queue) big_q += `et ${serverQueue.songs.length - limit} chanson(s) de plus ...\n`;
            else big_q = "_ _\n";
				}

		queue_embed = new Discord.RichEmbed()
			.setTitle(`Musique`)
			.setDescription(`Listes des titres`)
       		.addField(`Titres`, titles, true)
        	.addField(`${big_q}`, `_ _`, false)
        	.setFooter(numberOfPages === 1 ? `Page [${Math.floor(i/numberOfSongs*numberOfPages)}/${numberOfPages}]` : numberOfPages === 0 ? `Page [0/0]` : `Pages [${Math.floor(i/numberOfSongs*numberOfPages)}/${numberOfPages}]`)
        	.setColor(config.color);

        msg.channel.send(queue_embed);

}else if (command === 'pause') {
	if (serverQueue && serverQueue.playing) {
		serverQueue.playing = false;
		serverQueue.connection.dispatcher.pause();
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: "J'met pause !",
			},
		});
			
		}
		return msg.channel.send('Erreur, aucun titre...');

}else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.dispatcher.resume();
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: "Et c'est reparti !",
			},
		});
			
		}
		return msg.channel.send({embed: {
			color: 37372,
			title: "Musique",
			description: "Erreur, aucun titre...",
		},
	});
	}	
});


async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Discord.Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
        
         // UUID for watching vidÃ©os
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,            
			dispatcher: null,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
            await voiceChannel.join().then(connection => {
                queueConstruct.connection = connection;
                play(msg.guild, connection);
            })
        }catch (error) {
			//console.error(`Je n'ai pas pu rejoindre le canal vocal: ${error}`);
			queue.delete(guild.id);
			return msg.channel.send({embed: {
				color: 37372,
				title: "Musique",
				description: `Une erreur s'est produite : ${error}`,
			},
		});
			
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send({embed: {
			color: 37372,
			title: "Musique",
			description: `**${song.title}** a été ajouté à la file d'attente !`,
		},
	});
		
		
	}
	return undefined;
}

function play(guild, connection) {
    var serverQueue = queue.get(guild.id);

	var stream = ytdl(serverQueue.songs[0] ? serverQueue.songs[0].url : "https://www.youtube.com/watch?v=IN4F0TkPSiM", { filter: 'audioonly' });
    serverQueue.dispatcher = connection.playStream(stream, {volume: 0.5});
		serverQueue.textChannel.send({embed: {
			color: 37372,
			title: "Musique",
			description: `Démarre : **${serverQueue.songs[0].title}**`,
		},
	});
		

    serverQueue.dispatcher.on('end', () => {
        serverQueue.songs.shift();
		if(serverQueue.songs[0]) play(guild, connection);
		else { serverQueue.textChannel.send({embed: {
			color: 37372,
			title: "Musique Infos",
			description: `La queue est vide ! Rajoutez de nouvelles chansons !`,
		},
	});
			
	connection.disconnect();
	queue.delete(guild.id);
            return;
		
		} });

    serverQueue.dispatcher.setVolume(serverQueue.volume / 100);

}


function printDateonts(ts){
	var pdate = new Date(ts);
	var monthNames = [
	  "janvier", "février", "mars",
	  "avril", "mai", "juin", "juillet",
	  "août", "septembre", "octobre",
	  "novembre", "decembre"
	];
  
	var day = pdate.getDate();
	var monthIndex = pdate.getMonth();
	var year = pdate.getFullYear();
	var hour = pdate.getHours();
	var minute = pdate.getMinutes();
  
	var thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
  
	return thedate;
  };

function printDate(pdate){
	var monthNames = [
	  "janvier", "février", "mars",
	  "avril", "mai", "juin", "juillet",
	  "août", "septembre", "octobre",
	  "novembre", "decembre"
	];
  
	var day = pdate.getDate();
	var monthIndex = pdate.getMonth();
	var year = pdate.getFullYear();
	var hour = pdate.getHours();
	var minute = pdate.getMinutes();
  
	var thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
  
	return thedate;
  };
  function timeConverter(UNIX_timestamp){
	var a = new Date((UNIX_timestamp * 1000) + (6 * 3600000));
	var months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
  }
  