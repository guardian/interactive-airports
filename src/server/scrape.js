import fetch from 'node-fetch'

import fs from 'fs'
import throttle from 'throttle-promise'
import { pseq } from '../js/util.js'
import mkdirp from 'mkdirp'

const slowFetch = throttle(fetch, 1, 666)

const interval = 1000*15*60 // 15 minutes

const bounds = [
    '90', // top (north)
    '-90', // bottom (south)
    '-180', // west
    '180' // east
]

const joined = bounds.join(',')

const url = `https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${joined}&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=14400&gliders=1&stats=1`

const grid = Array(18*9).fill().map((_, i) => {

    const x = i % 18
    const y = Math.floor(i/18)
    
    const bounds = [

        90 - x*10,
        90 - (x+1*10),
        -180 + y*10,
        -180 + (y+1)*10

    ]

})

let i = 0

mkdirp.sync('./src/server/scraped')

const ua = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3578.98 Chrome/71.0.3578.98 Safari/537.36"

const scrape = () => {

    const roughGrid1 = Array(4).fill().map( (_, ind) => {

        return [
            90,
            50,
            180 - (ind+1)*90,
            180 - ind*90,
            ]
    } )

    const roughGrid2 = Array(16).fill().map( (_, ind) => {

        const x = ind % 8
        const y = Math.floor(ind/8)

        return [
            20 - y*15,
            20 - (y+1)*15,
            180 - (x+1)*45,
            180 - x*45,
            ]
    } )

    const roughGrid3 = Array(4).fill().map( (_, ind) => {

        return [
            -10,
            -90,
            180 - (ind+1)*90,
            180 - ind*90,
            ]
    } )
    
    //Array(3*3).fill().map((_, ind) => {

    //     const x = ind % 24
    //     const y = Math.floor(ind/24)
        
    //     const bounds = [
    //         180 - x*15,
    //         180 - (x+1)*15,
    //         -90 + y*7.5,
    //         -90 + (y+1)*7.5
    //     ]
    //     return bounds

    // })

    const grid = Array(18*3).fill().map((_, ind) => {

        const x = ind % 18
        const y = Math.floor(ind/18)
        
        const bounds = [
            50 - y*10,
            50 - (y+1)*10,
            90 - (x+1)*15,
            90 - x*15,
        ]
        return bounds

    })

    const eastGrid = Array(2*3).fill().map((_, ind) => {

        const x = ind % 2
        const y = Math.floor(ind/2)
        
        const bounds = [
            50 - y*10,
            50 - (y+1)*10,
            180 - (x+1)*45,
            180 - x*45,
        ]
        return bounds

    })

    const fullGrid = [ ...roughGrid1, ...grid, ...eastGrid, ...roughGrid2, ...roughGrid3 ]

    fs.writeFileSync('./src/server/grid.json', JSON.stringify(fullGrid))

    console.log('No. of grid cells:', fullGrid.length)

    setTimeout(() => scrape(), interval)

    let totalN = 0

    pseq(fullGrid, (bbox, j, arr) => {

        return new Promise(( resolve, reject ) => {

            const joined = bbox.join(',')
            const url = `https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${joined}&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&estimated=1&maxage=14400&stats=1`

            slowFetch(url, { headers : { 'User-Agent' : ua } }).then( resp => resp.json() )

                .then( data => {

                    fs.writeFileSync(`./src/server/scraped/data_${String(i).padStart(8, '0')}_${String(j).padStart(3, '0')}.json`, JSON.stringify({ ts : Date.now(), data } ))
                    resolve('yay')

                    console.log(url)

                    const n = Object.keys(data).filter( k => Array.isArray(data[k]) ).length
                    totalN += n

                    console.log(`Call no. ${i}, grid cell ${j}, ${n} planes`)

                    //console.log(`${n} planes`)

                    if(j === arr.length - 1) {
                        
                        console.log('---')
                        console.log(`Total in round ${i}: ${totalN}`)
                        console.log('---')

                        i += 1
                    }

                } )
                .catch( err => {

                    console.log(err)

                } )

        })

    } )

}

scrape()

    
// fetch(url).then( resp => resp.json() )
//     .then( data => {

//         console.log(Object.keys(data).length)

//     } )

// setInterval(() => {




// })