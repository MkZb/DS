/**
 *Getting information about the player from the server
 *
 *@constructor
 */

$(function () {
    $('#ajaxBtn1').click(function () {
        let post_data = {
            id: document.getElementById('getaccountid').value,
            type: 'player'
        }
        $.post('https://localhost:3000/finder',   // request url
            post_data,
            function (data, status, jqXHR) {// success callback
                if (data !== '0') {
                    $('#head1').empty().append('Games participated:\n');
                    let matches_printed = 0
                    for (let i = 0; i < data.length; i++) {
                        if (matches_printed > 15) {
                            break;
                        }
                        $('#head1').append(data[i] + '\n')
                        matches_printed++
                    }
                } else {
                    $('#head1').empty().append('Player not found');
                }
            })
    });

});
$(function () {
    $('#ajaxBtn2').click(function () {
        let post_data = {
            id: document.getElementById('getmatchid').value,
            type: 'game'
        }
        $.post('https://localhost:3000/finder',   // request url
            post_data,
            function (data, status, jqXHR) {// success callback
                if (data !== '0') {
                    $('#head2').empty().append('Match duration: '+ data['duration']);
                } else {
                    $('#head2').empty().append('Match not found');
                }
            })
    });

});