window.onload = () => {
    window.session = JSON.parse(window.name);

    document.querySelector('#project-name').innerHTML = window.session.projectName;

    const queryDict = {}
    location.search.substr(1).split("&").forEach((item) => {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    }); // thx stackoverflow <3

    if (queryDict.state !== window.session.randomString) {
        console.error('Someone is pwning us?', window.session.randomString, queryDict.state);
        return;
    }

    console.debug('code', queryDict.code);
};