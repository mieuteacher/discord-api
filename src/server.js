var http = require('http');
var url = require('url');
var axios = require('axios');

const server = http.createServer(async function (req, res) {
    var urlObj = url.parse(req.url, true);

    if (req.method == "GET") {
        if(urlObj.pathname == "/") {
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h1>Đây là homepage</h1>
                </body>
                </html>
            `)
        }

        if(urlObj.pathname == "/sum") {
            res.write(templateSum(Number(urlObj.query.sothu1) + Number(urlObj.query.sothu2)))
        }

        if(urlObj.pathname == "/discord") {
            console.log("urlObj", urlObj)
            let resultChat = await sendMessageToDiscord(urlObj.query.content);

            if (resultChat == true) {
                let chatList = await getMessageToDiscord();
                if (!chatList) {
                    res.write(discordTemplate("Gửi tin nhắn thành công - get tin nhắn thất bại"))
                }else {
                    let result = ``;
                    for (let i in chatList) {
                        result += `
                            <div>${chatList[i].content}</div>
                        `
                    }
                    res.write(discordTemplate(result))
                }
            }else {
                res.write(discordTemplate("Gửi thất bại"))
            }
            
        }
    }
    res.end();
}).listen(2912)


function templateSum(result) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>Đây là Sum Page</h1>
        <form onsubmit="handleSubmit(event)">
            <input name="soThu1" type="text" placeholder="số thứ 1">
            <input name="soThu2" type="text" placeholder="số thứ 2">
            <p>Kết quả 2 số là: ${result}</p>
            <button type="submit">Sum</button>
        </form>
        <script>
            function handleSubmit(event) {
                event.preventDefault();
                console.log("e so thu 1", event.target.soThu1.value)
                console.log("e so thu 2", event.target.soThu2.value)
                let targetPoint = "/sum?sothu1=" + event.target.soThu1.value + "&sothu2=" + event.target.soThu2.value;
                window.location.href = targetPoint;
            }
        </script>
    </body>
    </html>
    `
}


function discordTemplate(result) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Discord Plugins</h1>
    <form onsubmit="submitForm(event)">
        <input name="chatContent" type="text" placeholder="tin nhắn của bạn">
        <button type="submit">Gửi</button>
    </form>
    ${result}
    <script>
        function submitForm(event) {
            event.preventDefault();
            let targetPoint = "/discord?content=" +  event.target.chatContent.value;
            window.location.href = targetPoint;
        }
    </script>
</body>
</html>
    `
}


async function sendMessageToDiscord(chatContent) {
    let apiKey = ""; // gắn key vào
    let channelId = "1104260605856186368";
    let targetPoint = `https://discord.com/api/v9/channels/${channelId}/messages`
    
    return await axios.post(targetPoint, {
        content: chatContent
    },{
        headers: {
            Authorization: apiKey,
        }
    })
    .then(res => true)
    .catch(er => false)
}


async function getMessageToDiscord() {
    let apiKey = ""; // gắn key vào
    let channelId = "1104260605856186368";
    let targetPoint = `https://discord.com/api/v9/channels/${channelId}/messages?limit=10`
    
    return await axios.get(targetPoint,
        {
        headers: {
            Authorization: apiKey,
        }
    })
    .then(res => res.data)
    .catch(er => false)
}