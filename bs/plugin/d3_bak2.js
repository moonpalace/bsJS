bs(function () {
    var d3Camera = {
        pan: 0.01, tilt: 0.01, x: 0, y: 0, z: 0, farclip: 2500, speed: 10, list: [],
        ANI: function ($time) {
            var list = this.list, i = list.length, keys = bs.KEY, sin = Math.sin(this.pan) , cos = Math.cos(this.pan), speed = this.speed
            if (!i) return
            if (keys['w']) this.x -= speed * sin, this.z += cos * speed
            if (keys['s']) this.x += speed * sin, this.z -= cos * speed
            if (keys['a']) this.x -= speed * cos, this.z -= speed * sin
            if (keys['d']) this.x += speed * cos, this.z += speed * sin

            if (keys['r']) this.y -= speed
            if (keys['f']) this.y += speed

            if (keys['q']) this.pan += speed / 500
            if (keys['e']) this.pan -= speed / 500
            if (keys['t']) this.tilt += speed
            if (keys['g']) this.tilt -= speed

            var world = bs.d('#' + list[0].div.$('<').id), w = world.$('w'), h = world.$('h')
            while (i--) {
                var t = list[i], dx, dz, tx, tz, tScale, zIndex, width = t.width, height = t.height, farclip = this.farclip;
                dx = t.x - this.x, dz = t.z - this.z;
                // 카메라를 중심으로 플랜의 위치를 구함
                tx = cos * dx + sin * dz;
                tz = -sin * dx + cos * dz;
                tScale = w / tz // 대충거리로...크기비율을 결정
                if (tz < 0.1 || tz > this.farclip) t.div.$('display', 'none')
                else zIndex = parseInt(tz * 100000 - tz * 100),  // 안겹치게...제트축만들고... 혹시나 살짝빼서 또 겹치는걸 없앰
                    t.div.$(
                        'display', 'block',
                        // 멀리있는건 거리에 대해 스케일 비율이 달라짐
                        'width', tScale * .5 + width * tScale / 2, 'height', tScale * .5 + height * tScale / 2,
                        'margin-left', (tx - width / 4) * tScale + w / 2, 'margin-top', this.tilt - tScale * this.y - (tScale + height / 2 * tScale ) / 2 + h / 2,// this.tilt+(this.y-height/4)* tScale-this.y*tScale+h/2,
                        'opacity', (farclip - tz) > farclip / 5 ? 1 : (farclip - tz + farclip / 5) / farclip,
                        // z소팅
                        'z-index', parseInt(100 * tScale)
                    )
            }
        }
    };
    bs.$class('d3m', function ($fn) {
        var key;
        (function () {
            var t0, i;
            t0 = 'dom,__list'.split(','), key = {}, i = t0.length;
            while (i--) key[t0[i]] = 1;
        })();
        $fn.constructor = function ($key) {

            this.__list = {};
            this.dom = bs.dom("<div>test</div>");
        },
        $fn.$ = function () {
            var i, j, k, v;
            i = 0, j = arguments.length;
            if (j == 1) return this[arguments[0]];
            while (i < j) {
                k = arguments[i++], v = arguments[i++];
                if (key[k]) this[k] = v;
                if (k == 'dom') return this.dom;
                else if (k == '__list') return this.__list;
                else   this.dom.$(k, v);

            }

//              console.log('재질자체가 변했음', this.__list)
            for (var i in this.__list) this.__list[i].$('html', this.dom.$('html'))
//              console.log(i,'재질재적용',this.__list[i])
        }
    });
    bs.$class('d3', function ($fn) {
        var key, type = {"doom": 1};
        bs.c('.D3').$('position', 'absolute'), bs.c('.D3 img').$('width', '100%', 'height', '100%', 'position', 'absolute'),
            (function () {
                var t0, i;
                t0 = 'x,y,z,width,height,materialName'.split(','), key = {}, i = t0.length;
                while (i--) key[t0[i]] = 1;
            })(),
            $fn.constructor = function ($key) {
                var tname = $key.split('@')[1];
                if ($key.indexOf('camera@') > -1) type[tname] ? console.log('cameraMode :', tname) : console.log('존재하지않는 카메라타입입니다'), bs.ANI.ani(d3Camera), this.camera = d3Camera
                else if ($key.indexOf('plane@') > -1) this.x = this.y = this.z = this.width = this.height = 0, this.div = bs.d("<div class='D3' id='" + tname + "'>재질적용전</div>"), d3Camera.list.push(this), this.materialName = undefined
            },
            $fn.$ = function () {
                var i, j, k, v;
                i = 0, j = arguments.length;
                if (j == 1) return this[arguments[0]];
                var prevMaterial = this.materialName
                while (i < j) {
                    k = arguments[i++], v = arguments[i++];
                    if (key[k]) this[k] = v;
                    else if (k == 'div') return this.div;
                    else if (k == 'materialName') return this.materialName;
                    else if (k == 'camera') return this.camera;
                    else this.div.$(k, v);
//                    if (k == 'materialName') console.log('this.materialName - ',this.materialName) // 재질이 있나 확인하고
                    if (k == 'materialName') {
                        // 기존에 적용된 재질이 있으면 적용취소함
                        if (prevMaterial != this.materialName) {
                            if(bs.d3m(prevMaterial)) delete bs.d3m(prevMaterial).__list[this ]
                        }
                        // d3m에서 이름으로 검색
//                        console.log('this.materialName으로 검색 ' ,bs.d3m(this.materialName))
                        // 재질을 찾아서 재질의 적용리스트에 자신의 div를 추가한다.
                        console.log( bs.d3m(this.materialName).__list)
                          bs.d3m(this.materialName).__list[this.__k] = this;
//                        console.log( bs.d3m(this.materialName).__list[this.__k]);
                             console.log('재질dom', bs.d3m(this.materialName).$('dom').$('html'));
//                           console.log('재질dom', bs.d3m(this.materialName).$('dom').$('html'));
//                           console.log('this.div', this.div.$('html'));
                           this.div.$('html', bs.d3m(this.materialName).$('dom').$('html'))
//                        for(var i in bs.d3m(this.materialName).__list) console.log(bs.d3m(this.materialName).__list[i].__k)
                    }

                }
            }
    })

});