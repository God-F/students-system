/**
 * 翻页的构造函数
 * @param {*} option 
 *            装翻页区域的容器
 *            总数据量
 *             每页的展示数量
 *              当前页数
 */
function TurnPage(option) {
    this.wrapper = option.wrapper;
    this.total = option.total;
    this.size = option.size;
    this.nowPage = option.nowPage;
    this.pageNumber = Math.ceil(this.total / this.size);
    this.callback = option.callback;
}

// 创建分页的html元素
TurnPage.prototype.creatHtml = function () {
    var pageHtml = '';
    pageHtml += `<ul class="page-wrapper">`;
    // 判断是不是第一页
    if (this.nowPage > 1) {
        pageHtml += `<li class="up-page">上一页</li>`;
    }

    // 默认有第一页
    pageHtml += `<li class="page-item ${this.nowPage == 1 ? 'active' : ''}">1</li>`;
    // 判断是否需要省略号
    if (this.nowPage > 3) {
        pageHtml += `<span class="page-circle">...</span>`;
    }
    // 循环创建元素  中间最多三个元素
    for (var i = this.nowPage - 1; i <= this.nowPage + 1; i++) {
        // 当前i必须大于1 并且小于总页数  所以创建到 this.pageNumber -1;
        if (i > 1 && i < this.pageNumber) {

            pageHtml += `<li class="page-item ${this.nowPage == i ? 'active' : ''}" > ${i}</li > `;


        }
    }
    // 判断是否需要后面的省略号
    if (this.pageNumber - this.nowPage > 2) {
        pageHtml += `<span class="page-circle" >...</span > `;
    }
    // 1已经默认创建   所以必须在总页数大于1 
    if (this.pageNumber > 1) {
        pageHtml += `<li class="page-item ${this.nowPage == this.pageNumber ? 'active' : ''}"> ${this.pageNumber}</li>`

    }

    // 判断是否需要下一页
    if (this.pageNumber > this.nowPage) {
        pageHtml += `<li class="next-page">下一页</li>`;
    }

    pageHtml += `</ul > `;
    // this.wrapper.removeChild(wrapper);

    var wrapper = document.getElementsByClassName("wrapper")[0];
    wrapper.innerHTML = pageHtml;

    // 当前样式
    // console.log(this.nowPage);
    // var li = document.getElementsByClassName("page-item")[this.nowPage - 1];
    // li.classList.add("active");

}


// 注册点击事件
TurnPage.prototype.events = function () {
    var This = this;
    var perPage = document.getElementsByClassName("up-page")[0];
    var nextPage = document.getElementsByClassName("next-page")[0];
    var lis = document.getElementsByClassName("page-item");
    // 注册上一页事件
    if (perPage) {
        perPage.onclick = function () {
            This.nowPage--;
            This.init()
            This.callback && This.callback(This.nowPage);
        }
    }
    // 注册下一页事件
    if (nextPage) {
        nextPage.onclick = function () {
            This.nowPage++;
            This.init()
            This.callback && This.callback(This.nowPage);
        }
    }


    // 注册点击事件
    // 可能或获取到上一页和下一页标签  所以进行处理
    lis = [].slice.call(lis);
    lis.forEach(function (item) {
        item.onclick = function () {
            This.nowPage = parseInt(this.innerText);
            This.init();
            This.callback && This.callback(This.nowPage);

        }
    })


}



// 初始化页面
TurnPage.prototype.init = function () {
    this.creatHtml();
    this.events();
}