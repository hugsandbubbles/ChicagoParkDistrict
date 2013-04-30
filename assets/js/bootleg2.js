/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function drawTable(data,div) {
    var output = new Array();
    var titles = new Array();
    var cols = [0,1,2,3,4,5,20];
    for (var i=0;i<cols.length;i++){
        titles.push(data.getColumnLabel(cols[i]));
    }
    output.push(titles);
    for (var j=0; j<data.getNumberOfRows();j++){
        var temp = new Array();
        for (var k=0; k<cols.length;k++){
            if (titles[k].indexOf("Cluster") >= 0){
                var loc = data.getValue(j,cols[k]).indexOf("|");
                temp.push(data.getValue(j,cols[k]).substring(0,loc));
            } else {
                temp.push(data.getValue(j,cols[k]));
            }
        }
        output.push(temp)
    }
    var results = google.visualization.arrayToDataTable(output);
    
    var options = {
        showRowNumber: false,
        page: 'enable',
        pageSize: 20
    }
    var table = new google.visualization.Table(document.getElementById(div));
    table.draw(results, options);
}

function getSubset(data,str,index){
    //Separate String of Filters
    var filters = new Array();
    var rows = new Array();
    for (var h=0;h<index.length;h++){
        var pos = str.indexOf("|");
        filters.push(str.substring(0,pos));
        str = str.substring(pos+1);
    }
    //Set filter rules by column
    var val = '';
    for (var i=0; i<index.length;i++){
        val = filters[i];
        if (i == 0){
            if (val != "Any"){
                rows.push(data.getFilteredRows([{column: index[i], value: val}]));
            }
        } else if (i == 1){
            if (val != "Any"){
                if (val == "Male"){
                    val = "M";
                } else if (val == "Female"){
                    val = "F";
                }
                rows.push(data.getFilteredRows([{column: index[i], value: val}]));
            }
        } else if (i == 2 || i == 4){
            if (parseInt(val) > 0 ){
                rows.push(data.getFilteredRows([{column: index[i], minValue: val}]));
            }
        } else if (i == 3 || i == 5){
            if (parseInt(val) > 0){
                rows.push(data.getFilteredRows([{column: index[i], maxValue: val}]));
            }
        } else if (i >= 6){
            if (val == "false"){
                val = false;
            } else {
                val = true;
            }
            if (val){
                rows.push(data.getFilteredRows([{column: index[i], minValue: 1}]));
            }
        }
    }
    
    //Get final list of Rows
    var finalRows = new Array();
    for (var a=0;a<rows[0].length;a++){
        var add = new Array();
        for (var bb=1;bb<rows.length; bb++){
            add.push(1);
        }
        for (var b=1; b<rows.length; b++){
            for (var c=0; c<rows[b].length; c++){
                if (rows[0][a] == rows[b][c]){
                    add[b-1] = 0;
                }
            }
        }
        var sum = 0;
        for (var cc=0; cc<add.length;cc++){
            sum = sum + add[cc];
        }
        if (sum == 0 || rows.length == 1){
            finalRows.push(rows[0][a]);
        }
    }
    
    //Create output table
    var output = new Array();
    var titles = new Array();
    for (var jj=0;jj<data.getNumberOfColumns();jj++){
        titles.push(data.getColumnLabel(jj));
    }
    output.push(titles);
    for (var n=0; n<finalRows.length;n++){
        var temp = new Array();
        for (var p=0; p<data.getNumberOfColumns();p++){
            temp.push(data.getValue(finalRows[n],p));
        }
        output.push(temp);
    }
    var results = google.visualization.arrayToDataTable(output);
    return results;
}
function getSubset2(data,str,index){
    //Separate String of Filters
    var filters = new Array();
    var rows = new Array();
    for (var h=0;h<index.length;h++){
        var pos = str.indexOf("|");
        filters.push(str.substring(0,pos));
        str = str.substring(pos+1);
    }
    
    //Set filter rules by column
    var val = '';
    for (var i=0; i<index.length;i++){
        val = filters[i];
        if (val != "Any"){
            if (parseInt(val,10)>0){
                val = parseInt(val);
            }
            rows.push(data.getFilteredRows([{column: index[i], value: val}]));
        }
    }
    //Get final list of Rows
    var finalRows = new Array();
    for (var a=0;a<rows[0].length;a++){
        var add = new Array();
        for (var bb=1;bb<rows.length; bb++){
            add.push(1);
        }
        for (var b=1; b<rows.length; b++){
            for (var c=0; c<rows[b].length; c++){
                if (rows[0][a] == rows[b][c]){
                    add[b-1] = 0;
                }
            }
        }
        var sum = 0;
        for (var cc=0; cc<add.length;cc++){
            sum = sum + add[cc];
        }
        if (sum == 0 || rows.length == 1){
            finalRows.push(rows[0][a]);
        }
    }
    
    //Create output table
    var output = new Array();
    var titles = new Array();
    for (var jj=0;jj<data.getNumberOfColumns();jj++){
        titles.push(data.getColumnLabel(jj));
    }
    output.push(titles);
    for (var n=0; n<finalRows.length;n++){
        var temp = new Array();
        for (var p=0; p<data.getNumberOfColumns();p++){
            temp.push(data.getValue(finalRows[n],p));
        }
        output.push(temp);
    }
    var results = google.visualization.arrayToDataTable(output);
    return results;
}
function loadmap(parkdata,season,year){
    var map;
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(41.850233,-87.638532),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    $('#map_canvas').height("480px");
    $(function() {
        $("#map_canvas").mousemove(function(e){
            mouseXpos = e.pageX 
            mouseYpos = e.pageY
        });
    });
    
    google.maps.Polygon.prototype.getBounds = function() {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;        
        for (var i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            for (var ii = 0; ii < path.getLength(); ii++) {
                bounds.extend(path.getAt(ii));
            }
        }
        return bounds;
    }

    String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };
    
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    //Add polygons
    jQuery.getJSON('parks.json',function(data){
        $.each(data,function(i){
            var MapCoords = [];
            $.each(data[i].Points, function(j){
                MapCoords.push(new google.maps.LatLng(data[i].Points[j].Lat, data[i].Points[j].Lng))
            });
            var polygon = new google.maps.Polygon({
                paths: MapCoords,
                strokeColor: "#333333",
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: "#079626",
                fillOpacity: 0.3
            });
            /*google.maps.event.addListener(polygon,"mouseover",function(){
                this.setOptions({filleOpacity: 5});
                var html = '';
                if (data[i].Title != ''){
                    html = html + '<h4 style="margin-bottom:-10px;padding-bottom:0px;" >'
                    + data[i].Title + '</h4><br/>';
                }
                if (data[i].Description != '' && data[i].Description != null){
                    html += '<p>' + data[i].Description + '</p>';
                }
                $('#g_map_CT_Main_0_ccGoogleMap_tooltip').html(html);
                $('#g_map_CT_Main_0_ccGoogleMap_tooltip').css('left',mouseXpos + 20);
                $('#g_map_CT_Main_0_ccGoogleMap_tooltip').css('top',mouseYpos + 20);
                $('#g_map_CT_Main_0_ccGoogleMap_tooltip').show();
            })
            google.maps.event.addListener(polygon,"mouseout",function(){
                if (data[i].FitTo){
                    this.setOptions({fillOpacity: 0.5});
                } else {
                    this.setOptions({fillOpacity: 0.5});
                }
                $('#g_map_CT_Main_0_ccGoogleMap_tooltip').hide();
            })
            google.maps.event.addListener(polygon,"click",function(){
                //window.location = data[i].ParkURL;
            })*/
            polygon.setMap(map);
            if (data[i].FitTo){
                polygon.setOptions({
                    fillOpacity: 0.5,
                    fillColor: "#079626"
                })
                map.fitBounds(polygon.getBounds());
            }
        })
    })
    
    //Add points
    var parks = parkdata.getDistinctValues(0);
    var markers = new Array();
    for (var i = 0; i<parks.length; i++){
        var spots = 0;
        var enroll = 0;
        var found = false;
        var lat = 0;
        var lng = 0;
        var title = "";
        var hood = "";
        var area = "";
        var reg = "";
        for (var j =0; j<parkdata.getNumberOfRows();j++){
            if (parkdata.getValue(j,0) == parks[i] && parkdata.getValue(j,2) == season && parkdata.getValue(j,1) == year){
                spots += parkdata.getValue(j,9);
                enroll += parkdata.getValue(j,10);
                if (found == false){
                    lat = parkdata.getValue(j,12);
                    lng = parkdata.getValue(j,13);
                    title = parkdata.getValue(j,11);
                    hood = parkdata.getValue(j,8);
                    area = parkdata.getValue(j,6);
                    reg = parkdata.getValue(j,5);
                }
                found = true;
            }
        }        
        
        var myLatlng = new google.maps.LatLng(lat,lng);
        var util = enroll/spots;
        var mColor = 'red';
        if (util > .7){
            mColor = 'green';
        } else if (util > .5){
            mColor = 'yellow';
        }
        
        var marker = new google.maps.Marker({
            position: myLatlng,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeWeight: 1,
                fillColor: mColor,
                fillOpacity:.75
            },
            title:title
        });
        /*google.maps.event.addListener(marker,"mouseover",function(){
            $("#tooltip").show();
            $("#tooltip").text(this.title);
            $('#tooltip').css('top', mouseYpos);
            $('#tooltip').css('left', mouseXpos+10);
        })
        google.maps.event.addListener(marker,"mouseout",function(){
            $("#tooltip").hide();
        })*/
        google.maps.event.addListener(marker,"click",function(){
            $("#chart_title").html("<h1><small>"+this.title+"</small></h1>");
            drawLine(parkdata,this.title);
        })
        
        var temp =[marker,parkdata.getValue(i,11),util,hood,area,reg];
        markers.push(temp);
    }
    for (var k=0;k<markers.length;k++){
        markers[k][0].setMap(map);
    }
}
function drawLine(parkdata,park){
    var seasons = new Array();
    var spots = new Array();
    var enroll = new Array();
    //var totseas = new Array();
    for (var i = 0;i<parkdata.getNumberOfRows();i++){
        if (parkdata.getValue(i,11) == park){
            var found = false;
            var seas = parkdata.getValue(i,1)+"|"+parkdata.getValue(i,2)
            for (var j=0;j<seasons.length;j++){
                if (seas == seasons[j]){
                    spots[j] += parkdata.getValue(i,9);
                    enroll[j] += parkdata.getValue(i,10);
                    found = true;
                }
            }
            if (found == false){
                seasons.push(seas);
                spots.push(parkdata.getValue(i,9));
                enroll.push(parkdata.getValue(i,10));
            }
        }
        /*found = false;
        var comseas = parkdata.getValue(i,1)+"|"+parkdata.getValue(i,2)
        for (var ii=0;ii<totseas.length;ii++){
            if (comseas == totseas[ii]){
                totseas[ii][1] += parkdata.getValue(i,9);
                totseas[ii][2] += parkdata.getValue(i,10);
                found = true;
            }
        }
        if (found == false){
            totseas.push([comseas,parkdata.getValue(i,9),parkdata.getValue(i,10)]);
        }*/
    }
    var output = new Array();
    //output.push(["Season","Utilization"])
    for (var k=0;k<seasons.length;k++){
        var loc = seasons[k].indexOf("|");
        var sea = seasons[k].substr(loc+1);
        var mon = 0;
        if (sea == "Fall"){
            mon = 8;
        } else if (sea == "Summer"){
            mon = 5;
        } else if (sea == "Spring"){
            mon = 2;
        }
        /*for (var jj=0;jj<totseas.length;jj++){
            if (totseas[jj][0] == seasons[k]){
                var avg = totseas[jj][2]/totseas[jj][1];
            }
        }*/
        if (sea != "Events"){
            output.push([new Date(parseInt(seasons[k].substr(0,loc)),mon),0.7,0.5,Math.min(1,enroll[k]/spots[k])]);
        }
    }
    var results = new google.visualization.DataTable();
    results.addColumn('date', 'Season');
    results.addColumn('number', 'Green');
    results.addColumn('number', 'Yellow');
    results.addColumn('number', 'Utilization');
    for (var l=0;l<output.length;l++){
        results.addRow(output[l]);
    }
    results.sort(0);
    //var results = google.visualization.arrayToDataTable(output);
    var options = {
        legend: {position: 'none'},
        chartArea: {left:50,top:6,width:"85%",height:"60%"},
        vAxis: {title:'Park Utilization',format:'#%', minValue: 0, maxValue: 1},
        hAxis: {},
        series: {0:{color:'#99ff99'},1:{color:'#ff9999'},2:{color:'blue',pointSize:6,curveType:'linear',lineWidth:3}}
    }
    var line = new google.visualization.LineChart(document.getElementById('line_div'));
    line.draw(results, options);
}

