function Banner() {
    $.extend(Banner.prototype, {
        init: function () {
            this.$slides = $(".slide");
            this.$pages = $(".pageList");
            this.index = 0;
            this.prve_index = 0;
            this.maxIndex = this.$slides.length - 1;
            this.initpages();
            this.bindEvent();
            this.banner_timer();
        },

        bindEvent: function () {
            $("#right").on("click", this.next.bind(this));
            $("#left").on("click", this.prve.bind(this));
            this.$pages.on("mouseover", "span", this.toIndex.bind(this))
        },

        next: function () {
            this.prve_index = this.index;
            if (this.index == this.maxIndex) {
                this.index = 0;
            } else {
                this.index++;
            }
            this.changeClass();
        },
        prve: function () {
            this.prve_index = this.index;
            if (this.index == 0) {
                this.index = this.maxIndex;
            } else {
                this.index--;
            }
            this.changeClass();
        },
        changeClass: function () {

            this.$slides.eq(this.prve_index).addClass("slide-willhide")
                .siblings(".slide")
                .removeClass("slide-willhide")
            this.$slides.eq(this.index).addClass("slide-show")
                .siblings(".slide")
                .removeClass("slide-show")

            this.$pages.children().eq(this.index).addClass('active')
                .siblings("span").removeClass("active");

        },
        initpages: function () {
            for (var i = 0; i < this.$slides.length; i++) {
                var $span = $("<span>");
                if (i == this.index) {
                    $span.addClass("active");
                }
                this.$pages.append($span)
            }
        },
        toIndex: function (event) {
            var e = event || window.event;
            var target = e.target || e.srcElement;
            this.prve_index = this.index;
            this.index = this.$pages.children().index(target);
            // console.log(i);
            this.changeClass();
        },
        banner_timer: function () {
            this.banner_timer = setInterval('$("#right").trigger("click")', 3000);
            $(".banner").hover(function () {
                clearInterval(this.banner_timer);
            }, function () {
                this.banner_timer = setInterval('$("#right").trigger("click")', 3000);
            });
        }
    })
}







export default new Banner();