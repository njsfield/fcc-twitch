// Users & API info

var channels = ["freecodecamp",
                "storbeck",
                "terakilobyte",
                "habathcx",
                "RobotCaleb",
                "thomasballinger",
                "noobs2ninjas",
                "beohoff",
                "brunofin",
                "comster404",
                "test_channel",
                "cretetion",
                "sheevergaming",
                "TR7K",
                "OgamingSC2",
                "ESL_SC2"];

var api = 'https://api.twitch.tv/kraken/channels/';
var id = 'qhxg85f34lno7aiwqamkta3cigv8xyv';
var callback = '?callback=getInfo';


// Document elements

var head = document.getElementsByTagName("script")[0];
var htmlElement = document.getElementById("theTable");

var loading =
document.getElementById("loading");



// Global object and table titles

var tableTitles = {logo: '', name: 'user', live: 'live', status: 'status'};
var global = [];




function getUsers(users) {

    users.forEach(function(user){

        var url = api + user;

        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.setRequestHeader("Client-ID", id);


        xhr.onload = function(){

            if (xhr.status >= 200 && xhr.status < 400) {

                var data = JSON.parse(xhr.responseText);

                appendInfo(data, user);


            } else {

                global.push({name: '<span class="inactive-user">' + user + '</span>',
                             logo: "",
                             live: "",
                             status: '<span class="inactive-account">Inactive Account</span>'});
            }
        };
        xhr.onerror = function() {
            console.log("big error");
        };

        xhr.send();
    });


}


function appendInfo(data, user) {

    var profile = {};

    profile.name = (data.status)? '<span class="online">' + user + '</span>' :
                                  '<span class="offline">' + user + '</span>';

    profile.logo = (data.logo)? '<img src="' + data.logo + '">' : "";

    profile.live = (data.live)? '<a class="live" href="' + data.live + '">✓</a>' :
                                                            "!";

    profile.status = (data.live)? '<a class="live" href="' + data.live + '">' + data.status + '</a>' :
                                    (data.status)? data.status : "Offline";

    global.push(profile);




    if (global.length === channels.length) {

        tableBuilder(global, tableTitles, htmlElement);
    }
}




// timeout if after three seconds not all requests are completed...
// if any are present, create table and clear the timeout


setInterval(function(){

    var table = document.getElementsByTagName("table")[0];

    if (!table && tableBuilder.length > 0) {

        tableBuilder(global, tableTitles, htmlElement);

        clearInterval();

    }


}, 3000);



var tableBuilder = function(json, parameters, id) {


    id.innerHTML = "", loading.innerHTML = "";

    var table = document.createElement("table");

    var titleRow = document.createElement("tr");


    // Append table headers

    for (var prop in parameters) {

        var title = document.createElement("td");

        title.innerHTML = parameters[prop].toUpperCase();

        titleRow.appendChild(title);

    }

    table.appendChild(titleRow);


    // Append cell data

    for (var i = 0; i < json.length; i++) {

        var row = document.createElement("tr");


        for (var prop in parameters) {

            var cell = document.createElement("td");

            cell.innerHTML = json[i][prop];

            row.appendChild(cell);
        }

        table.appendChild(row);

    }

    // Append to HTML Element

    id.appendChild(table);


};

getUsers(channels);




// Onclick buttons

var buttons = document.getElementsByTagName("button");


for (var i = 0; i < buttons.length; i++) {

    var that = buttons[i];

   that.addEventListener("click", (function(button){


        return function() {

            var count = 0;

            while(count < buttons.length) {

                buttons[count].classList.remove("btn-active");

                count++;
            }

            button.classList.add("btn-active");

            switch(button.innerHTML) {

                case "All" : tableBuilder(global, tableTitles, htmlElement);
                            break;

                case "Online" : tableBuilder(filter(global, "online"), tableTitles, htmlElement);
                            break;

                case "Offline" : tableBuilder(filter(global, "offline"), tableTitles, htmlElement);
                            break;


            }
        };


   })(that));

}

// function to filter global object

function filter(array, filterword) {

    var newArr = global.filter(function(profile){

        if (filterword === "online") {

            return profile.status.toLowerCase() !== "offline";

        } else {

            return profile.status.toLowerCase() === filterword;
        }

    });

    return newArr;


}

