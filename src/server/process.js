import fs from 'fs'

const files = fs.readdirSync('./src/server/scraped')

const data = files.map( fn => JSON.parse(fs.readFileSync(`./src/server/scraped/${fn}`) ))


const planes = Object.keys(data[0]).map( k => {

    const obj = data[0][k]

    if(Array.isArray(obj) && typeof obj[1] === 'number' && typeof obj[2] === 'number') {
    
        const otherObjs = data.slice(1).map( o => o[k] )
            .filter( o => o )

        return [ obj, ...otherObjs ].map( obj => {
         
            console.log(obj)
         
        return { lon : obj[1], lat : obj[2] } 

        })

    }

    


} ).filter( d => d )



console.log(planes[0])

fs.writeFileSync('./src/assets/planes.json', JSON.stringify(planes))