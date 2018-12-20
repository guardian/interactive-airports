import fs from 'fs'

import { execSync } from 'child_process'

console.log('hello!')

let j = 0

Array(5000).fill().forEach( (_, i) => {

    const padded = String(i + 1).padStart(7, '0')

    const h = `src/server/out/heathrow_${padded}.jpg`
    const g = `src/server/out/gatwick_${padded}.jpg`

    console.log(i)

    if( i % 5 === 0 ) {
        const paddedJ = String(j).padStart(7, '0')

        try {

        execSync(`convert -append ${h} ${g} src/server/combined/combined_${paddedJ}.jpg`)

        j += 1

        } catch(err) { console.log('err at', i) } 
    }



} )