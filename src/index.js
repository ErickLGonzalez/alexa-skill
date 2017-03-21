var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE'
};

var location = "Miami Herald";

var numberOfResults = 5;

var welcomeMessage = "Welcome to the Miami Herald Newsroom. You can ask me for latest news, local news, sports, dolphins news, national news or say help. What will it be?";

var welcomeRepromt = "You can ask me for an latest news, local news, sports, dolphins news, national news or say help. What will it be?";

var HelpMessage = "Here are some things you  can say: Read me local news. Tell me the sports headlines. What is the national news. What would you like to do?";

var moreInformation = "See Miamiherald.com for more information."

var tryAgainMessage = "please try again."

var noSectionErrorMessage = "There was an error finding that section, " + tryAgainMessage;

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var latestIntroMessage = "These are the " + numberOfResults + " latest headlines from the Miami Herald, you can read more on miamiherald.com. ";

var hearMoreMessage = "Would you like to hear about what else happening on miamiherald.com?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Woodland Park Zoo", content: "located just 10 minutes north of downtown Seattle. The zoo's 92-acres and award-winning exhibits are home to more than 1,000 animals representing 300 species from around the world.", location: "There are two zoo entrances. \n West Entrance:\n Cross streets: Phinney Ave. N. between N. 55th St. & N. 56th St.\n Street address: 5500 Phinney Ave. N., Seattle WA 98103\n South Entrance:\n Cross streets: N. 50th Street & Fremont Ave. N.\n Street address: 750 N. 50th Street, Seattle WA 98103", contact: "zooinfo@zoo.org\n 206 548 2500" },
    { name: "EMP Museum", content: "Dedicated to contemporary popular culture, the EMP Museum was established by Microsoft co-founder Paul Allen in 2000.It's home to exhibits, interactive activity stations, sound sculpture, and various educational resources.", location: "325 5th Avenue N, Seattle, Washington", contact: "206 770 2700" },
    { name: "Waterfront Park", content: "Designed by the Bumgardner Partnership and consultants, Waterfront Park is a public park constructed on the site of the former Schwabacher Wharf. you can enjoy excellent views of the surrounding arey, such as the city skyline, ships in drydock, container cranes and the West Seattle Bridge.", location: "1401 Alaskan Way, Seattle, WA 98101, United States", contact: "206 684 4075" },
    { name: "Chihuly Garden and Glass", content: "Opened in 2012 on the former site of the Fun Forest, Chihuly Garden and Glass is an exhibit showcasing the work of Dale Chihuly. It comprises of three primary components: the Garden, the Glasshouse, and the Interior Exhibit. There is also a 90 seat cafe with additional outdoor dining.", location: "305 Harrison St, Seattle, WA 98109, United States", contact: "206 753 4940" },
    { name: "Woodland Park", content: "A 90 acre public park home to many species of birds and mammals. Woodland park boasts several picnic areas, a formal rose garden, ballfields, a miniature golf range and a play area for children.", location: "1000 N 50th St, Seattle, WA 98103, United States", contact: "206 684 4075" },
];

