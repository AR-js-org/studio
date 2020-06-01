window.onload = () => {
    document.querySelector('#project-name').innerHTML = window.name.projectName;

    const queryDict = {}
    location.search.substr(1).split("&").forEach((item) => {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    }); // thx stackoverflow <3

    if (queryDict.state !== window.name.randomString) {
        console.error('Someone is pwning us?', window.name.randomString, queryDict.state);
        return;
    }

    console.log('code', queryDict.code);
};
