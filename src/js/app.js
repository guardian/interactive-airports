import * as d3b from 'd3'
import * as d3gp from 'd3-geo-projection'
import { $ } from './util'
import * as topojson from 'topojson'
import world from 'world-atlas/world/110m'
//import planes from '../assets/all_planes.json'
import grid from '../server/grid.json'

console.log(grid)

const d3 = Object.assign({}, d3b, d3gp)

const draw = () => {

    const landFc = topojson.feature(world, world.objects.land)

    const svgEl = $('.air-svg')

    const width = svgEl.getBoundingClientRect().width
    const height = 600

    const svg = d3
        .select(svgEl)
        .attr('width', width)
        .attr('height', height)

        const bbox2 =  {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -9.228515625,
                    46.800059446787316
                  ],
                  [
                    3.427734375,
                    46.800059446787316
                  ],
                  [
                    3.427734375,
                    56.17002298293205
                  ],
                  [
                    -9.228515625,
                    56.17002298293205
                  ],
                  [
                    -9.228515625,
                    46.800059446787316
                  ]
                ].reverse()
              ]
            }
          }

        const bbox = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -1.1865234375,
                    50.645977340713586
                  ],
                  [
                    1.2936401367187498,
                    50.645977340713586
                  ],
                  [
                    1.2936401367187498,
                    52.05080146285827
                  ],
                  [
                    -1.1865234375,
                    52.05080146285827
                  ],
                  [
                    -1.1865234375,
                    50.645977340713586
                  ]
                ].reverse()
              ]
            }
          }

    console.log(bbox)

    const proj = d3.geoIdentity()

        .reflectY(true)

        //.rotate([ 96, -46 ])
        //.fitSize([ width, height ], { type : "Sphere" })

        .scale(2)
        .translate([400, 200])

    const path = d3.geoPath().projection(proj)

    const land = svg
        .selectAll('blah')
        .data(landFc.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'air-land')

    // const globe = svg
    //     .append('path')
    //     .datum({ type : 'Sphere' })
    //     .attr('d', path)
    //     .attr('class', 'air-globe')

    
    console.log(grid)

    const gridPaths = svg
        .selectAll('blah')
        .data(grid)
        .enter()
        .append('path')
        .attr('d', d => {


            const [ n, s, w, e ] = d

            const f = {
                type : 'Polygon',
                coordinates : [[
  
                  [ n, w ],
                  [ n, e ],
                  [ s, e ],
                  [ s, w ],
                  [ n, w ]
  
                ].map( t => t.reverse() )]
              }

            console.log(f)

            return path(f)

        })
        .attr('class', 'air-grid')
        .style('opacity', 0)

        gridPaths
            .transition()
            .delay((d, i) => i*300)
            .style('opacity', 1)

    // const paths = svg
    //     .selectAll('blah')
    //     .data(planes)
    //     .enter()
    //     .append('path')
    //     .each( function(d, i) {

    //         const el = d3.select(this)

    //         //console.log(d.map( o => [ o.lat, o.lon ] ))

    //         const theD = path({ type : 'LineString', coordinates : d.map( o => [ o.lon, o.lat ] ) })

    //         //console.log(theD)

    //         el
    //             .attr('d', theD)
    //             .attr('class', 'air-plane')

    //     } )



}


draw()