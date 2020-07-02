window.onload = async () => {

    const { Package } = ARjsStudioBackend;

    window.session = JSON.parse(window.name);

    if (window.session.assetType === "audio" || window.session.assetType === "video") {
        window.session.assetFile = new Uint8Array(window.session.assetFile).buffer;
    }

    const queryDict = {}
    location.search.substr(1).split("&").forEach((item) => {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    }); // thx stackoverflow <3

    if (queryDict.state !== window.session.randomString) {
        console.error('Someone is pwning us?', window.session.randomString, queryDict.state);
        return;
    }

    let response = await fetch(`https://arjs-studio-backend.herokuapp.com/authenticate/${queryDict.code}`);
    response = await response.json();

    const package = new Package(window.session);
    const pagesUrl = await package.serve({
        packageType: 'github',
        token: response.token, // required, must be an OAuth2 token
        message: 'first commit for WebAR!', // optional
        repo: window.session.projectName + window.session.randomString, // using user + GH code, gg wp
        branch: 'gh-pages' // automatically deploy to Pages by default
    });

    document.querySelector('.all-set').remove();
    document.querySelector('.repo-url').innerHTML = `
        We're done! Your Web AR Experience can be found at <p class="url">
            <a target="_blank" href="${pagesUrl}">${pagesUrl}</a>
        </p>
        It will be available in few minutes. Refresh the link to see it working!
    `;
};
