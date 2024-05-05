import {toByteArray} from "base64-js"


let acc = "eyJleHAiOjE3MTQ4MjQ0MjIuODIyMDQ0LCJ1c2VySWQiOjEsInVzZXJOYW1lIjoi0J7Qu9C10LMiLCJ1c2VyU3VybmFtZSI6ItCaLiIsInVzZXJSb2xlcyI6WyJBRE1JTiJdfQ"
//let acc = "eyJleHAiOjE3MTQ4MzQ0NDIuNTE0MzAzLCJ1c2VySWQiOjQsInVzZXJOYW1lIjoi0JnQvtC30YvRhNGDIiwidXNlclN1cm5hbWUiOiLQmtGF0YrQvNC1IiwidXNlclJvbGVzIjpbIkFETUlOIl19"

let residue = acc.length % 4

if (residue > 0) {
    acc = acc + "=".repeat(residue)
}

console.log(new TextDecoder().decode(toByteArray(acc)))