function barData(parkData){
    var groups = parkData.getDistinctValues(4);
    var spots = new Array();
    var enroll = new Array();
    for (var i=0;i<groups.length;i++){
        spots.push(0);
        enroll.push(0);
    }
    for (var j=0;j<parkData.getNumberOfRows();j++){
        for (var k=0;k<groups.length;k++){
            if (groups[k] == parkData.getValue(j,4)){
                spots[k] = spots[k] + parkData.getValue(j,9);
                enroll[k] = enroll[k] + parkData.getValue(j,10);
            }
        }
    }
    var output = new Array();
    output.push(["Group","Utilization"]);
    for (var m=0;m<groups.length;m++){
        var util = enroll[m]/spots[m];
        output.push([groups[m],util]);
    }
    var results = google.visualization.arrayToDataTable(output);
    return results;
}
function barData2(parkData,parkData2,groups){
    var spots = new Array();
    var enroll = new Array();
    for (var i=0;i<groups.length;i++){
        spots.push(0);
        enroll.push(0);
    }
    for (var j=0;j<parkData.getNumberOfRows();j++){
        for (var k=0;k<groups.length;k++){
            if (groups[k] == parkData.getValue(j,4)){
                spots[k] = spots[k] + parkData.getValue(j,9);
                enroll[k] = enroll[k] + parkData.getValue(j,10);
            }
        }
    }
    var groups2 = groups;
    var spots2 = new Array();
    var enroll2 = new Array();
    for (var i=0;i<groups2.length;i++){
        spots2.push(0);
        enroll2.push(0);
    }
    for (var j=0;j<parkData2.getNumberOfRows();j++){
        for (var k=0;k<groups2.length;k++){
            if (groups2[k] == parkData2.getValue(j,4)){
                spots2[k] = spots2[k] + parkData2.getValue(j,9);
                enroll2[k] = enroll2[k] + parkData2.getValue(j,10);
            }
        }
    }
    
    var output = new Array();
    output.push(["Group","Left","Right"]);
    for (var m=0;m<groups.length;m++){
        if (groups[m] != "Partnership Rental Offerings"){
            var util = Math.round(10000*(enroll[m]/spots[m]))/10000;
            var match = false;
            for (var n=0;n<groups2.length;n++){
                if (groups2[n] == groups[m]){
                    var util2 = Math.round(10000*(enroll2[n]/spots2[n]))/10000;
                    output.push([groups[m],util,util2]);
                    match = true;
                }
            }
            if (match == false){
                output.push([groups[m],util,0]);
            }
        }
    }
    var results = google.visualization.arrayToDataTable(output);
    return results;
}