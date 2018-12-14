var loc = location.href;
var n1 = loc.length; //地址的总长度
var n2 = loc.indexOf("="); //取得=号的位置
var id = decodeURI(loc.substr(n2 + 1, n1 - n2)); //从=号后面的内容
var json = "";
$.ajax({
    type: "get",
    url: "../json/detail.json",
    cache: true,
    async: true,
    success: function (res) {
        json = res;
        _renderPage();
    }
});

function _renderPage() {
    var _samllImg = "";
    var _bigImg = "";
    var _bigView = "";
    var _title = "";
    var _price = "";
    var _color = "";
    var _size = "";
    _num = "";

    json.forEach(function (item, index) {
        // console.log(item);
        if (item.id == id) {
            for (let i = 0; i < item.img.length; i++) {
                _samllImg += `
                 <li>
                      <span class="SpriteSmallImgs"><img src="${item.img[i]}" alt="" srcset=""></span>
                  </li>
                `;
                _bigImg += `
                <img src="${item.img[i]}" title="${item.title}" />
               `;
                _bigView += `
                <img src="${item.img[i]}" title="${item.title}" />
                `;
            }
            _title += `
            <h2 title="${item.title}">
                ${item.title}
                <span>充值购买更优惠</span>
            </h2>
            `;
            _price += `
            <span>
                特惠价：</span><span><strong>${item.original}</strong>
            </span>
            `;
            for (let j = 0; j < item.type.length; j++) {
                _color += `
                <li title="${item.type[j][1]}">
                    <img src="${item.type[j][0]}"
                    alt="">
                    <span></span>
                </li>
                `;
            }
        } else {
            return true;
        }
    });
    $("#productTitle").prepend(_title);
    $("#imageMenu").html(_samllImg);
    $("#imageMenu li").eq(0).addClass("onlickImg");
    $(".bigImg").append(_bigImg);
    $(".bigImg img").eq(0).addClass("bigImgBlock");
    $(".bigView").html(_bigView);
    $(".bigView img").eq(0).addClass("bigViewBlock");
    $(".tehuiMoney").html(_price);
    $(".selColor ul").html(_color);
    $(".selColor ul li").eq(0).addClass("onlickColor");
    $(".selColor ul li span").eq(0).addClass("colorHoverok");

    json.forEach(function (item) {
        // console.log(item);
        if (item.id == id) {
            console.log($(".onlickColor"));
            var _color_id = $(".selColor ul li").index($(".onlickColor"));

            for (let s = 0; s < item.type[_color_id][2].size.length; s++) {
                _size += `
                    <li>
                        <p>${item.type[_color_id][2].size[s][0]}</p>
                        <span></span>
                    </li>
                `;
            }
        } else {
            return true;
        }
    });
    $(".selSize ul").html(_size);
    $(".selSize ul li").eq(0).addClass("onlickSelSize");
    $(".selSize ul li span").eq(0).addClass("sizeHoverok");
    
    init();
    
}

function init() {
    var smallImg = $("#imageMenu li img");
    var smallLI = $("#imageMenu li")
    var bigImg = $(".bigImg img");
    var bigView = $(".bigView img");
    var selColor = $(".selColor ul li img");
    var selSize = $(".selSize ul li p");
    var size = $(".onlickSelSize").html();
    var color = $(".onlickColor").attr("title");
    smallImg.on("mouseover", show);
    $(".bigImg").on("mouseenter", show_view);
    $(".bigImg").on("mouseleave", hide_view);
    choose();

    function show(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var id = smallImg.index(target);
        smallLI.eq(id).addClass("onlickImg").siblings()
            .removeClass("onlickImg");
        bigImg.eq(id).addClass("bigImgBlock").siblings().removeClass("bigImgBlock");
        bigView.eq(id).addClass("bigViewBlock").siblings().removeClass("bigViewBlock");
    }

    function show_view() {
        $(".winSelector").css("display", "block");
        $(".bigView").css("display", "block");
        $(".bigImg").on("mousemove", move);
    }

    function hide_view() {
        $(".winSelector").css("display", "none");
        $(".bigView").css("display", "none");
    }

    function move(event) {
        var e = event || window.event;
        var maskLeft = e.pageX - bigImg.offset().left - $(".winSelector").width() / 2;
        var maskTop = e.pageY - bigImg.offset().top - $(".winSelector").height() / 2;
        var MaxL = bigImg.width() - $(".winSelector").width();
        var MaxT = bigImg.height() - $(".winSelector").height();
        maskLeft = maskLeft < 0 ? 0 : maskLeft > MaxL ? MaxL : maskLeft;
        maskTop = maskTop < 0 ? 0 : maskTop > MaxT ? MaxT : maskTop;
        $(".winSelector").css({
            "left": maskLeft,
            "top": maskTop
        })
        var bigL = maskLeft * (bigView.width() - $(".bigImg").width()) / ($(".bigImg").width() - $(".winSelector").width());
        var bigT = maskTop * (bigView.height() - $(".bigImg").height()) / ($(".bigImg").height() - $(".winSelector").height());
        bigView.css({
            "left": -bigL,
            "top": -bigT
        })
    }
    selColor.on("click", _selColor);

    function _selColor(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var id = selColor.index(target);
        selColor.parent().eq(id).addClass("onlickColor").siblings().removeClass("onlickColor");
        $(".selColor ul li span").eq(id).addClass("colorHoverok").parent().siblings().children("span").removeClass("colorHoverok");
        color = $(".onlickColor").attr("title");
        choose();
    }
    selSize.on("click", _selSize);

    function _selSize(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var id = selSize.index(target);
        selSize.parent().eq(id).addClass("onlickSelSize").siblings().removeClass("onlickSelSize");
        $(".selSize ul li span").eq(id).addClass("sizeHoverok").parent().siblings().children("span").removeClass("sizeHoverok");
        size = $(".selSize ul li p").eq(id).html();
        choose();
    }
    function _count() {
        json.forEach(function (item) {
            // console.log(item);
            if (item.id == id) {
                var _color_id = $(".selColor ul li").index($(".onlickColor"));
                var _size_id = $(".selSize ul li").index($(".onlickSelSize"));
                _num = `
                    <input type="number" value="1" oninput = "value=value.replace(/[^\d]/g,'')" min="1" max="${item.type[_color_id][2].size[_size_id][1]}">
                    <span id="comeon" class="LastNum">余量${item.type[_color_id][2].size[_size_id][1]}</span>
                `;
            } else {
                return true;
            }
        });
        $(".danpinnumSelect").html(_num);
    }
    _count();

    function choose() {
        $(".SelectName").html(color);
        $(".SelectSize").html(size);
        _count();
    }
}