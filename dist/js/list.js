var container = _(".pruarea ul");
var pagebox = _(".searchPage ul");
var page_num = 0;
var show_num = 10;
var page_count = "";
var json = null;


$.ajax({
    type: "get",
    url: "../json/detail.json",
    cache: true,
    async: true,
    success: function (res) {
        json = res;

        console.log(json);

        _renderBtn();

        _renderPage();

        _bindBtnEvent();

    }
});

// _jsonp("../json/detail.json")
//     .then(function (res) {

//         console.log(res);

// _renderBtn();

// _renderPage();

// _bindBtnEvent();
//     })

function _renderPage() {
    var html = "";
    json.forEach(function (item, index) {
        if (!(index >= page_num * show_num && index <= page_num * show_num + show_num - 1)) return false;
        html += `
        <li class="liList">
            <input type="hidden" class="hidden_id" value="${item.id}">
            <div class="pic">
                <a href="javascript:void(0)" title="${item.title}">
                    <img class="productPhoto" src="${item.img[0]}"
                        alt="${item.title}" />
                </a>
                <div class="teshui">${item.original}</div>
                <div class="vancllist_logo"></div>
            </div>
            <p>
                <a href="javascript:void(0)" title="${item.title}">${item.title}</a>
            </p>
            <div class="Mpricediv">
                <span class="Sprice">售价 <strong>${item.price}</strong>
                </span>
            </div>
        </li>
  `;
    });
    $(".pageTop").html(page_num + 1 + "/" + page_count);
    container.innerHTML = html;
    $(".pruarea ul li").on("click", li_click);
}

function li_click(event) {
    var e = event || window.event;
    var target = e.currentTarget;
    var id = $(".liList").index(target);
    var _id = $(".liList")[id].childNodes[1].defaultValue;
    location.href = "detail.html?" + "id=" + encodeURI(_id);
}

function _renderBtn() {
    // 计算共有多少页。
    var page = "";
    var item_num = json.length;
    page_count = Math.ceil(item_num / show_num);

    var fragement = document.createDocumentFragment();
    for (var i = 0; i < page_count; i++) {
        var li = document.createElement("li");
        li.innerHTML = i + 1;
        fragement.appendChild(li);
        if (i === page_num) {
            li.className = "currentpage";
        }
    }
    page += `
        共${page_count}页
    `;
    $(".allpagesNumber").html(page);
    pagebox.innerHTML = "";
    pagebox.appendChild(fragement)

}

function _bindBtnEvent() {
    var btns = _slice(pagebox.children);
    btns.forEach(function (btn, index) {
        btn.onclick = _handleBtnEvent.bind({}, index, btns);
    })
}

function _handleBtnEvent(index, btns) {
    page_num = index;
    btns.forEach(function (btn) {
        _removeClass(btn, "currentpage");
    })

    btns[index].className = "currentpage";
    _renderPage();
}

$(".jquery_pager_prevpage").on("click", prev_page);
$(".jquery_pager_nextpage").on("click", next_page);

function next_page() {
    page_num = page_num + 1;
    if (page_num > page_count - 1) {
        page_num = page_count - 1;
    }
    changePage()
}

function prev_page() {
    page_num = page_num - 1;
    if (page_num < 0) {
        page_num = 0;
    }
    changePage()
}

function changePage() {
    var btns = _slice(pagebox.children);
    _handleBtnEvent(page_num, btns)
}

$(".pageGGsub").on("click", redirection)

function redirection() {
    var page = page_num;
    page_num = $(".pageGGshuru").val() - 1;

    if (!isNaN(page_num)) {
        if (page_num < 0) {
            page_num = 0;
        } else if (page_num > page_count - 1) {
            page_num = page_count - 1;
        }
    } else {
        page_num = page;
    }

    changePage()

}