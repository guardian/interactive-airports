import puppeteer from 'puppeteer'

let time = 0
let i = 0

const clip = {
    x : 208,
    y : 260,
    width : 590,
    height : 440
}

const INTERVAL = 1000*3 // 3 secs

const main = async () => {

    const browser = await puppeteer.launch()

    // Gatwick

    const pageG = await browser.newPage()
    pageG.setViewport({ width: 800, height : 800 })
    await pageG.goto('https://www.flightradar24.com/51.14,-0.21/13')

    // Heathrow

    const pageH = await browser.newPage()
    pageH.setViewport({ width: 800, height : 800 })
    await pageH.goto('https://www.flightradar24.com/51.46,-0.47/13')

    setInterval(async () => {

        console.log(i)

        time += INTERVAL
        let waitTime = 0

        i += 1

        if(time > 10*60*1000) {

            // need to refresh flightradar every couple minutes or else they block you from the map

            waitTime = 1500

            await pageG.reload()
            await pageH.reload()

            time = 0

        }

        // if we refreshed wait a bit before taking screenshots

        setTimeout(async () => {

        await pageG.screenshot({ path : `src/server/out/gatwick_${String(i).padStart(7, '0')}.jpg`, clip })
        await pageH.screenshot({ path : `src/server/out/heathrow_${String(i).padStart(7, '0')}.jpg`, clip })

        }, waitTime )

    }, INTERVAL)



}

main()