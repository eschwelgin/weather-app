// ideal startup would grap lat and long from browser and show local weather 

var currentdate = new Date(); 
var datetime = (currentdate.getMonth()+1)  + "/" + currentdate.getDate() + "/"  + currentdate.getFullYear() 
var city 
var pullCity = [] //array to hold previously created buttons 

function bringData() {
    for (i = 0; i < 10; i++) {
        if  (localStorage.getItem ("name" + [i]) !== null) { 
            // console.log( [i] + "Contains Data")
            pullCity[i] = localStorage.getItem("name" + [i])
            console.log(pullCity[i])
            var newBtn = $("<button>")
            newBtn.attr("data", pullCity[i])
            newBtn.addClass("button")
            newBtn.text(pullCity[i])
            $(".nav").append(newBtn)
        }
    }
}
$(document).on("load", bringData()) //import data from local storage 

function appendData() { 
    for (i=0; i < 10; i++) {
        if  (localStorage.getItem ("name" + [i]) !== null) { 
            // console.log( [i] + "Contains Data")
        } else {
            localStorage.setItem("name" + [i], city)
            return
        }
    }
}

$(document).on("click", ".button", function() { // event listener for city buttons 
    var city = $(this).attr("data");
    createPage(city)
});

$("#search1").on("click", function() { //event listener for search box
    city = $("#search0").val()
    $("#search0").val('') //clears search box after search 
    var newBtn = $("<button>")
    newBtn.attr("data", city)
    newBtn.addClass("button")
    newBtn.text(city)
    $(".nav").append(newBtn)
    createPage(city)
    appendData(city)

});

function fiveDay(city) {
    var fiveDayURL= 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&units=imperial&APPID=0fcca0a55f891165d74b5e83db80f1a4'
    $.ajax({
        url: fiveDayURL,
        method: "GET"
      }).then(function(response) {

        console.log(response)
        for ( i=1; i<6; i++ ) {
            wrapper = $('<div class="col-sm">')
            wrapper.addClass("wrapper")

            div = $("<div>")
            div.addClass("main")

            head = $("<h2>")
            head.text(response.city.name + " " + (currentdate.getMonth()+1)  + "/" + (currentdate.getDate()+i))
            div.append(head)

            img = $("<img>")
            var iconURL = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"
            img.attr("src", iconURL)
            div.append(img)

            p1 = $("<p>")
            p1.text("Expected " + Math.round(response.list[i].main.temp) + "°F")
            div.append(p1)

            p2 = $("<p>")
            p2.text("Humidity " + Math.round(response.list[i].main.humidity) + "%")
            div.append(p2)

            wrapper.append(div)
            $("#fiveDayID").append(wrapper)
        }
    });
}

function getUV() {
    $.ajax({
        url: queryUVURL,
        method: "GET"
    }).then(function(response) {
        // console.log(response)
        p4 = $("<p>")
        p4.text("UV Index " + response.value )
        p3.append(p4)
    });
}

function createPage(city) {
    // var city = "asheville"
    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',us&units=imperial&APPID=0fcca0a55f891165d74b5e83db80f1a4'

    $("#container").text("") // clear page
    $("#fiveDayID").text("")

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        // console.log(response)
           
        wrapper = $("<div>")
        wrapper.addClass("wrapper")

        div = $("<div>")
        div.addClass("main")
    
        head = $("<h2>")
        head.text(response.name +" - "+ datetime)
        div.append(head)
    
        img = $("<img>")
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        img.attr("src", iconURL)
        div.append(img)
    
        p0 = $("<p>")
        p0.text("Feels Like " + Math.round(response.main.feels_like) + "°F")
        div.append(p0)
    
        p1 = $("<p>")
        p1.text("Actual " + Math.round(response.main.temp) + "°F")
        div.append(p1)

        p2 = $("<p>")
        p2.text("Humidity " + Math.round(response.main.humidity) + "%")
        div.append(p2)
    
        p3 = $("<p>")
        p3.attr("class", "something")
        p3.text("Wind " + Math.round(response.wind.speed) + " MPH")
        div.append(p3)
    
        lat = response.coord.lat
        lon = response.coord.lon
        queryUVURL = 'http://api.openweathermap.org/data/2.5/uvi?APPID=0fcca0a55f891165d74b5e83db80f1a4&lat=' + lat + '&lon=' + lon
    
            getUV()
    
        wrapper.append(div)

        div = $("<div>")
        div.addClass("sun-foot")

        img = $("<img>")
        img.addClass("floatL")
        img.attr("src", "sunrise.png")
        div.append(img)

        p5 = $("<p>")
        sRise = response.sys.sunrise
        sRiseDate = new Date(sRise*1000)
        // console.log(sRiseDate)
        sRiseTime = sRiseDate.getHours() + ":" + ('0'+sRiseDate.getMinutes()).slice(-2) // get the rightmost 2 digits 
        p5.text(sRiseTime + "am")
        p5.addClass("floatL")
        div.append(p5)

        img = $("<img>")
        img.addClass("floatR")
        img.attr("src", "sunset.png")
        div.append(img)

        p6 = $("<p>")
        sSet = response.sys.sunset
        sSetDate = new Date(sSet*1000)
        // console.log(sSetDate)
        sSetTime = (sSetDate.getHours()-12) + ":" + ('0'+sSetDate.getMinutes()).slice(-2)
        p6.text(sSetTime + "pm")
        p6.addClass("floatR")
        div.append(p6)
        wrapper.append(div)

        $("#container").append(wrapper)
        fiveDay(city)

    });
}
createPage()
