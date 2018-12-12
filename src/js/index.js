function Banner() {
    var $slides = $(".slide");
    var $pages = $(".pageList");
    // console.log($slides.eq(0).html());
    var index = 0;
    var prve_index = 0;
    var maxIndex = $slides.length - 1;
    initpages();
    $("#left").on("click", function () {
        prve_index = index; //将上一个赋值保留
        if (index == 0) {
            index = maxIndex;
        } else {
            index--;
        }
        changeClass()
    })

    $("#right").on("click", function () {
        prve_index = index;
        if (index == maxIndex) {
            index = 0;
        } else {
            index++;
        }
        changeClass();
    })

    function changeClass () {
        $slides.eq(prve_index)
            .addClass("slide-willhide")
            .siblings(".slide")
            .removeClass("slide-willhide");

        $slides.eq(index).addClass("slide-show")
            .siblings(".slide")
            .removeClass("slide-show")
            .end()
            .hide()
            .stop()
            .fadeIn();

        $pages.children().eq(index).addClass("active")
            .siblings("span")
            .removeClass("active")
    }

    function initpages() {
        for (var i = 0; i < $slides.length; i++) {
            var $span = $("<span>");
            if (i == index) {
                $span.addClass("active");
            }
            $pages.append($span);
        }
    }

    $pages.on("mouseover", "span", function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        prve_index = index;
        index = $pages.children().index(target);
        changeClass();
    })


    var banner_timer = setInterval('$("#right").trigger("click")', 3000);

    $(".banner").hover(function () {
        clearInterval(banner_timer);
    }, function () {
        banner_timer = setInterval('$("#right").trigger("click")', 3000);
    });
}

function Seckill() {
    _jsonp("http://recom-s.vancl.com/CmsSeckill/GetMainIndexSeckillForWww?showNum=5").then(function (res) {
        // console.log(res.data.productCodes.split(","));
        seckill(res);
    });

    function seckill(json) {
        var _starttime = seckill_getdatetime(json.data.startTime);
        var _endtime = seckill_getdatetime(json.data.endTime);
        seckill_timecounter();
        var con = json.data.productCodes;
        var url = "http://recom-s.vancl.com/product/GetProductInfosBySeckill?productcodes=";
        _jsonp(url + con).then(function (res) {
            // console.log(res);

            seckill_con(res);
        });

        function seckill_getdatetime(datestr) {
            var arr = datestr.split(' ');
            var date = arr[0];
            var time = arr[1];
            var dateArr = date.split('-');
            var y = dateArr[0];
            var mm = dateArr[1];
            var d = dateArr[2];

            var timeArr = time.split(':');
            var h = timeArr[0];
            var m = timeArr[1];
            var s = timeArr[2];

            return new Date(y, mm - 1, d, h, m, s);
        }

        function seckill_timecounter() {
            //获取当前时间
            var date = new Date();
            var now = date.getTime();
            //设置截止时间
            var starttime = _starttime.getTime();
            var endtime = _endtime.getTime();
            var _times = "";
            var counttime = "";
            if (now < starttime) {
                //秒杀还没有开始
                _times = "秒杀即将开始，距开始还有";
                counttime = starttime;
            } else if (now >= starttime && now < endtime) {
                //秒杀中
                counttime = endtime;
                _times = "秒杀进行中，距结束还有";
            } else {
                //秒杀结束
                _times = "该场秒杀已结束";
            }
            //时间差
            if (counttime) {
                var leftTime = counttime - now;
                //定义变量 d,h,m,s保存倒计时的时间
                var d, h, m, s;
                if (leftTime >= 0) {
                    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    m = Math.floor(leftTime / 1000 / 60 % 60);
                    s = Math.floor(leftTime / 1000 % 60);
                    if (h < 10) {
                        h = "0" + h;
                    }

                    if (m < 10) {
                        m = "0" + m;
                    }

                    if (s < 10) {
                        s = "0" + s;
                    }
                    _times = "<em>" + _times + "</em>" + h + "<em></em>" + m + "<em></em>" + s;
                } else {
                    _times = "<em>" + _times + "</em>" + "00" + "<em></em>" + "00" + "<em></em>" + "00";
                }
                // console.log(_times);

                $("#seckill_timecounting").html(_times);
                setTimeout(seckill_timecounter, 1000);
            } else {
                $("#seckill_timecounting").html("<em>" + _times + "</em>" + "00" + "<em></em>" + "00" + "<em></em>" + "00");
            }
        }

        function seckill_con(args) {
            var html = "";
            args.forEach(function (item) {
                var _p1 = item.ProductCode.substring(0, 1);
                var _p2 = item.ProductCode.substring(1, 2);
                var _p3 = item.ProductCode.substring(2, 3);
                html += `
                    <li>
                        <a href="#" target="blank"> 
                            <img src="http://p3.vanclimg.com/232/232/product/${_p1}/${_p2}/${_p3}/${item.ProductCode}/mid/${item.Photos[0].FileName}"
                                alt="${item.ProductName}">
                            <div class="new-miaosha-productname"> 
                                <span>${item.ProductName}</span> 
                            </div>
                            <div class="new-miaosha-price"> 
                                <span class="new-miaosha-oldprice">&yen; 
                                    <em>${item.Price}</em> 
                                </span>
                                <span class="new-miaosha-saleprice">&yen; 
                                    <em>${item.SPrice}</em> 
                                </span> 
                                <span class="new-miaosha-afterdeposit">充值后
                                    <em>${item.SPrice/2}</em>元
                                </span> 
                            </div>
                        </a> 
                    </li>
                    `;
            })
            $("#seckill_container ul").html(html);
            return html;
        }
    }
}


export {
    Banner,
    Seckill
};