const superagent = require("superagent")
const fs = require("fs")
const path = require("path")
const fileName = path.resolve(__dirname,'data.json')

let i = 0
while(i<439){

    let url = `https://api.tianditu.gov.cn/v2/search?type=query&postStr=%7B%22queryType%22:%221%22,%22start%22:${i},%22mapBound%22:%22117.39881598437483,31.006641047688206,120.14539801562523,32.401601354022446%22,%22yingjiType%22:0,%22queryTerminal%22:10000,%22level%22:8,%22keyWord%22:%22%E5%8D%97%E4%BA%AC+%E5%8A%A0%E6%B2%B9%E7%AB%99%22,%22count%22:10,%22sourceType%22:0%7D&tk=75f0434f240669f4a2df6359275146d2`;

    superagent.get(url).set({
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Connection': 'keep-alive',
        'Host': 'api.tianditu.gov.cn',
        'Origin': 'https://map.tianditu.gov.cn',
        'Referer': 'https://map.tianditu.gov.cn/',
        'sec-ch-ua': '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62',
    }).end((err,res) => {
        
        let jsonObj = JSON.parse(res.text)
        let jsonContent = JSON.stringify(jsonObj.pois)
        //字符串处理
        let jsonString = jsonContent.substring(1,jsonContent.length-1)
        jsonString = jsonString+",\n";
        jsonString.trim()

        const opt = {
            flag:'a'//追加模式
        }
        
        fs.writeFile(fileName,jsonString,opt,(err) => {
            if(err){
                console.log("err")
            }
        })
    })
    i = i+10
}