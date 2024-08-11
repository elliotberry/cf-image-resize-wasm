const withURLParams = async (req) => {
    let url = new URL(req.url);
    let params = new URLSearchParams(url.search);
    //get all params as object
    let paramsObj = {};
    for (let [key, value] of params) {
        paramsObj[key] = value;
    }
    req.paramz = paramsObj;
}

export default withURLParams;