/**
 * Created by Martin Cao on 2015/11/19.
 */
function showChart(urls,names,div){
    Highcharts.setOptions(
        {
            lang:{
                resetZoom:"恢复初始大小",
                resetZoomTitle:"恢复到1：1"
            }
        }
    )
    var counter=0;
    var this_chart;
    var seriesOptions=[];
    var mychart=
        {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Market Value Over Time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%Y-%m-%d', this.value);
                    }
                },
                gridLineDashStyle:"LongDash",
                gridLineWidth:1,
                minRange:864000000
            },
            yAxis: [{
                title: {
                    text: names[0]
                },
                tickInterval:50
                //maxTickInterval:50
            },
                {
                    title: {
                        text: names[1]
                    },
                    opposite:true,
                    tickInterval:50
                    //maxTickInterval:50
                }
            ],
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 0,
                symbolWidth:40
            },
            tooltip: {
                xDateFormat: '%Y-%m-%d',
                pointFormat: '<span style="color:{series.color}">'+'{series.name}'+'</span>'+': <b>{point.y}</b><br/>',
                shared:true
            },
            credits:{
                enabled:false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: seriesOptions
    }
    $.each(names, function (i, name) {
        var data = "";
        $.ajax({
            type: "get",
            url: urls[i],
            dataType: "json",
            cache: false,
            success: function (result) {
                data = "[";
                $.each(result, function (i, field) {
                    data += "[Date.UTC(" + field.date.substr(0, 4) + "," + field.date.substr(5, 2) + "," + field.date.substr(8, 2) + ")," + field.value + "],"
                });
                data = data.substring(0, data.length - 1) + "]";

                seriesOptions[i] = {
                    name: name,
                    data: eval(data),
                    yAxis:i%2
                }

                counter+=1;
                if(counter==names.length){
                    $(div).highcharts(mychart);
                }
            }
        });
    });
}