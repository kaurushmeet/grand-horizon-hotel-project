/*
 GRANDHORIZON HOTEL MANAGEMENT SYSTEM
 Beginner-friendly JavaScript:
 variables, arrays, objects, functions, if-else, for loops,
 DOM methods, events and localStorage.
*/

// PART 1: DEFAULT ROOM DATA (array of objects)
var defaultRooms = [
 {id:"101", name:"Ocean Room 101", type:"Standard King", price:120, status:"Vacant", cleanStatus:"Clean", image:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=700&q=80"},
 {id:"102", name:"Ocean Room 102", type:"Standard King", price:120, status:"Occupied", cleanStatus:"Clean", image:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=700&q=80"},
 {id:"201", name:"Vista Suite 201", type:"Deluxe Suite", price:250, status:"Vacant", cleanStatus:"Dirty", image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80"},
 {id:"202", name:"Vista Suite 202", type:"Deluxe Suite", price:250, status:"Occupied", cleanStatus:"In Progress", image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80"},
 {id:"301", name:"Penthouse Horizon", type:"Presidential", price:500, status:"Vacant", cleanStatus:"Clean", image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80"}
];

// PART 2: DEFAULT BOOKINGS
var defaultBookings = [
 {id:"B-9901", guest:"Alice Smith", roomId:"102", checkIn:"2026-11-01", checkOut:"2026-11-05", active:true},
 {id:"B-9902", guest:"Bob Jones", roomId:"202", checkIn:"2026-11-02", checkOut:"2026-11-06", active:true}
];

// PART 3: DEFAULT HISTORY
var defaultHistory = [
 {guest:"Charlie Brown", roomName:"Ocean Room 101", duration:"10/28 - 10/30", event:"Checked Out"}
];

// PART 4: LOAD SAVED DATA
// localStorage stores information in this browser.
// JSON.parse converts saved text into JavaScript data.
function loadData(key, defaultData) {
    var savedData = localStorage.getItem(key);

    if (savedData === null) {
        return defaultData;
    } else {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            return defaultData;
        }
    }
}

var rooms = loadData("hotel_rooms", defaultRooms);
var bookings = loadData("hotel_bookings", defaultBookings);
var historyLogs = loadData("hotel_history", defaultHistory);

// PART 4A: KEEP ROOM PHOTOS WHEN OLD BROWSER DATA IS LOADED
// Older saved room records may not contain an image property.
// Match each saved room with its default record and restore a missing photo.
var roomIndex;
var defaultIndex;

for (roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
    if (!rooms[roomIndex].image) {
        for (defaultIndex = 0; defaultIndex < defaultRooms.length; defaultIndex++) {
            if (rooms[roomIndex].id === defaultRooms[defaultIndex].id) {
                rooms[roomIndex].image = defaultRooms[defaultIndex].image;
                break;
            }
        }
    }
}

// PART 5: SAVE DATA
// JSON.stringify converts arrays into text for localStorage.
function saveData() {
    localStorage.setItem("hotel_rooms", JSON.stringify(rooms));
    localStorage.setItem("hotel_bookings", JSON.stringify(bookings));
    localStorage.setItem("hotel_history", JSON.stringify(historyLogs));
    renderWebsite();
}

// PART 6: FIND A ROOM USING ITS ID
function getRoomById(roomId) {
    var i;
    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomId) {
            return rooms[i];
        }
    }
    return null;
}

// PART 7: CSS CLASS HELPERS
function getCleanClass(status) {
    if (status === "Clean") {
        return "clean-pill";
    } else if (status === "Dirty") {
        return "dirty-pill";
    } else {
        return "progress-pill";
    }
}

function getRoomStatusClass(status) {
    if (status === "Vacant") {
        return "vacant-pill";
    } else {
        return "occupied-pill";
    }
}

// PART 8: DISPLAY ROOM CARDS
function displayRoomCards(elementId) {
    var output = "";
    var i;

    for (i = 0; i < rooms.length; i++) {
        output += '<div class="room-card">';
        output += '<div class="room-photo" style="background-image:url(' + rooms[i].image + ')"></div>';
        output += '<div class="room-number">' + rooms[i].id + '</div>';
        output += '<div class="room-name">' + rooms[i].name + '</div>';
        output += '<div class="room-type">' + rooms[i].type + '</div>';
        output += '<div class="room-price">$' + rooms[i].price + '</div>';
        output += '<span class="status-pill ' + getRoomStatusClass(rooms[i].status) + '">';
        output += rooms[i].status + ' • ' + rooms[i].cleanStatus + '</span></div>';
    }

    document.getElementById(elementId).innerHTML = output;
}

// PART 9: DASHBOARD COUNTERS
function displayDashboardNumbers() {
    var activeCount = 0;
    var readyCount = 0;
    var pendingCount = 0;
    var i;

    for (i = 0; i < bookings.length; i++) {
        if (bookings[i].active === true) {
            activeCount++;
        }
    }

    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].status === "Vacant" && rooms[i].cleanStatus === "Clean") {
            readyCount++;
        }

        if (rooms[i].cleanStatus !== "Clean") {
            pendingCount++;
        }
    }

    document.getElementById("total-bookings").innerHTML = activeCount;
    document.getElementById("ready-rooms").innerHTML = readyCount;
    document.getElementById("pending-rooms").innerHTML = pendingCount;
}

