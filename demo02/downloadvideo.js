const puppeteer = require('puppeteer');
const axios = require('axios')
const fs = require('fs')

//从视频页面获取下载链接
async function getVideo(href){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(href,{ waitUntil: "load", timeout: 90000 });

    let href2 = await page.evaluate(() => {
        const href3 = document.querySelector('video').firstElementChild.getAttribute('src');
        // console.log(href2)
        return href3;
    })
    // await page.screenshot({path: 'screenshot.png'});
    // console.log(href2);
    await browser.close();//注意顺序，return后浏览器就关闭不了了
    return "https:"+href2;
}

//从下载链接(url)下载视频
async function downloadVideo(url,path){
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      response.data.pipe(fs.createWriteStream(path));

      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          resolve();
        });
    
        response.data.on('error', (err) => {
          reject(err);
        });
      });
}


fs.readFile('./data.json', (err,data) => {
    if(err) throw err;
    let filedata = JSON.parse(data);
    let array = filedata["array"];
    array.sort();
    let url = array.pop();
    console.log(url);
    // console.log(array)
    
    // for (let i = 0,len = 2;i<len;i++){
    //     (async () => {
    //         const href = array[i];
    //         let link = await getVideo(href);
            
    //         // console.log(link);
    //         downloadVideo(link, `./video${i}.mp4`)
    //         .then(() => console.log('Video downloaded successfully.'))
    //         .catch((err) => console.error(err));
    //     })();
    // }
})



// (async () => {
//     const href = "https://www.douyin.com/video/7185382178316881211";
//     let link2 = await getVideo(href);
    
//     console.log(link2);
//     downloadVideo(link2, './video.mp4')
//   .then(() => console.log('Video downloaded successfully.'))
//   .catch((err) => console.error(err));
// })();

