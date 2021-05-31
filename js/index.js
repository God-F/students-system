// 存储所有学生信息
var studentDataAll = [];
// 首先获取所有人的信息  成功回调后 生成翻页按钮



// 获取第一页学生信息
function init() {
    ajax({
        method: "get",
        url: "https://open.duyiedu.com/api/student/findAll",
        isAsync: true,
        data: {
            appkey: "YYY_LZF_1621760641043"
        },
        callback: function (data) {
            studentDataAll = data.data;
            // 生成分页按钮
            // 当数据量大于5  也就是足够分页  就创建分页
            if (data.data.length > 5) {
                creatPage()
            }
        }
    })
    ajax({
        method: "get",
        url: "https://open.duyiedu.com/api/student/findByPage",
        isAsync: true,
        data: {
            appkey: "YYY_LZF_1621760641043",
            page: 1,
            size: 5
        },
        callback: function (data) {
            render(data.data.findByPage);

        }
    })
}


init();

// 页面渲染
var tbody = document.getElementsByClassName("tbody-list")[0];
function render(data) {
    var htmlStr = "";
    data.forEach(function (item, index) {
        htmlStr += ` <tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? "男" : "女"}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <input type="button" value="编辑" class="edit-btn" data-index=${index}>
            <input type="button" value="删除" class="delete-btn" data-index=${index}>
        </td>
    </tr>`
    })
    tbody.innerHTML = htmlStr;

}


// 数据查询功能
// 由于后台接口文题  一次只能得到一页数据   
// 得到的数据量无法确认  无法得到全部数据
var searchBtn = document.getElementsByClassName("search-btn")[0];
var search = document.getElementById("search");
searchBtn.onclick = function () {
    var value = search.value;
    ajax({
        method: "get",
        url: "https://open.duyiedu.com/api/student/searchStudent",
        isAsync: true,
        data: {
            appkey: "YYY_LZF_1621760641043",
            search: value,
            sex: -1,
            page: 1,
            size: 5
        },
        callback: function (data) {
            if (data.status == "fail") {
                alert(data.msg);
            } else if (data.status == "success")
                if (data.data.searchList.length == 0) {
                    alert("未找到匹配的信息");
                } else {
                    studentDataAll = data.data.searchList;
                    render(data.data.searchList);
                    // 生成分页按钮
                    creatPage()
                }
        }

    })
    search.value = "";
    // 定时取消聚焦效果
    setTimeout(function () {
        searchBtn.blur();
    }, 300)
}


// 删除学生信息



tbody.onclick = function (e) {
    // console.log(e.target.value);
    if (e.target.value == "删除") {
        // 点击的是删除键
        var index = e.target.dataset.index;
        var sNo = studentDataAll[index].sNo;
        // 发送请求删除数据
        var result = confirm(`确定删除学号为${sNo}的学生信息？`)
        if (result) {
            ajax({
                method: "get",
                url: "https://open.duyiedu.com/api/student/delBySno",
                isAsync: true,
                data: {
                    appkey: "YYY_LZF_1621760641043",
                    sNo: sNo
                },
                callback: function (data) {
                    alert(data.msg)
                    if (data.status == "success") {
                        // 删除成功后  重新渲染页面；
                        init();
                    }
                }
            })
        }


    } else if (e.target.value == "编辑") {

    }
    // 定时取消聚焦效果
    setTimeout(function () {
        e.target.blur();
    }, 300)
}







// 生成分页按钮
function creatPage() {
    var pageWrapper = document.getElementsByClassName("student-data")[0];
    var turnPage = new TurnPage({
        wrapper: pageWrapper,
        total: studentDataAll.length,
        size: 5,
        nowPage: 1,
        callback: function (num) {
            ajax({
                method: "get",
                url: "https://open.duyiedu.com/api/student/findByPage",
                isAsync: true,
                data: {
                    appkey: "YYY_LZF_1621760641043",
                    page: num,
                    size: 5
                },
                callback: function (data) {
                    render(data.data.findByPage);
                }
            })
        }
    })

    // 初始化页面
    turnPage.init();
}


// 页面切换功能
// 设置默认hash
// window.location.hash = "#student-list";
(function () {
    var dl = document.getElementsByClassName("left-list-dl")[0];
    var dd = dl.getElementsByTagName("dd");
    var last = dl.getElementsByClassName("active")[0];
    // 将类数组转换为数组
    dd = Array.from(dd);
    dd.forEach(function (item) {
        item.onclick = function () {
            // 按钮样式的变化
            last.classList.remove("active")
            this.classList.add("active");
            last = this;
            // 具体页面切换
            // 改变hash
            window.location.hash = this.dataset.id;

            init();
        }
    })
})()

// 注册hash改变事件  左侧栏点击事件与右侧内容区域通过hash绑定在一起
window.onhashchange = function () {
    // console.log("5");
    // 得到左边内容区
    var rightContent = document.getElementsByClassName("right-content")[0];
    var lastShow = rightContent.getElementsByClassName("show")[0];
    // 取消上一个的class
    lastShow.classList.remove("show");
    // 根据hash得到应该显示的区域  添加class
    hash = window.location.hash.slice(1);
    var showContent = document.getElementsByClassName(hash)[0];
    showContent.classList.add("show");
    // 侧边栏样式转换
    var leftDd = document.querySelector(`[data-id=${hash}`);
    leftDd.click();

    // 可能会出问题  第一次点击左边栏按钮没有反应
}




// 得到表单数据
var addForm = document.getElementById("student-add-form");
function getFormData(form) {
    return {
        sNo: form.sNo.value,
        name: form.name.value,
        sex: form.sex.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        birth: form.birth.value,
    }
}

// 添加学生功能
var addBtn = document.getElementById("add-add-btn");

addBtn.onclick = function (e) {
    var formData = getFormData(addForm);
    ajax({
        method: "get",
        url: "https://open.duyiedu.com/api/student/addStudent",
        isAsync: true,
        data: {
            appkey: "YYY_LZF_1621760641043",
            ...formData
        },
        callback: function (data) {
            alert(data.msg)
            if (data.status == "success") {
                // 添加成功
                // 跳回学生列表页面
                window.onload();
                // document.querySelector('[data-id=student-list]').click();
            }
        }
    })


}



// 编辑

