(function () {
    var pie = {
        init() {
            this.getData();
            // 初始化方法
            this.option = {   //两个图表里共同的配置
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    left: 'center',
                },
                legend: {
                    data: [],
                    orient: 'vertical',
                    left: 'left',
                },
                series: {
                    name: '',
                    type: 'pie',
                    data: [],
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0.5)',
                        }
                    }
                }
            }
        },
        getData() {  //请求数据
            var This = this;
            ajax({
                method: "get",
                url: "http://api.duyiedu.com/api/student/findAll",
                isAsync: true,
                data: {
                    appkey: "YYY_LZF_1621760641043"
                },
                callback: function (data) {
                    var list = data.data;

                    This.areaChart(list);
                    This.sexChart(list);
                }
            })

        },
        areaChart(data) {
            // 地区图表
            var address = document.getElementsByClassName("address-echars")[0];
            var myChart = echarts.init(address);
            var lengendData = [];
            var seriesData = [];
            var newData = {
                //  '黑龙江省哈尔滨市XXX':2,
            };
            data.forEach(function (item) {
                if (!newData[item.address]) {
                    newData[item.address] = 1;
                    lengendData.push(item.address);
                } else {
                    newData[item.address]++;
                }
            });

            for (var prop in newData) {
                seriesData.push({
                    value: newData[prop],
                    name: prop
                });
            }


            this.option.title.text = '学生地区分布统计';
            this.option.legend.data = lengendData;
            this.option.series.name = '地区分布';
            this.option.series.data = seriesData;

            myChart.setOption(this.option);
        },
        sexChart(data) {     //第二个图表
            var sex = document.getElementsByClassName("sex-echars")[0];

            var myChart = echarts.init(sex);
            var lengendData = ['男', '女'];


            var newData = {
            };
            data.forEach(function (item) {
                if (!newData[item.sex]) {
                    newData[item.sex] = 1;
                } else {
                    newData[item.sex]++;
                }
            });

            var seriesData = [
                { name: '男', value: newData[0] },
                { name: '女', value: newData[1] },
            ];


            this.option.title.text = '学生性别统计';
            this.option.legend.data = lengendData;
            this.option.series.name = '性别分布';
            this.option.series.data = seriesData;

            myChart.setOption(this.option);
        }
    }

    pie.init();
})();

