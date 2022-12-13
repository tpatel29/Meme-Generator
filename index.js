require('dotenv').config();
const axios = require('axios'); //add this line at the top
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);
const Jimp = require('jimp'); // import the Jimp library



const Discord = require("discord.js");
const prefix = '/'
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
client.commands = new Discord.Collection();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});


client.on('message', async message => {

  if(!message.content.startsWith(prefix) || message.author.bot ) return;

  const args = message.content.slice(prefix.length).split(/ +/ );
  const command = args.shift().toLowerCase();


  if(command === 'meme') {
    if(args){
      let text = message.content.substring(6)
      message.channel.send(text);

      // get caption
      var caption = "";

      const API_ENDPOINT = 'https://api.openai.com/v1/completions';
      const ACCESS_TOKEN = process.env.OPENAI_API_KEY;

      const prompt = 'Create a funny caption for a new meme about ' + text;

      const options = {model: 'davinci-instruct-beta', temperature: 0.7, max_tokens: 64, best_of: 1, presence_penalty: 0.5, top_p:0.5, prompt: prompt};
      axios.post(API_ENDPOINT, options, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }}).then(response => {
        console.log(response.data["choices"][0]["text"].toString().trim("\n"));
        message.channel.send(response.data["choices"][0]["text"].toString().trim("\n"));



        caption = response.data["choices"][0]["text"].toString().trim("\n");

        const params = {q: text,tbm: "isch",ijn: "0"};
        const callback = function(data) {
          // message.channel.send(data["images_results"][0]["original"]);

          var imageCaption = caption;
          var loadedImage;
          var outFileName = './test123.jpg';
          Jimp.read(data["images_results"][0]["original"])
              .then(function (image) {
                loadedImage = image.resize(500, Jimp.AUTO);
                return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
              })
              .then(function (font) {
                loadedImage.print(font, 0, 10, {text: imageCaption, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER}, 500 , 500)
                    .write(outFileName);
                message.channel.send("", {files: [outFileName]});
              })
              .catch(function (err) {
                console.error(err);
              });


        };
        search.json(params, callback);






      })
          .catch(error => {
            console.error(error.response);
          });






    }
  }


})


client.login(process.env.DISCORD_TOKEN);
