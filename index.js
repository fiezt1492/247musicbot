const { Client, Intents } = require("discord.js")
const ytdl = require("ytdl-core");
const LINK = String(process.env.LIVE)
const CHANNEL_ID = String(process.env.CHANNEL)
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const client = new Client({
    shards: "auto", 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

const STATUS = {
          activity: { name: "music 247", type: "LISTENING" },
          status: 'idle',
        }

//const express = require('express');
//const app = express();
//const port = 3000;

//app.get('/', (req, res) => res.send(`BOT IS RUNNING`));

//app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)); 
//TOKEN vào đây
client.login(process.env.TOKEN);

const Channels = ["898499379487465472"]; /// ID stage hoặc voice 

client.on("ready", async () => {
    for(const channelId of Channels){
        joinChannel(channelId);       
        await new Promise(res => setTimeout(() => res(2), 500))
    }

    function joinChannel(channelId) {
        client.channels.fetch(channelId).then(channel => {
            const VoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
              const resource = createAudioResource(ytdl(LINK), {
                inlineVolume: true
            }); //youtube link
            resource.volume.setVolume(0.2);
            const player = createAudioPlayer()
            VoiceConnection.subscribe(player);
            player.play(resource);
            player.on(STATUS, () => {
                try{
                    player.stop()
                } catch (e) { }
                try{
                    VoiceConnection.destroy()
                } catch (e) { }
                joinChannel(channel.id)
            })
        }).catch(console.error)
    }
})

client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
        try{
            await newState.guild.me.voice.setSuppressed(false)
        }catch (e) {

        }
    }
})
client.on("warn", console.log)
client.on("debug", console.log)
client.on("rateLimit", console.log)
