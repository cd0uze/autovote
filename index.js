import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { connect } from 'puppeteer-real-browser';
import path from 'path';
import Config from './config.json' assert {type: "json"};

puppeteer.use(StealthPlugin());

const Ext = path.join(process.cwd(), "./0.4.12_0");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const response = await connect({
    headless: "auto",
    executablePath: '/usr/bin/chromium-browser', 
      args: [ 
        '--no-sandbox', , 
      ] 
    fingerprint: false,
    turnstile: true
}).catch(err => console.log(err));

const {page, browser, setTarget} = response,
browser2 = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium-browser',
  args: [
    `--disable-extensions-except=${Ext}`, 
    `--load-extension=${Ext}`,
    '--enable-automation',
  ],
  targetFilter: null
}).catch(err => console.log(err));

setTarget({status: false});

async function autovote(i) {
    await (Config.sites[i].turnstile ? browser : browser2).newPage().then(async page => {

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
        console.log("Website " + Config.sites[i].index + " | Opening " + Config.sites[i].url+ "...");

        if(i == 0 || i == 5) {
        await page.goto("https://nopecha.com/setup#awscaptcha_auto_open=false|awscaptcha_auto_solve=false|awscaptcha_solve_delay=true|awscaptcha_solve_delay_time=1000|disabled_hosts=|enabled=true|funcaptcha_auto_open=true|funcaptcha_auto_solve=true|funcaptcha_solve_delay=true|funcaptcha_solve_delay_time=1000|geetest_auto_open=false|geetest_auto_solve=false|geetest_solve_delay=true|geetest_solve_delay_time=1000|hcaptcha_auto_open=true|hcaptcha_auto_solve=true|hcaptcha_solve_delay=true|hcaptcha_solve_delay_time=3000|keys=|lemincaptcha_auto_open=false|lemincaptcha_auto_solve=false|lemincaptcha_solve_delay=true|lemincaptcha_solve_delay_time=1000|perimeterx_auto_solve=false|perimeterx_solve_delay=true|perimeterx_solve_delay_time=1000|recaptcha_auto_open=true|recaptcha_auto_solve=true|recaptcha_solve_delay=true|recaptcha_solve_delay_time=2000|textcaptcha_auto_solve=false|textcaptcha_image_selector=|textcaptcha_input_selector=|textcaptcha_solve_delay=true|textcaptcha_solve_delay_time=100|turnstile_auto_solve=false|turnstile_solve_delay=true|turnstile_solve_delay_time=1000").catch(err => console.log(err));
        await page.goto(Config.sites[i].url, {waitUntil: "networkidle0", timeout: 0});
    } else {
        await page.goto(Config.sites[i].url, {waitUntil: "networkidle0", timeout: 0});
    }

    console.log("Website " + Config.sites[i].index + " | Website opened !");

    await page.waitForSelector(`input[name=${Config.sites[i].input}]`, {timeout: 0}).catch(async err => {
        await page.close();
        console.log("Website " + Config.sites[i].index + " | " + err.message);
});

await page.evaluate((e) => e.scrollIntoView(), (await page.$(`input[name=${Config.sites[i].input}`)));

if(Config.sites[i].button){
    await page.waitForSelector(`input[name=${Config.sites[i].button}]`, {timeout: 0});
    await page.$eval(`input[name=${Config.sites[i].button}]`, b => b.click());
}

let Checked = Config.sites[i].captcha || Config.sites[i].cloudflare ? false : true;

if(Config.sites[i].cloudflare){
    await page.waitForSelector(".cf-turnstile", {timeout: 0});
    console.log("Website " + Config.sites[i].index + " | Solving Captcha...");

    const Interval = setInterval(async function() {
        const captchaValue = await page.evaluate(() => document.getElementsByClassName("cf-turnstile")[0]?.children[0]?.querySelector("input[name=cf-turnstile-response]")?.value);

        if(captchaValue){
            clearInterval(Interval);

            console.log("Website " + Config.sites[i].index + " | Captcha solved !");
            Checked = true;
        }
}, 5000);
}
    if(Config.sites[i].captcha){
        console.log("Website " + Config.sites[i].index + " | Solving Captcha...");

        const Interval2 = setInterval(async function() {
        const Frame = await page.frames().find(f => f.name().startsWith("a-"));

        if(Frame) {
            clearInterval(Interval2);
            
            await Frame.waitForSelector("span[aria-checked=true]", {timeout:0});
             console.log("Website " + Config.sites[i].index + " | Captcha solved !");
             Checked = true;
        }
            }, 5000);
    }

    await page.focus(`input[name=${Config.sites[i].input}]`);
    await page.keyboard.type(Config.username);

    return new Promise(async resolve => {
    const Interval3 = setInterval(async function() {
    async function check(){
    if(Checked) {
        clearInterval(Interval3);

        await page.focus(`input[name=${Config.sites[i].input}]`);
        await page.keyboard.press("Enter");

        console.log("Website " + Config.sites[i].index + " | Waiting for vote...");

        if(![1, 2, 7].includes(Config.sites[i].index)) await page.waitForNavigation({timeout: 0});

        if(Config.sites[i].index == 1) {
            const Interval4 = setInterval(async function() {
            const Result = await page.evaluate(() => document.getElementsByClassName("btn btn-primary btn-lg btn-block")[0]?.textContent) || await page.evaluate(() => document.getElementsByClassName("alert alert-danger")[0]?.textContent);

            if(Result) {
                clearInterval(Interval4);

            if(Result.includes("Thanks for voting!")) {
                console.log("Website " + Config.sites[i].index + " | Vote added !");
                resolve();
            } else if(Result.includes("You either waited too long")) {
                console.log("Website " + Config.sites[i].index + " | Error occured.Voting again...");
                await check();
            } else {
                console.log("Website " + Config.sites[i].index + " | Unknown error !");
                resolve();
            }
        }
        }, 5000);
        }

                if(Config.sites[i].index == 4) {
                const Result = await page.evaluate(() => document.getElementsByClassName("modal-body text-center")[0]?.textContent);

                if(Result.includes("Thank you for voting!")) {
                    console.log("Website " + Config.sites[i].index + " | Vote added !");
                    resolve();
                } else {
                    console.log("Website " + Config.sites[i].index + " | Unknown error !");
                    resolve();
                }
        }

            if(Config.sites[i].index == 7) {
            await page.waitForFunction('document.getElementById("voteerror").textContent !== "Please Wait...."', {timeout: 0});

            const Result = await page.evaluate(() => document.getElementById("voteerror")?.textContent);
            
            if(Result === "Thanks, Vote Registered") {
                console.log("Website " + Config.sites[i].index + " | Vote added !");
                resolve()
            } else if(Result === "We cannot verify your vote due to a low browser score. Try another browser or try login to Google to raise your score." || Result === "The verification expired due to timeout.Simply click the Vote button again and it should work."){
                    console.log("Website " + Config.sites[i].index + " | Error occured.Voting again...");
                    await check();
                    } else {
                        console.log("Website " + Config.sites[i].index + " | Unknown error !");
                        resolve();
                    }
                }

            if(Config.sites[i].voteConfirm){
                if(Config.sites[i].voteCooldown) await sleep((Config.sites[i].voteCooldown+5)*1000);            

                const Url = await page.url();
                console.log("Website " + Config.sites[i].index + " | " + Url);

                if(Url === Config.sites[i].voteUrl || Config.sites[i].voteUrl.includes(Url)) {
                    console.log("Website " + Config.sites[i].index + " | Vote added !");
                    resolve();
                } else {
                    console.log("Website " + Config.sites[i].index + " | Unknown error !");
                    resolve();
                }
            }
        }
    };
await check();
}, 5000);
}).then(async () => {
    await page.close();
}).catch(err => console.log("Website " + Config.sites[i].index + " | " + err.message));
}).catch(err => console.log("Website " + Config.sites[i].index + " | " + err.message));
};
export async function voteloop() {
for (const i in Config.sites) {
    await autovote(i);
};
};

setInterval(voteloop, 60*60*12*1000)