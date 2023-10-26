import { createHash } from "crypto-browserify";

const getHash=(value)=>{
    const hash = createHash("sha256").update(value,"utf-8").digest("hex")
    return hash
}

export {getHash};