// PART 10: CONFLICT ALERTS
function displayConflictAlerts() {
    var output = "";
    var count = 0;
    var i;

    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].status === "Vacant" && rooms[i].cleanStatus !== "Clean") {
            output += '<div class="alert-message">Room ' + rooms[i].id +
                      ' is vacant but marked ' + rooms[i].cleanStatus + '.</div>';
            count++;
        } else if (rooms[i].status === "Occupied" && rooms[i].cleanStatus === "Dirty") {
            output += '<div class="alert-message">Room ' + rooms[i].id +
                      ' is occupied but marked Dirty.</div>';
            count++;
        }
    }

    if (count === 0) {
        output = '<p class="no-alert">No conflicts detected.</p>';
    }

    document.getElementById("alert-list").innerHTML = output;
}

// PART 11: HOUSEKEEPING MONITOR
function displayMiniHousekeeping() {
    var output = "";
    var i;

    for (i = 0; i < rooms.length; i++) {
        var dotClass = "dot-clean";

        if (rooms[i].cleanStatus === "Dirty") {
            dotClass = "dot-dirty";
        } else if (rooms[i].cleanStatus === "In Progress") {
            dotClass = "dot-progress";
        }

        if (rooms[i].cleanStatus !== "Clean" || rooms[i].id === "101") {
            output += '<div class="status-line"><span><i class="dot ' + dotClass +
                      '"></i>Room ' + rooms[i].id + '</span>';
            output += '<span class="status-pill ' + getCleanClass(rooms[i].cleanStatus) +
                      '">' + rooms[i].cleanStatus + '</span></div>';
        }
    }

    document.getElementById("mini-housekeeping").innerHTML = output;
}

// PART 12: BOOKING HISTORY
function displayHistory() {
    var output = "";
    var i;

    for (i = 0; i < historyLogs.length; i++) {
        output += "<tr><td>" + historyLogs[i].guest + "</td>";
        output += "<td>" + historyLogs[i].roomName + "</td>";
        output += "<td>" + historyLogs[i].duration + "</td>";
        output += '<td><span class="status-pill clean-pill">' + historyLogs[i].event + "</span></td></tr>";
    }

    document.getElementById("history-table").innerHTML = output;
}

// PART 13: ACTIVE BOOKING TABLES
function displayBookings(elementId, showGuest) {
    var output = "";
    var activeCount = 0;
    var i;

    for (i = 0; i < bookings.length; i++) {
        if (bookings[i].active === true) {
            output += "<tr><td>" + bookings[i].id + "</td>";

            if (showGuest === true) {
                output += "<td>" + bookings[i].guest + "</td>";
            }

            output += "<td>" + bookings[i].roomId + "</td>";
            output += "<td>" + bookings[i].checkIn + " → " + bookings[i].checkOut + "</td>";

            if (showGuest === true) {
                output += '<td><button class="action-button danger-button" data-checkout="' +
                          bookings[i].id + '">Check-Out</button></td>';
            } else {
                var checkInLabel = bookings[i].checkedIn === true ? "Checked In" : "Check-In";
                var checkInClass = bookings[i].checkedIn === true ? "completed-button" : "";
                output += '<td><button class="action-button ' + checkInClass +
                          '" data-checkin="' + bookings[i].id + '"' +
                          (bookings[i].checkedIn === true ? ' disabled' : '') + '>' +
                          checkInLabel + '</button></td>';
            }

            output += "</tr>";
            activeCount++;
        }
    }

    if (activeCount === 0) {
        output = '<tr><td colspan="5">No active bookings.</td></tr>';
    }

    document.getElementById(elementId).innerHTML = output;
}

// PART 14: HOUSEKEEPING TABLE
function displayCleaningTable(elementId, showName) {
    var output = "";
    var i;

    for (i = 0; i < rooms.length; i++) {
        var buttonText = "";
        var newStatus = "";

        if (rooms[i].cleanStatus === "Clean") {
            buttonText = "Mark Dirty";
            newStatus = "Dirty";
        } else {
            buttonText = "Mark Clean";
            newStatus = "Clean";
        }

        output += "<tr><td>" + rooms[i].id + "</td>";

        if (showName === true) {
            output += "<td>" + rooms[i].name + "</td>";
        }

        if (showName === true) {
            output += "<td>" + rooms[i].type + "</td>";
        } else {
            output += "<td>" + rooms[i].type + "</td>";
        }
        output += '<td><span class="status-pill ' + getCleanClass(rooms[i].cleanStatus) +
                  '">' + rooms[i].cleanStatus + "</span></td>";
        output += '<td><span class="status-pill ' + getRoomStatusClass(rooms[i].status) +
                  '">' + rooms[i].status + "</span></td>";
        output += '<td><button class="action-button" data-room="' + rooms[i].id +
                  '" data-status="' + newStatus + '">' + buttonText + "</button></td></tr>";
    }

    document.getElementById(elementId).innerHTML = output;
}

