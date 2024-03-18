# AR.js Studio

AR.js Studio is an authoring platform to build Web Augmented Reality experiences, without coding knowledge.

[Learn more](https://medium.com/@nicolcarpignoli/ar-js-studio-a-call-to-arms-for-the-first-open-source-web-ar-authoring-platform-a031069518f9)

<img src="https://i.ibb.co/nz1ydkR/Schermata-2020-04-11-alle-13-48-16.png"/>

## Try now!

 🚀[Online version](https://ar-js-org.github.io/studio/)

 [HacktoberFest page](https://ar-js-org.github.io/studio/hacktoberfest)

## Resources

* [Google Drive Folder with Use Cases, Brainstorming, etc.](https://drive.google.com/open?id=1r2nJA8gfxFkty85DjPGUq56SOqNf0BsF)
* [Design](https://www.figma.com/file/TUjZ2KYsmhA5LUkt9KIhcB/ARjs-Components?node-id=0%3A1)
* [Design Mockup - only features, no real design](https://whimsical.com/D688LzTQQRyKESzRu1U4Au)
* [Meetings](https://docs.google.com/document/d/1ffUXGyd97phpInvrOiNEU-5WatO7tX_Yyu1AUVtq3T4/edit)

## If the publish on Github step fails

It is probably due to the external server handling oAuth2.0 requests.
We are using this project: https://github.com/prose/gatekeeper/ to handle the oAuth2.0 requests.
The project is now hosted on a private server, and it is not guaranteed to be always up and running.
If the publish fails, you should:

- fork the arjs studio project (because you need to change the `publish-confirm.js` file)
- host is somewhere else (even your GitHub pages)
- find a node server that can host the gatekeeper project
- set up the server with the gatekeeper project: you have to set, on the `config.json` file, the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` [with the ones you get from the github oAuth app you create](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28)
- be aware that gatekeeper is listening on port 9999 by default, use that on your server
- on `studio` project, change the current URL on `publish-confirm.js` file line 21, with the new getekeeper server URL

All the other functionalities (and studio-backend project) should work as expected.

## Development

For maintaining a consistent code style while developing, please use
[Visual Studio Code](https://code.visualstudio.com/)

# Authors

Idea: [Nicolò Carpignoli](https://twitter.com/nicolocarp)

Development: [AR.js Organisation](https://github.com/AR-js-org)
