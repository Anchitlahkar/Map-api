let latitude, longitude;
let destination;
let route

$(document).ready(function () {
    initGeolocation();
})

$(function () {
    $("#navigate-button").click(function () {
        $.ajax({
            url: `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude}%2C${latitude}%3B${destination.lng}%2C${destination.lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
            type: "get",
            success: function (response) {
                let steps = response.routes[0].legs[0].steps
                sendItemToApi(steps)
            }
        })
        alert("Naviagtion details send")
    })
})

function initGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    }
    else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}

function success(position) {
    longitude = position.coords.longitude;
    latitude = position.coords.latitude

    // Initializing Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 16
    });

    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }),
        'top-left'
    );

    map.on('click', function (e) {
        destination = e.lngLat;
    });

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );

    setTimeout(function () {
        $(".mapboxgl-ctrl-icon").click()
    }, 3000)
}

function sendItemToApi(route) {
    let distance = []
    let instruction = []
    let location = []

    for (i = 0; i < route.length; i++) {
        distance.push(route[i]["distance"])
        instruction.push(route[i]["maneuver"]["instruction"])
        location.push(route[i]["maneuver"]["location"])
    }


    var req = new XMLHttpRequest()
    req.open('POST', '/location-details')
    req.setRequestHeader("Content-Type", "application/json")
    req.send(JSON.stringify({
        route: {
            distance: distance,
            instruction: instruction,
            location, location
        }
    }))

    console.log(distance)
    console.log(instruction)
    console.log(location)

    req.addEventListener('load', () => {
        console.log(req.responseText)
        console.log("Request done")
    })

    req.addEventListener('error', (e) => {
        console.log(e)
    })
}