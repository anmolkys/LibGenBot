const dotenv = require("dotenv").config();
const TelegramBot = require('node-telegram-bot-api');
const libgen = require('libgen-search');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
var request = require('request');

function parse(input)
{
    var parts = input.split('/');
    return parts
}




bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Welcome to Takshila 📖 !');
    }
});

bot.onText(/\/book (.+)/, async (msg,match)=>{
        const bookId = msg.chat.id;
        const message = match[1];
        libgen(message).then(function(books){
            let arr = books.filter(a=>a.language='English');
            let arrEpub = arr.filter(a=>a.extension='epub');
            let i = 0;
            let length = arrEpub.length;
            if(length>20){
                length=20;
            }
            for(i;i<length;i++){
                let md5 = parse(arrEpub[i].download);
                let downLink = arrEpub[i].download.replace("93.174.95.29","download.library.lol").trim().replace(/\s/g, '%20').replace("-","%2D").replace("(","%28").replace(")","%29");
                const bookDetails = `Title : ${arrEpub[i].title} \n \nAuthor : ${arrEpub[i].author} \n \nSize: ${arrEpub[i].filesize} \n \nLanguage: ${arrEpub[i].language} \n \nBook Link : ${'https://www.libgen.is/book/index.php?md5=' + md5[5]} \n \nDownload : ${downLink}`
                bot.sendMessage(bookId,bookDetails);
            }
            bot.sendMessage(bookId,`Found ${length} books for you. Happy Reading.`)
        }).catch(function(error){
            bot.sendMessage(bookId,"Book Not Found");
        })

})
