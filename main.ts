function showYourTurn() {
    for (let index2 = 0; index2 < 3; index2++) {
        basic.clearScreen()
        basic.pause(100)
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . . . .
            . . # . .
            `)
        basic.pause(10)
    }
    basic.clearScreen()
    drawLed(numLeds)
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (!loadingIDs) {
        basic.clearScreen()
        if (yourTurn) {
            if (selectedToRemove < 3) {
                selectedToRemove += 1
            } else {
                selectedToRemove = 1
            }
            
            basic.showNumber(selectedToRemove)
        } else {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(500)
            basic.clearScreen()
            drawLed(numLeds)
        }
        
    }
    
})
input.onGesture(Gesture.LogoUp, function on_gesture_logo_up() {
    if (canClear) {
        basic.clearScreen()
        drawLed(numLeds)
    }
    
})
function isInList(array: any[], num: number): boolean {
    
    while (index <= array.length) {
        if (array[index] == num) {
            return true
        }
        
        index += 1
    }
    return false
}

input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (loadingIDs && !isAdmin) {
        basic.showIcon(IconNames.SmallDiamond)
        while (loadingIDs) {
            radio.sendValue("ID", playerID)
            basic.pause(randint(100, 500))
        }
        basic.showIcon(IconNames.Yes)
    }
    
    if (loadingIDs && (isAdmin && synchronizing)) {
        synchronizing = false
        loadingIDs = false
        basic.clearScreen()
        drawLed(numLeds)
        radio.sendValue("syncDone", numLeds)
        IDList = bubbleSort(IDList)
    }
    
    if (loadingIDs && (isAdmin && !synchronizing)) {
        synchronizing = true
    }
    
})
function bubbleSort(list2: number[]): number[] {
    
    while (x <= list2.length) {
        y = 0
        while (y <= list2.length - (x + 1)) {
            if (list2[y] > list2[y + 1]) {
                savedValue = list2[y]
                list2[y] = list2[y + 1]
                list2[y + 1] = savedValue
            }
            
            y += 1
        }
        x += 1
    }
    return list2
}

function drawLed(leds: number) {
    
    row = 0
    if (leds != 0) {
        index3 = 0
        while (index3 <= leds - 1) {
            if (index3 % 5 == 0 && index3 != 0) {
                row += 1
            }
            
            led.plot(index3 - row * 5, row)
            index3 += 1
        }
    }
    
}

radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString == "youLose") {
        basic.showIcon(IconNames.Skull)
    }
    
})
function selectAdmin() {
    
    basic.showLeds(`
        . # . . .
        . # # . .
        . # # # .
        . # # . .
        . # . . .
        `)
    while (true) {
        if (input.buttonIsPressed(Button.A)) {
            isAdmin = true
            basic.showLeds(`
                . # # # .
                . # . # .
                . # # # .
                . # . # .
                . # . # .
                `)
            basic.pause(1000)
            break
        }
        
        if (input.buttonIsPressed(Button.B)) {
            isAdmin = false
            basic.showLeds(`
                . # # # .
                . # . # .
                . # # # .
                . # . . .
                . # . . .
                `)
            basic.pause(1000)
            break
        }
        
    }
    basic.pause(10)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
}

input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (!loadingIDs) {
        basic.clearScreen()
        if (yourTurn) {
            numLeds = numLeds - selectedToRemove
            if (numLeds <= 0) {
                radio.sendString("youLose")
                basic.showString("YOU WIN")
                basic.showIcon(IconNames.Happy)
            } else {
                drawLed(numLeds)
                radio.sendValue("next", numLeds)
                yourTurn = false
                if (isAdmin) {
                    playerPlaying = false
                }
                
            }
            
            selectedToRemove = 0
        } else {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(500)
            basic.clearScreen()
            drawLed(numLeds)
        }
        
    }
    
})
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (isAdmin) {
        if (name == "ID") {
            if (!isInList(IDList, value)) {
                IDList.push(value)
                radio.sendValue("Done", value)
            }
            
        }
        
        if (name == "next") {
            numLeds = value
            playerPlaying = false
            drawLed(numLeds)
        }
        
    } else {
        if (name == "Done") {
            if (value == playerID) {
                loadingIDs = false
            }
            
        }
        
        if (name == "yourTurn") {
            if (value == playerID) {
                yourTurn = true
                showYourTurn()
            }
            
        }
        
        if (name == "next") {
            basic.clearScreen()
            numLeds = value
            drawLed(numLeds)
        }
        
        if (name == "syncDone") {
            numLeds = value
            basic.clearScreen()
            drawLed(numLeds)
        }
        
    }
    
})
let turnIndex = 0
let index3 = 0
let row = 0
let savedValue = 0
let y = 0
let x = 0
let synchronizing = false
let index = 0
let numLeds = 0
let canClear = false
let playerPlaying = false
let IDList : number[] = []
let yourTurn = false
let playerID = 0
let selectedToRemove = 0
let isAdmin = false
let loadingIDs = false
radio.setGroup(179)
radio.sendNumber(0)
loadingIDs = true
isAdmin = false
selectedToRemove = 0
playerID = control.deviceSerialNumber()
yourTurn = false
IDList = [control.deviceSerialNumber()]
playerPlaying = false
canClear = false
selectAdmin()
if (isAdmin) {
    numLeds = randint(10, 25)
}

basic.forever(function on_forever() {
    
    if (isAdmin && synchronizing) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . # # # .
            `)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . # # # .
            . # # # .
            `)
        basic.showLeds(`
            . . . . .
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            `)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . # # # .
            `)
        basic.showLeds(`
            . # # # .
            . # # # .
            . # # # .
            . # # # .
            . # # # .
            `)
    }
    
    if (isAdmin && (!loadingIDs && !playerPlaying)) {
        radio.sendValue("yourTurn", IDList[turnIndex])
        radio.sendValue("next", numLeds)
        if (IDList[turnIndex] == playerID) {
            yourTurn = true
            showYourTurn()
        }
        
        turnIndex += 1
        playerPlaying = true
        if (turnIndex >= IDList.length) {
            turnIndex = 0
        }
        
    }
    
    if (yourTurn) {
        canClear = true
    } else {
        canClear = false
    }
    
})
