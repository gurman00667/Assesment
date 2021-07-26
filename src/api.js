const axios = require('axios');

export default async function callApi() {
    var res = await axios.get("https://jsonplaceholder.typicode.com/todos");
    console.log(res.data);
    return res
}