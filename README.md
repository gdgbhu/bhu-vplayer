# bhu-vplayer
A Sample Youtube Video Player created with Polymer by GDG Bingham University

# Installation
You will need to have bower installed on your computer. If you don't have bower installed, simply install Node.js and run:

```npm -g install bower```

Now clone bhu-vplayer repository and run:

``` bower install ```

Before you can run the application, you need to create your Client ID from the Google Developer Console.

1. Create a new project using the Google Developer Console [here](https://console.developers.google.com/project).
2. Click the project name and navigate to **APIs & Auth -> Credentials**.
3. Under OAuth, click the blue "**Create new Client ID**" button. A popup dialog appears and you should select **Web Application** and enter your development/production URL (e.g. http://dev.bhu.gdg.ng) in the "**Authorized JavaScript origins**" section. Finally, clear any entry in the "**Authorized redirect URIs**" section and click the "**Create Client ID**" button.
4. Copy the Client ID and replace the placeholder text in **app/elements/bhu-vplayer/bhu-vplayer.js**


#Running bhu-vplayer App
You will need a web server to run the bhu-vplayer sample app. You can just drop the application directory into your Document Root or for those that have Python Installed, you can boot up a the Simple HTTP server by running ``` python -m SimpleHTTPServer ```

#Note: 


1. If you have a port number attached to you development URL, you need to ensure that it is part of your Authorized JavaScript origins in Google Developer Console i.e. **http://dev.bhu.gdg.ng:3000**
2. This is not production quality code, just intended for demo purposes.
3. To improve the performance of the app, you will have to use the vulcanize tool provided by the Polymer team to in-line all the elements used in the app. This will reduce the HTTP request give improved performance. To install vulcanize, simply use npm:
```npm -g install vulcanize```
now to vulcanize the app, run:
```vulcanize --inline-scripts --inline-css index.html```. You will have a **vulcanize.html** file which is the optimized version you can use for your demos.