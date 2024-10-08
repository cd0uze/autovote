import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { connect } from 'puppeteer-real-browser-nopecha';
import path from 'path';
import clc from 'cli-color';
import Config from './config.json' assert {type: "json"};

puppeteer.use(StealthPlugin());

const Ext = path.join(process.cwd(), "./nopecha");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const response = await connect({
    headless: "auto",
    fingerprint: false,
    args : [
        '--disable-search-engine-choice-screen'
        ],
    turnstile: true
}).catch(err => console.log(err));

const {page, browser} = response,
browser2 = await puppeteer.launch({
  timeout: 0,
  headless: true,
  args: [
    `--disable-extensions-except=${Ext}`, 
    `--load-extension=${Ext}`,
    '--enable-automation'
    ],
  targetFilter: null
}).catch(err => console.log(err));

async function autovote(i) {
    await (Config.sites[i].turnstile ? browser : browser2).newPage().then(async page => {

        console.log(clc.yellow("Website " + Config.sites[i].index + " | Opening " + Config.sites[i].url + "..."));

        await page.goto(Config.sites[i].url, {waitUntil: "networkidle2", timeout: 0});

        /*if([1, 6].includes(Config.sites[i].index)) {
            await page.waitForFunction('document.title.includes("Vote")', {timeout: 0});
    }*/

        console.log(clc.green("Website " + Config.sites[i].index + " | Website opened !"));

        await page.waitForSelector(`input[name=${Config.sites[i].input}]`, {timeout: 0}).catch(async err => {
            await page.close();
            console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message));
        });

        await page.evaluate((e) => e.scrollIntoView(), (await page.$(`input[name=${Config.sites[i].input}`)));

        if(Config.sites[i].button) {
            await page.waitForSelector(`input[name=${Config.sites[i].button}]`, {timeout: 0});
            await page.$eval(`input[name=${Config.sites[i].button}]`, b => b.click());
        }

        let Checked = Config.sites[i].captcha || Config.sites[i].cloudflare ? false : true;

        if(Config.sites[i].cloudflare) {
            await page.waitForSelector(".cf-turnstile", {timeout: 0}).catch(err => console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message)));
            console.log(clc.yellow("Website " + Config.sites[i].index + " | Solving Captcha..."));

            const Interval = setInterval(async function() {
                const captchaValue = await page.evaluate(() => document.getElementsByClassName("cf-turnstile")[0]?.children[0]?.querySelector("input[name=cf-turnstile-response]")?.value);

                if(captchaValue) {
                    clearInterval(Interval);

                    console.log(clc.green("Website " + Config.sites[i].index + " | Captcha solved !"));
                    Checked = true;
                }
            }, 5000);
        }
        if(Config.sites[i].captcha) {
            console.log(clc.yellow("Website " + Config.sites[i].index + " | Solving Captcha..."));

            const Interval2 = setInterval(async function() {
                const Frame = await page.frames().find(f => f.name().startsWith("a-"));

                if(Frame) {
                    clearInterval(Interval2);

                    await Frame.waitForSelector("span[aria-checked=true]", {timeout:0}).catch(err => console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message)));
                    console.log(clc.green("Website " + Config.sites[i].index + " | Captcha solved !"));
                    Checked = true;
                }
            }, 5000);
        }

        await page.focus(`input[name=${Config.sites[i].input}]`);
        await page.keyboard.type(Config.username);

        return new Promise(async (resolve, reject) => {
            const Interval3 = setInterval(async function() {
                async function check() {
                    if(Checked) {
                        clearInterval(Interval3);

                        await page.focus(`input[name=${Config.sites[i].input}]`);
                        await page.keyboard.press("Enter");

                        console.log(clc.yellow("Website " + Config.sites[i].index + " | Waiting for vote..."));

                        if(![1, 2, 7].includes(Config.sites[i].index)) await page.waitForNavigation({timeout: 0});

                        if(Config.sites[i].index == 1) {
                            const Interval4 = setInterval(async function() {
                                const Result = await page.evaluate(() => document.getElementsByClassName("btn btn-primary btn-lg btn-block")[0]?.textContent) || await page.evaluate(() => document.getElementsByClassName("alert alert-danger")[0]?.textContent);

                                if(Result) {
                                    clearInterval(Interval4);

                                    if(Result.includes("Thanks for voting!")) {
                                        resolve();
                                    } else if(Result.includes("You either waited too long")) {
                                        console.log(clc.red("Website " + Config.sites[i].index + " | Error occured.Voting again..."));
                                        await check();
                                    } else {
                                        reject();                                      
                                    }
                                }
                            }, 5000);
                        }

                        if(Config.sites[i].index == 4) {
                            const Result = await page.evaluate(() => document.getElementsByClassName("modal-body text-center")[0]?.textContent);

                            if(Result && Result.includes("Thank you for voting!")) {
                                resolve();                           
                            } else {
                                reject();
                            }
                        }

                        if(Config.sites[i].index == 7) {
                            await page.waitForFunction('document.getElementById("voteerror").textContent !== "Please Wait...."', {timeout: 0});

                            const Result = await page.evaluate(() => document.getElementById("voteerror")?.textContent);

                            if(Result === "Thanks, Vote Registered") {
                                resolve();
                            } else if(Result === "We cannot verify your vote due to a low browser score. Try another browser or try login to Google to raise your score." || Result === "The verification expired due to timeout.Simply click the Vote button again and it should work."){
                                console.log(clc.red("Website " + Config.sites[i].index + " | Error occured.Voting again..."));
                                await check();
                            } else {
                                reject();
                            }
                        }

                        if(Config.sites[i].voteConfirm) {
                            if(Config.sites[i].voteCooldown) await sleep((Config.sites[i].voteCooldown+5)*1000);            

                            const Url = await page.url();

                            if(Url === Config.sites[i].voteUrl || Config.sites[i].voteUrl.includes(Url)) {
                                resolve();
                            } else {
                                reject();
                            }
                        }
                    }
                };
                await check();
            }, 5000);
}).then(async () => {
    console.log(clc.green("Website " + Config.sites[i].index + " | Vote added !"));
    await page.close().catch(err => console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message)));
}).catch(async () => {
    console.log(clc.red("Website " + Config.sites[i].index + " | Failed to add vote !"));
    await page.close().catch(err => console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message)));
});
}).catch(err => console.log(clc.red("Website " + Config.sites[i].index + " | " + err.message)));
};

/*setInterval(async function() {
}, 60*60*12*1000);
*/

/*for (const i in Config.sites) {
    await autovote(i);
}*/

autovote(2)

await browser.close().catch(err => console.log(clc.red(err.message)));
await browser2.close().catch(err => console.log(clc.red(err.message)));

