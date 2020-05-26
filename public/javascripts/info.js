/**
 *Get hero info from server by id
 *
 *@constructor
 *@param {Number} id - ID of the hero from DotaAPI
 */  
function Info(id){
	var winrate = [[20, 48], [21, 48.9], [22, 51.5], [23, 60], [24, 48.3]]
	var averwr = Math.floor((winrate[0][1] + winrate[1][1] + winrate[2][1] + winrate[3][1] + winrate[4][1])*20)/100
	var averkl = 7
	var avergpm = 456
	var averxpm = 501
	var averkda = 3.2
	var avercr = 136
	j = 0
	for (let i = 0; i < 5; i++){
		sessionStorage.setItem(j+1, winrate[i][0])
		sessionStorage.setItem(j+2, winrate[i][1])
		j+=2
	}
	sessionStorage.setItem(11, id)
	sessionStorage.setItem(12, averwr)
	sessionStorage.setItem(13, averkl)
	sessionStorage.setItem(14, avergpm)
	sessionStorage.setItem(15, averxpm)
	sessionStorage.setItem(16, averkda)
	sessionStorage.setItem(17, avercr)
}