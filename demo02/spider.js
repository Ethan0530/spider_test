const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname,'data.json')

//获取作品总数
async function getAsoulVideoNum() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAflgvVQ5O1K4RfgUu3k0A2erAZSK7RsdiqPAvxcObn93x2vk4SKk1eUb6l_D4MX-n',{ waitUntil: "load", timeout: 60000 });
  // 用js获取节点
    const getNum = page.evaluate(() => {
        const textDom = document.getElementsByClassName('J6IbfgzH')[0];
        return textDom.innerText;
    });
    let num = getNum;
    await browser.close();
    return num;
}

//获取作品页面链接
async function getVideoHref(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAflgvVQ5O1K4RfgUu3k0A2erAZSK7RsdiqPAvxcObn93x2vk4SKk1eUb6l_D4MX-n',{ waitUntil: "load", timeout: 60000 });
    
    //模拟页面下拉
    // (async function f(){
    //     await page.evaluate(() => {
    //         window.scrollBy(0, window.innerHeight);
    //     });
    // })();

    const getAllVideo = await page.evaluate(() => {
        const liDomArray = document.querySelectorAll('li');
        let array = new Array();
        liDomArray.forEach(element => {
            if(element.firstElementChild!=null){
            let href = element.firstElementChild.getAttribute('href');
            array.push(href);
            }
        });
        array = array.filter(e => e!=null);
        for(let i = 0, len = array.length;i<len;i++){
            array[i] = 'https://www.douyin.com' + array[i];
        }
        return array;
    });
    let array = getAllVideo;
    await browser.close();
    return array;
}

//下载指定视频
async function getVideo(href){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(href,{ waitUntil: "load", timeout: 90000 });

    let href2 = await page.evaluate(() => {
        let href2 = document.querySelector('video').firstElementChild.getAttribute('src');
        href2 = "https:" + href2;
        return href2;
    })
    console.log(href2);
    await browser.close();
}

//main
(async () => {
    let num = await getAsoulVideoNum();
    // console.log(num);
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    let array = await getVideoHref();
    let str = "";
    for(let i = 0,len = array.length;i<len;i++){
        if(i!=len-1)
        str = str + `"${array[i]}",`
        else
        str = str + `"${array[i]}"`
    }
    let jsonString = `{"num":${num},"array":[${str}]}`;

    fs.writeFile(fileName,jsonString,{flag:'w'},(error) => {
        if(error) console.log(error);
    })

    await browser.close();
})();
