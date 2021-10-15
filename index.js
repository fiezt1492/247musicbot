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

client.login(process.env.TOKEN);

const Channels = ["898499379487465472"];

client.on("ready", async () => {
   
    for(const channelId of Channels){
        client.user.setStatus("idle")
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
            
            player.on("idle", () => {
                try{
                    player.stop()
                } catch (e) { }
                try{
                    VoiceConnection.destroy()
                } catch (e) { }
                joinChannel(channel.id)
            })
        }).catch(console.error)
        
        client.user.setActivity("music 247", { type: "LISTENING" })
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
