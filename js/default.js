﻿//Global Variables
var count = 0, player;
var pFlag = 0;
var audio1, audio2, audio3, audiovictory, audioButton;
var soundFlag = 1;

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.

                

                //create the 15x15 grid and add ids and classes
                $(document).ready(function () {
                    
                    initialize();
                    var i, j,id="";
                    var appString = "";
                    for (i = 0; i < 15; i++) {
                        for (j = 0; j < 15; j++) {
                            id = (i * 15) + j;
                            appString = "<div class='gridcell";
                            if (i == 0) appString += " topcell";
                            if (i == 14) appString += " bottomcell";
                            if (j == 0) appString += " leftcell";
                            if (j == 14) appString += " rightcell";
                            appString += "' id='" + id;
                            appString += "'></div>";
                            $("#gridcontainer").append(appString);
                        }
                    }

                    var i, j, id = "";
                    var tappString = "";
                    for (i = 0; i < 15; i++) {
                        for (j = 0; j < 15; j++) {
                            id = (i * 15) + j;
                            tappString = "<div class='gridcell";
                            if (i == 0) tappString += " topcell";
                            if (i == 14) tappString += " bottomcell";
                            if (j == 0) tappString += " leftcell";
                            if (j == 14) tappString += " rightcell";
                            tappString += "' id='" + (id+300);
                            tappString += "'></div>";
                            $("#tgridcontainer").append(tappString);
                        }
                    }

                    var i, j, id = "";
                    var aappString = "";
                    for (i = 0; i < 15; i++) {
                        for (j = 0; j < 15; j++) {
                            id = (i * 15) + j;
                            aappString = "<div class='gridcell";
                            if (i == 0) aappString += " topcell";
                            if (i == 14) aappString += " bottomcell";
                            if (j == 0) aappString += " leftcell";
                            if (j == 14) aappString += " rightcell";
                            aappString += "' id='" + (id + 700);
                            aappString += "'></div>";
                            $("#agridcontainer").append(aappString);
                        }
                    }

                    audio1 = document.createElement('audio');
                    audio1.setAttribute('src', '/tones/audio1.mp3');
                    audio2 = document.createElement('audio');
                    audio2.setAttribute('src', '/tones/player2.mp3');
                    audio3 = document.createElement('audio');
                    audio3.setAttribute('src', '/tones/player3.mp3');
                    audiovictory = document.createElement('audio');
                    audiovictory.setAttribute('src', '/tones/victory.mp3');
                    audioButton = document.createElement('audio');
                    audioButton.setAttribute('src', '/tones/root.mp3');
                    $.get();
                   
                });

                // Change z-index of divs
                $("#button2p").click(function () {
                    $("#placeholder").css('z-index', '2');
                    $("#overlay").css('z-index', '1');
                    pFlag = 2;
                    if(soundFlag==1) audioButton.play();
                });

                $("#button3p").click(function () {
                    $("#tplaceholder").css('z-index', '2');
                    $("#overlay").css('z-index', '1');
                    pFlag = 3;
                    if(soundFlag==1) audioButton.play();
                });

                $("#buttonAI").click(function () {
                    $("#aplaceholder").css('z-index', '2');
                    $("#overlay").css('z-index', '1');
                    pFlag = 10;
                    if(soundFlag==1) audioButton.play();
                });

                $("#soundBut").click(function () {
                    if (soundFlag == 1) {
                        $("#soundBut").html("Sound:OFF");
                        soundFlag = 0;
                    }
                    else {
                        $("#soundBut").html("Sound:ON");
                        soundFlag = 1;
                    }
                })

                // The click event handler for gridcells
                $(".gridcell").click(function(){
                    var clickedcell = this.id;
                    count++;
                    if (pFlag == 2) {
                        player = count % 2;
                        newClickReceived(player, clickedcell);
                        //displaygrid();
                    }
                    else if (pFlag == 3) {
                        player = count % 3;
                        newTClickReceived(player, clickedcell);
                    }

                    else if (pFlag == 10) {
                        
                        newAClickReceived(1, clickedcell);
                        Arti();
                    }
                });










            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    //User defined functions
    

    //Function when a new click is received
    function newClickReceived(player, cellid) {
        var win = false;
        var moveResp = move(player, cellid);
        if (!moveResp) count--;
        else {
            console.log("HERE");
            win = checkFinal(player);
            console.log(win);
            if (win) showPopUp(player);
        }
    }
    function newTClickReceived(player, cellid) {
        var win = false;
        var moveResp = tmove(player, cellid);
        if (!moveResp) count--;
        else {
            win = checkFinal(player);
            if (win) tshowPopUp(player);
        }
    }
    function newAClickReceived(player, cellid) {
        var win = false;
        var moveResp = amove(1, cellid);
        if (!moveResp) count--;
        else {
            win = checkFinal(player);
            if (win) ashowPopUp(player);
        }
    }

    function showPopUp(player) {
        if(soundFlag==1)audiovictory.play();
        if (player == 0) player = 2;
        var resultDiv = document.getElementById('resultDiv');
        var winString = "Player " + player + " has won";
        //Creating message dialog box
        var messagedialogpopup = new Windows.UI.Popups.MessageDialog
        ('Game Over', winString);

        // adding command to message dialog box
 
        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Replay', function () {
            //calling callback function for Yes command
            if(soundFlag==1) audioButton.play();
            initialize();
        }));
 
        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Exit', function () {
            //calling callback function for No command
            initialize();
            $("#overlay").css('z-index', '2');
            $("#placeholder").css('z-index', '1');
            if(soundFlag==1) audioButton.play();
        }));
 
        messagedialogpopup.showAsync();
    }


    function tshowPopUp(player) {
        if(soundFlag==1)audiovictory.play();
        if (player == 0) player = 3;
        var resultDiv = document.getElementById('resultDiv');
        var winString = "Player " + player + " has won";
        //Creating message dialog box
        var messagedialogpopup = new Windows.UI.Popups.MessageDialog
        ('Game Over', winString);

        // adding command to message dialog box

        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Replay', function () {
            //calling callback function for Yes command
            if(soundFlag==1) audioButton.play();
            tinitialize();
        }));

        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Exit', function () {
            //calling callback function for No command
            tinitialize();
            $("#overlay").css('z-index', '2');
            $("#tplaceholder").css('z-index', '1');
            if(soundFlag==1) audioButton.play();
        }));

        messagedialogpopup.showAsync();
    }

    function ashowPopUp(player) {
        if(soundFlag==1) audiovictory.play();
        if (player == 0) player = 2;
        var resultDiv = document.getElementById('resultDiv');
        var winString = "Player " + player + " has won";
        //Creating message dialog box
        var messagedialogpopup = new Windows.UI.Popups.MessageDialog
        ('Game Over', winString);

        // adding command to message dialog box

        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Replay', function () {
            //calling callback function for Yes command
            if(soundFlag==1)audioButton.play();
            ainitialize();
        }));

        messagedialogpopup.commands.append(new Windows.UI.Popups.UICommand('Exit', function () {
            //calling callback function for No command
            ainitialize();
            $("#overlay").css('z-index', '2');
            $("#aplaceholder").css('z-index', '1');
            if(soundFlag==1)audioButton.play();
        }));

        messagedialogpopup.showAsync();
    }

    app.start();
})();
