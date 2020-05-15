
var teamNames = [];
var teamNameIdMap = {};
var playerUrl = 'https://www.opendota.com/players/';
var matchesUrl = 'https://www.opendota.com/matches/';
var topTeamsCount = 250;


function initPage(){
    fetch('https://api.opendota.com/api/teams')
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        var counter =0;
        res.forEach(team => {
                counter++;
                if(counter > topTeamsCount) return;
                teamNames.push(team.name);
                teamNameIdMap[team.name] = team.team_id;
                var teamDropdown = document.getElementById('teamsDropDrown');
                teamDropdown.innerHTML = '';
                teamNames.forEach(team=>{
                var teamOptElement = document.createElement('option');
                teamOptElement.value = team;
                teamOptElement.innerHTML = team;
                teamDropdown.appendChild(teamOptElement);
        });
        });
        initPlayersUI(teamNameIdMap['Team Secret']);

    });
}

function initPlayersUI(teamId){
    fetch('https://api.opendota.com/api/teams/'+teamId+'/players')
    .then(function(response){
        return response.json();
    })
    .then(function(players){
        $("#playerTable").find("tr:gt(0)").remove();
        for(let i=0;i<players.length;i++){
            var th = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.innerHTML = players[i].name !== null ? players[i].name : '--';
            var tdGamesPlayed = document.createElement('td');
            tdGamesPlayed.innerHTML = players[i].games_played;
            var tdGamesWon = document.createElement('td');
            tdGamesWon.innerHTML = players[i].wins;
            var tdplayerLink = document.createElement('td');
            var playerProfileElement = document.createElement('a')
            playerProfileElement.href = playerUrl + players[i].account_id
            playerProfileElement.innerHTML = 'LINK';
            playerProfileElement.setAttribute("target", "_blank");
            tdplayerLink.appendChild(playerProfileElement);
            th.appendChild(tdName);
            th.appendChild(tdGamesPlayed);
            th.appendChild(tdGamesWon);
            th.appendChild(tdplayerLink);
            document.getElementById('playerTable').appendChild(th);
         }
         $('#loading').hide();
         $('.nav-tabs').show();
         $('.tab-content').show();
         $('h2').show();
         initTournamentsTable();
    });
    $( "#teamsDropDrown" ).change(function() {
        initPlayersUI(teamNameIdMap[this.value]);
    });
      
}


function initTournamentsTable(){
    fetch('https://api.opendota.com/api/proMatches')
    .then(function(response){
        return response.json();
    })
    .then(function (leauges){
        $("#leaugesTable").find("tr:gt(0)").remove();
        for(let i=0;i<10;i++){
            var th = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.innerHTML = leauges[i].league_name !== null ? leauges[i].league_name : '--';
            var tdGamesPlayed = document.createElement('td');
            tdGamesPlayed.innerHTML = leauges[i].radiant_name;
            var tdGamesWon = document.createElement('td');
            tdGamesWon.innerHTML = leauges[i].dire_name;
            var tdplayerLink = document.createElement('td');
            var playerProfileElement = document.createElement('a')
            playerProfileElement.href = matchesUrl + leauges[i].match_id
            playerProfileElement.innerHTML = leauges[i].radiant_win ? 'Radiant' : 'Dire';
            playerProfileElement.setAttribute("target", "_blank");
            tdplayerLink.appendChild(playerProfileElement);
            th.appendChild(tdName);
            th.appendChild(tdGamesPlayed);
            th.appendChild(tdGamesWon);
            th.appendChild(tdplayerLink);
            document.getElementById('leaugesTable').appendChild(th);
         }
    })
}



$(document).ready(function() {
    $('.js-example-basic-single').select2();
    $('.nav-tabs').hide();
    $('.tab-content').hide();
    $('h2').hide();
    initPage();
});