bs.$register('static', 'debuger', (function () {
    console.log('debuger');
    // TODO IE8이하만 체크하게 변경해야함..
    // 지금은 쓸꺼면 임포트 하라는 식 -_-;;
    bs.css('.DEBUGER').$('position', 'absolute', 'color', '#ffffff', 'font-size', '12px', 'padding', 10, 'width', '50%', 'padding', 10, 'left', 10)
    var debuger = {}, visible = false,  dom = bs.dom("<div class='DEBUGER'></div>")
    var  title = bs.dom("<div class='DEBUGER'></div>");
    var str = "close - press Pause Key<br>"
    console.log = function () {
        str = Array.prototype.join.call(arguments, ", ") + "<br>"
        dom.$('+html', str)
    }
    debuger.show = function () {
        dom.$('<', 'body',
            'display', 'block', 'overflow', 'auto', 'top', 43,
            'background-color', '#222222', 'height', '50%'
        )
        title.$('<', 'body',
            'html','Close Debuger - PauseBreak',
            'display', 'block', 'top', 10,
            'background-color', '#000000','height', 10
        )
    }
    debuger.hide = function () {
        dom.$('display', 'none'), title.$('display', 'none')
    }

    bs.WIN.on('keyup', '@debugerKeyEvent', function ($e) {
        if ($e.keyCode == 19)  visible = !visible
        visible ? debuger.show() : debuger.hide()
    })
    return debuger;
})(), 1.0);