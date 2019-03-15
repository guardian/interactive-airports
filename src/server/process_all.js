import fs from 'fs'
import * as d3 from 'd3'

import _ from 'lodash'

const files = fs.readdirSync('./src/server/scraped3')

const grouped = _(files).groupBy(str => str.slice(0, -8))
    .values()
    .valueOf()

const data = grouped.map( arr => {
    
        return _(arr).map( fn => JSON.parse(fs.readFileSync(`./src/server/scraped3/${fn}`)))
            .map( obj => {

                return Object.keys(obj).filter( k => Array.isArray(obj[k]) )
                    .map( k => {
                        const entry = obj[k]
                        return { id : k, lat : entry[1], lon : entry[2] }
                    })

            } )

            .flatten()
            .valueOf()


    })


const ex = data.slice(-1)[0]

const north = ex.filter( entry => entry.lat >= 0 ).length
const south = ex.filter( entry => entry.lat <= 0 ).length
console.log(north, south, north + south, north/(north+south))

const planes = _(data).map( (arr, i) => {
    
    return arr.map( entry => {

        const entries = data.slice(i + 1).map( arr => arr.find( o => o.id === entry.id ) )
            .filter( d => d )

        //console.log(entries)

        return [ entry, ...entries ]

    } )

}).flatten()
    .uniqBy(t => t[0].id)
    .valueOf()

console.log(planes.length)


fs.writeFileSync('./src/assets/all_planes.json', JSON.stringify(planes))