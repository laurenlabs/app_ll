function getPlayers(){
    jQuery.ajax({
        url: 'http://player-api.developer.alchemy.codes/api/players', // url where to submit the request
        type : "GET", // type of action POST || GET
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + sessionStorage.accessToken);
            
        },
        dataType : 'json', // data type
        data : jQuery("#add-player").serialize(), // post data || get data
        success : function(result) {
            // Don't need to set this every time.
            // sessionStorage.accessToken = result.token;

            // pluck players from the response
            var players = result.players;
            // grab the player container div and empty it
            var container = $('table.player-list');
            container.html('');

            // loop through each of the players
            jQuery.each(players, function(index, player) {
                container.append('<tr><td>' + player.last_name + '</td><td>' + player.first_name + '</td><td>' + player.handedness + '</td><td>' + player.rating + '</td><td><button type="" class="btn btn-danger" id="' + player.id + '"><span class="glyphicon glyphicon-remove"></button</td></tr>');
            });
            $("button").click(function() {
                var selectedID = this.id;
                deletePlayer(selectedID);
            });
        },
        error: function(xhr, resp, text) {
            //console.log(xhr, resp, text);
            // Show error message
            jQuery('#error').html(xhr.responseJSON.error.message).show();
        }
    })
};

function deletePlayer(selectedID) {
    //console.log(selectedID);
     $.ajax({
        url: 'http://player-api.developer.alchemy.codes/api/players/'+selectedID, // url where to submit the request
        type : "DELETE", // type of action POST || GET
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + sessionStorage.accessToken);
            jQuery('#success').hide();
            jQuery('#error').hide();
        },
        success : function(result) {
            jQuery('#success').html("Player removed from your roster.").show();
            getPlayers();
        },
        error: function(xhr, resp, text) {
            //console.log(xhr, resp, text);
            jQuery('#error').html(xhr.responseJSON.error.message).show();
        }
    })
}


jQuery(document).ready(function($) {

    //New user sign up
    $("#signUp").submit(function( event ){
        event.preventDefault();
        $.ajax({
            url: 'http://player-api.developer.alchemy.codes/api/user', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type
            data : $("#signUp").serialize(), // post data || get data
            success : function(result) {
                sessionStorage.accessToken = result.token;
                location.href = "./player.html";
            },
            error: function(xhr, resp, text) {
                //console.log(xhr, resp, text);
                jQuery('#error').html(xhr.responseJSON.error.message).show();
            }
        })
    });

    //Existing user sign in
    $("#signIn").submit(function( event ){
        event.preventDefault();
        $.ajax({
            url: 'http://player-api.developer.alchemy.codes/api/login', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type
            data : $("#signIn").serialize(), // post data || get data
            success : function(result) {
                //console.log(result);
                sessionStorage.accessToken = result.token;
                location.href = "./player.html";
            },
            error: function(xhr, resp, text) {
                //console.log(xhr, resp, text);
                jQuery('#error').html(xhr.responseJSON.error.message).show();
            }
        })
    });

    //Add a player to your list
    $("#add-player").submit(function( event ){
        event.preventDefault();
        $.ajax({
            url: 'http://player-api.developer.alchemy.codes/api/players', // url where to submit the request
            type : "POST", // type of action POST || GET
            beforeSend: function(request) {
                jQuery('#success').hide();
                jQuery('#error').hide();
            },
            headers: {
                'Authorization':'Bearer ' + sessionStorage.accessToken
            },
            dataType : 'json', // data type
            data : $("#add-player").serialize(), // post data || get data
            success : function(result) {
                getPlayers();
                jQuery('#success').html("New player added to your roster.").show();
            },
            error: function(xhr, resp, text) {
                //console.log(xhr);
                jQuery('#error').html(xhr.responseJSON.error.message).show();
            }
        })
    });

});
