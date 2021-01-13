var state = []

var teams = {"team1": {"players": [], "points": 0}, "team2": {"players": [], "points": 0}, "team3": {"players": [], "points": 0}, "team4": {"players": [], "points": 0}, "team5": {"players": [], "points": 0}}

var team = ""
var name = ""

var remainingTime = 0

var currentTeam = ""

const container = document.getElementById("gameContainer")

var refreshState = async () => {
    fetch(`https://bioszjeopardy.herokuapp.com/getall?name=${name}&team=${team}`).then((res) => res.json()).then((res) => {
        var newState = res.board
        if(JSON.stringify(state) !== JSON.stringify(newState)) {
            console.log("board changed")
            state = newState
            renderBoard(state[0], state.slice(1, state.length - 1))
        }
        else {
            console.log("no change on board")
        }


        var newCurrentTeam = res.currentTeam

        if(newCurrentTeam !== currentTeam){
            console.log("current team changed")
            remainingTime = 0
            currentTeam = newCurrentTeam
            currentTeamRender(currentTeam)
        }

        var newTeams = res.teams

        if(JSON.stringify(teams) !== JSON.stringify(newTeams)){
            console.log("teams changed")
            teams = newTeams
            renderTeams(teams)
        }
        else{
            console.log("no change in teams");
        }

        document.getElementById("timer").innerText = res.timeStamp
    })
}

var currentTeamRender = (currentTeam) => {
    for(i in teams) {
        console.log(i);
        console.log(currentTeam);
        if(currentTeam === i) {
            document.getElementById(i+"cucc").style.fontWeight = "bold"
        }
        else {
            document.getElementById(i+"cucc").style.fontWeight = "normal"
        }
    }   
}

var renderBoard = (names, boardState) => {
    newGame = ""
    newGame += "<tr>"
    for(i of names) {
        newGame += `<td class="title"><b>${i}</td>`
    }
    newGame += "</tr>"
    var k = 1
    for(i in boardState) {
        newGame += "<tr>"

        for(j in boardState[i]) {
            if(boardState[i][j].status === "unclaimed") {
                newGame += `<td id="r${i}c${j}" class="unclaimed">${k*100} pont</td>`
            }
            else if(boardState[i][j].status === "claimed") {
                newGame += `<td id="r${i}c${j}" class="claimed">${boardState[i][j].kérdés}</td>`
            }
            else {
                newGame += `<td id="r${i}c${j}" class="current">${boardState[i][j].kérdés}</td>`
            }
        }

        newGame += "</tr>"
        k += 1
    }
    container.innerHTML = newGame
}

var renderTeams = (teams) => {
    for(i in teams) {
        document.getElementById(i+"Players").innerText = teams[i].players
        document.getElementById(i+"Points").innerText = teams[i].points
    }
}

onclick = (ev) => {
    console.log(ev);
    switch(ev.target.className){
        case "unclaimed":
            fetch("https://bioszjeopardy.herokuapp.com/choosenext", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"team": team, "name": name, target: ev.target.id})
            })
            break
        
        case "claimed":

            break
        
        case "current":

            break
        
        case "buzzer":
            fetch(`https://bioszjeopardy.herokuapp.com/buzzedin?team=${team}&name=${name}&time=${Date.now()}`, {
                mode: "no-cors"
            })
            break

        case "joinTeam":
            if(document.getElementById("nameInput").value.trim() != ""){
                team = ev.target.id
                name = document.getElementById("nameInput").value.trim()
                fetch("https://bioszjeopardy.herokuapp.com/newPlayer", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"name": name, "team": team})
                })
                document.getElementById("login").style.display = "none"
                document.getElementById("container").style.display = "block"
                refreshState()
                setInterval(() => refreshState(), 500)
            }
            else{
                alert("nana, írjál valamit")
            }
        break
    }
}

