import { Transform } from "node:stream"

export default class ThrottleRequest extends Transform {
    #requestPerSecond = 0
    #internalCounter = 0

    constructor({
        objectMode,
        requestsPerSecond
    }) {
        super({
            objectMode
        })

        this.#requestPerSecond = requestsPerSecond
    }

    _transform(chunk, enc, callback) {
        this.#internalCounter++
        if(! (this.#internalCounter >= this.#requestPerSecond) ){
            this.push(chunk)
            return callback()
        }

        console.count(' timeout')

        setTimeout(() => {
            this.#internalCounter = 0
            this.push(chunk)
            return callback()
        }, 1000);//One second

    }
}