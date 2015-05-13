$( document ).ready(function() {
	$.get("data/files.txt", function(data) {
		var lines = data.split("\n");
		for(i=0;i<lines.length;i++) {
			if (lines[i] == "all_data.zip") {
				continue;
			}
			title = lines[i];
			title = title.replace(/_/g," ");
			title = title.replace(".csv","");
			title = capitalizeFirstLetter(title);
			if (title != "") {
				$('#files').append('<li onClick="loadData(\'data/'+lines[i]+'\');"><a href="#files">' + title + '</a></li>');
			}
		}
	});
	loadData("data/sex.csv");
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function drawChart(data) {
    $('#chart1').html("");
//    console.log(chartData);
    // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
    var chart;

    nv.addGraph(function() {
        chart = nv.models.lineChart()
            .options({
                transitionDuration: 300,
                useInteractiveGuideline: true
            })
        ;

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel("Year")
            .staggerLabels(false)
        ;

        chart.yAxis
            .axisLabel('Percentage')
            .tickFormat(d3.format(',.2f'))
        ;

        d3.select('#chart1').append('svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function loadData(file) {	
	var output = [];
	var data = d3.csv(file, function(data) {
		data.map(function(d) {
			ob = {};
			for (key in d) {
				if (key != "Year") {
					ob = {};
					ob["x"] = d["Year"];
					ob["series"] = key;
					if (typeof output[key] === 'undefined') {
						output[key] = [];
					}
					ob["y"] = d[key];
					output[key].push(ob);
				}		
			}
		});
		var chartData = [];
		for (key in output) {
			append = {};
			append["key"] = key;
			append["values"] = output[key];
			chartData.push(append);	
		}
		//console.log(chartData);
		drawChart(chartData);
	});
}
loadData("data/sex.csv");
