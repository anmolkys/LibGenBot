const dotenv = require("dotenv").config();
const TelegramBot = require('node-telegram-bot-api');
const libgen = require('libgenesis');
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
            let arrPdf = arr.filter(a=>a.extension='pdf');
            let i = 0;
            let length = arrEpub.length;
            if(length>20){
                length=20;
            }
            for(i;i<length;i++){
                let md5 = parse(arrEpub[i].download);
                const bookDetails = `Title : ${arrEpub[i].title} \n \nAuthor : ${arrEpub[i].author} \n \nLink : ${'https://www.libgen.is/book/index.php?md5=' + md5[5]}`
                bot.sendMessage(bookId,bookDetails);
            }
        }).catch(function(error){
            bot.sendMessage(bookId,"Book Not Found");
        })

})