var topFive = [
    { number: "1", caption: "Visit the Space Needle and see Seattle from  above.", more: "Once the tallest structure west of the Mississippi River, The Space Needle is an observation tower that reaches a height of 605 feet. The observation deck falls slightly below this, offering views at 520 feet.", location: "400 Broad St. Seattle, WA 98109", contact: "400 Broad St. Seattle, WA 98109" },
    { number: "2", caption: "Get shopping at Pike Place Market.", more: "One of the oldest farmer's markets in America, Pike Place Market is Seattle's historic arcade of various vendors, winding alleys and stairways to lower levels. The market plays host to more than 10 million visitors annually.", location: "Pike Place Market PDA, 85 Pike Street, Room 500, Seattle, WA 98101", contact: "info@pikeplacemarket.org \n 206 682 7453" },
    { number: "3", caption: "Earn your  wings at the Museum  of Flight.", more: "This museum is a non-profit air and space museum located at the southern end of King County International Airport . It's the largest private museum of its kind in the world and attracts over 500,000 visitors every year", location: "9404 East Marginal Way South Seattle, WA 98108-4097", contact: "206 764 5700" },
    { number: "4", caption: "Breathe in the culture  at the Seattle Art  Museum.", more: "Also known as \"SAM\", the Seattle Art Museum maintains three major facilities: its main museum in downtown Seattle; the Seattle Asian Art Museum, and the Olympic Sculpture Park. The flagship museum is host to several great exhibitions and collections for you to experience.", location: "1300 First Ave Seattle, WA 98101", contact: "206 654 3100" },
    { number: "5", caption: "Take a spin on the  Seattle Great Wheel.", more: "See Seattle's skyline from the giant Ferris wheel situated on Pier 57. The Seattle Great Wheel is the largest observation wheel on the west coast, standing 175 feet tall.", location: "1301 Alaskan Way, Seattle, Washington 98101", contact: "greatwheel@pier57seattle.com \n 206 623 8607" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getLatestIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLatestIntent');
    },
    // 'getLocalIntent': function(){
    //     this.handler.state = states.SEARCHMODE;
    //     this.emitWithState('getLocalIntent');
    // },
    // 'getSportsIntent': function(){
    //     this.handler.state = states.SEARCHMODE;
    //     this.emitWithState('getSportsIntent');
    // },
    // 'getDolphinsIntent': function(){
    //     this.handler.state = states.SEARCHMODE;
    //     this.emitWithState('getDolphinsIntent');
    // },
    // 'getNationalIntent': function(){
    //     this.handler.state = states.SEARCHMODE;
    //     this.emitWithState('getDolphinsIntent');
    // },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getLatestIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by Miami Herald\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = latestIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData[i].titleText;
                        var headline = responseData[i].description;
                        var index = i + 1;

                        output += " Article " + index + ": " + headline + ":" + description + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your miamiherald.com for more information.";
            }

            var cardTitle = "Latest News";

            alexa.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        });
    },
    // 'getLocalIntent': function () {
    //     var cardTitle = location;
    //     var cardContent = "";
    //
    //     var attraction = attractions[Math.floor(Math.random() * attractions.length)];
    //     if (attraction) {
    //         output = attraction.name + " " + attraction.content + newline + moreInformation;
    //         cardTitle = attraction.name;
    //         cardContent = attraction.content + newline + attraction.contact;
    //
    //         this.emit(':tellWithCard', output, cardTitle, cardContent);
    //     } else {
    //         this.emit(':ask', noSectionErrorMessage, tryAgainMessage);
    //     }
    // },
    // 'getSportsIntent': function () {
    //     output = topFiveIntro;
    //     var cardTitle = "Top Five Things To See in " + location;
    //
    //     for (var counter = topFive.length - 1; counter >= 0; counter--) {
    //         output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
    //     }
    //     output += topFiveMoreInfo;
    //     this.handler.state = states.TOPFIVE;
    //     this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    // },
    // 'getDolphinsIntent': function () {
    //     output = topFiveIntro;
    //     var cardTitle = "Top Five Things To See in " + location;
    //
    //     for (var counter = topFive.length - 1; counter >= 0; counter--) {
    //         output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
    //     }
    //     output += topFiveMoreInfo;
    //     this.handler.state = states.TOPFIVE;
    //     this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    // },
    // 'getNationalIntent': function () {
    //     output = topFiveIntro;
    //     var cardTitle = "Top Five Things To See in " + location;
    //
    //     for (var counter = topFive.length - 1; counter >= 0; counter--) {
    //         output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
    //     }
    //     output += topFiveMoreInfo;
    //     this.handler.state = states.TOPFIVE;
    //     this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    // },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
        host: 'dev.miamifly.net',
        path: '/alexa/mhnewsfeed.json',
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
