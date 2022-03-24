const say = function (number) {
    if (number > 0) {
        number--
        console.log(number)
        say(number)
    }
}

module.exports=say
