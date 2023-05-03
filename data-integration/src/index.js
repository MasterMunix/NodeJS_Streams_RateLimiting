import * as dotenv from 'dotenv'
dotenv.config()

/*Comando de linux para crear archivo csv en git bash
echo "id,name,desc,age" > big.csv 
for i in `seq 1 5`; do node.exe -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done
*/
let before = performance.now();

import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import csvtojson from 'csvtojson'
import { Transform } from 'node:stream' // Usar para limpiar la data con Transform
import { randomUUID } from 'node:crypto'//Genera numeros randoms usados para crear id's 
import { log, makeRequest } from './util.js'
import ThrottleRequest from './throttle.js'

const throttle = new ThrottleRequest({ objectMode: true, requestsPerSecond: 50000 })

//Transform se usa para editar la data o hacer algo mientras se este leyendo la data. En este caso se toma el performance y se reemplaza por los numeros de la data.


const dataProcessor = new Transform({
    objectMode: true,
    transform(chunk, enc, callback) {

        const now = performance.now() // obtener el tiempo ya pasado desde que el programa inicia en milisegundos

        const jsonData = chunk.toString()//.replace(/d/g, now)//Toma los datos de chunk y los transforma a string, luego reemplaza los numeros por el tiempo de now

        const data = JSON.parse(jsonData)//Transforma los datos a JSON
        data.id = randomUUID()//Añade la propiedad id a los datos y un random ID

        return callback(null, JSON.stringify(data)) //Transforma la data en String para ser imprimida
    }
})


await pipeline(
    createReadStream('big.csv'),
    csvtojson(),
    dataProcessor,
    throttle,
    async function* (source) {
        let counter = 0;
        for await (const data of source) {
            log(`processed ${counter++} items.... ${new Date().toISOString()}`)


            const status = await makeRequest(data)
            if (status !== 200) {
                throw new Error(`Opps! reached rate limit, the satus is  ${status}`)
            }
        }
    }
)
console.log('total es: ', performance.now());