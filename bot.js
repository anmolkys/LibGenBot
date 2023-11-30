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
let name;
bot.onText(/\/name/, async (msg,match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,'What should I call you?')
    bot.on('message',(msg)=>{
        const nameId=msg.chat.id;
        const message = msg.text;
        bot.sendMessage(nameId,`Nice to meet you ${message} !!!`)
    })
});

bot.onText(/\/book/, async (msg)=>{
    const chatId=msg.chat.id;
    bot.sendMessage(chatId,'What is the book called ?')
    bot.on('message',(msg)=>{
        const bookId = msg.chat.id;
        const message=msg.text;
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
})