// PART 15: ROOM DROP-DOWN IN THE RESERVATION FORM
function fillRoomDropdown() {
    var output = '<option value="">Select a ready room</option>';
    var count = 0;
    var i;

    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].status === "Vacant" && rooms[i].cleanStatus === "Clean") {
            output += '<option value="' + rooms[i].id + '">' + rooms[i].name +
                      ' - $' + rooms[i].price + '/night</option>';
            count++;
        }
    }

    if (count === 0) {
        output = '<option value="">No ready rooms available</option>';
    }

    document.getElementById("room-choice").innerHTML = output;
}

// PART 16: REFRESH ALL WEBSITE SECTIONS
function renderWebsite() {
    displayDashboardNumbers();
    displayConflictAlerts();
    displayMiniHousekeeping();
    displayHistory();
    displayRoomCards("dashboard-room-cards");
    displayRoomCards("all-room-cards");
    displayBookings("dashboard-bookings", false);
    displayBookings("all-bookings-table", true);
    displayCleaningTable("dashboard-cleaning-table", false);
    displayCleaningTable("all-cleaning-table", true);
    fillRoomDropdown();
}

// PART 17: NAVIGATION USING CLICK EVENTS
function openPage(pageId) {
    var pages = document.getElementsByClassName("page");
    var buttons = document.getElementsByClassName("nav-button");
    var i;

    for (i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active-page");
    }

    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    document.getElementById(pageId).classList.add("active-page");

    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("data-page") === pageId) {
            buttons[i].classList.add("active");
        }
    }
}

var navButtons = document.getElementsByClassName("nav-button");
var n;

for (n = 0; n < navButtons.length; n++) {
    navButtons[n].addEventListener("click", function () {
        openPage(this.getAttribute("data-page"));
    });
}

var viewButtons = document.getElementsByClassName("text-button");
var v;

for (v = 0; v < viewButtons.length; v++) {
    viewButtons[v].addEventListener("click", function () {
        openPage(this.getAttribute("data-open-page"));
    });
}

// PART 18: RESERVATION FORM SUBMISSION
document.getElementById("reservation-form").addEventListener("submit", function (event) {
    event.preventDefault();

    var guestName = document.getElementById("guest-name").value;
    var roomId = document.getElementById("room-choice").value;
    var checkIn = document.getElementById("check-in").value;
    var checkOut = document.getElementById("check-out").value;
    var selectedRoom = getRoomById(roomId);

    if (guestName === "" || selectedRoom === null) {
        alert("Please enter the guest name and select a ready room.");
        return;
    }

    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    if (selectedRoom.status !== "Vacant" || selectedRoom.cleanStatus !== "Clean") {
        alert("This room is not available. Please choose another room.");
        return;
    }

    var newNumber = 9901 + bookings.length;
    var newBooking = {
        id: "B-" + newNumber,
        guest: guestName,
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        active: true
    };

    bookings.push(newBooking);
    selectedRoom.status = "Occupied";

    saveData();
    document.getElementById("reservation-form").reset();
    alert("Reservation added successfully!");
});

// PART 19: HOUSEKEEPING AND CHECK-OUT BUTTON EVENTS
// The document listens because these buttons are created later by JavaScript.
document.addEventListener("click", function (event) {

    // Housekeeping status button
    if (event.target.hasAttribute("data-room")) {
        var roomId = event.target.getAttribute("data-room");
        var newStatus = event.target.getAttribute("data-status");
        var room = getRoomById(roomId);

        if (room !== null) {
            room.cleanStatus = newStatus;
            saveData();
        }
    }

    // Guest check-in button
    if (event.target.hasAttribute("data-checkin")) {
        var checkInId = event.target.getAttribute("data-checkin");
        var bookingIndex;

        for (bookingIndex = 0; bookingIndex < bookings.length; bookingIndex++) {
            if (bookings[bookingIndex].id === checkInId && bookings[bookingIndex].active === true) {
                bookings[bookingIndex].checkedIn = true;
                saveData();
                alert("Guest checked in successfully!");
                break;
            }
        }
    }

    // Guest check-out button
    if (event.target.hasAttribute("data-checkout")) {
        var bookingId = event.target.getAttribute("data-checkout");
        var i;

        for (i = 0; i < bookings.length; i++) {
            if (bookings[i].id === bookingId && bookings[i].active === true) {
                bookings[i].active = false;

                var checkedOutRoom = getRoomById(bookings[i].roomId);

                if (checkedOutRoom !== null) {
                    checkedOutRoom.status = "Vacant";
                    checkedOutRoom.cleanStatus = "Dirty";

                    var historyItem = {
                        guest: bookings[i].guest,
                        roomName: checkedOutRoom.name,
                        duration: bookings[i].checkIn + " - " + bookings[i].checkOut,
                        event: "Checked Out"
                    };

                    historyLogs.push(historyItem);
                }

                saveData();
                alert("Guest checked out. Room is now waiting for cleaning.");
                break;
            }
        }
    }
});

// PART 20: START THE WEBSITE
renderWebsite();
