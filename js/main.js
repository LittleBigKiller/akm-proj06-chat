var myNickName = null
var myColor = null
var myLoginTimestamp = null
var myLastMessage = 0

function getAll() {
    $.ajax({
        method: 'POST',
        url: 'php/alp.php',
        data: {
            action: 'get',
            lts: myLoginTimestamp
        }
    })
        .success(function (msg) {
            DisplayMessages(JSON.parse(msg))
        })
}

function getLastMsg() {
    $.ajax({
        method: 'POST',
        url: 'php/alp.php',
        data: {
            action: 'getLastId'
        }
    })
        .success(function (msg) {
            myLastMessage = JSON.parse(msg)[0].id
            setTimeout(getMessages, 200)
        })
}

function getMessages() {
    $.ajax({
        method: 'POST',
        url: 'php/alp.php',
        data: {
            action: 'getMessages',
            lts: myLoginTimestamp,
            id: myLastMessage
        },
        complete: getMessages
    })
        .success(function (msg) {
            DisplayMessages(JSON.parse(msg))
        })
}

function sendMessage(msg) {
    $.ajax({
        method: 'POST',
        url: 'php/alp.php',
        data: {
            action: 'sendMessage',
            nn: myNickName,
            msg: msg,
            c: myColor,
        }
    })
}

function DisplayMessages(array) {
    let cd = $('#chat-display') /* .empty() */
    for (let i in array) {
        let cont = $('<p>').css('color', '#FFFFFF')

        let msgDate = new Date(parseInt(array[i].timestamp) * 1000)
        let timeString = msgDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })

        let timestamp = $('<a>').html('[' + timeString + '] <')
        let name = $('<a>').html('@' + array[i].name).css('color', array[i].color)
        let msg = $('<a>').html('> ' + array[i].message).emoticonize({delay: 100, animate: false})
        cont.append(timestamp).append(name).append(msg)
        cd.append(cont)

        if (i == array.length - 1) myLastMessage = array[i].id
    }
    if (array.length) cd.scrollTop(cd.height())
}

function CreateListeners() {
    $('#login-box-button').on('click', () => {
        $('#login-screen').css('display', 'none')

        myNickName = $('#login-box-name').val()
        myColor = $('#login-box-color').val()
        myLoginTimestamp = parseInt(Date.now() / 1000 - 1) // botched conversion to seconds

        getLastMsg()
    })

    $('#chat-input').on('keyup', (e) => {
        if (e.keyCode === 13 && e.target.value != '') {
            sendMessage(e.target.value)
            e.target.value = ''
        }
    })
}

function LogData() {
    console.log('MY NICKNAME: ' + myNickName)
    console.log('MY COLOR: ' + myColor)
    console.log('MY TIMESTAMP: ' + myLoginTimestamp)
}