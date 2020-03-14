function makeYearsHTML(data, parent){

    var html = '';

    for(i=0; i<data.length; i++){
        var child = `
        <div class="years__year mb-5">
            <div class="card">
            <h3 class="card-header font-weight-bold text-blue text-center">${data[i]['year']}</h3>
            <div class="card-body">
                <!-- Basic -->
                <div class="row text-center">
                <div class="col-lg-3 years__year__basic">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-1">Total Messages</h5>
                    <p class="font-weight-bold heading text-blue">${formatNumber(data[i]['Total_Messages'])}</p>
                </div>
                <div class="col-lg-3">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-1">Average Daily Messages</h5>
                    <p class="font-weight-bold heading text-blue">${data[i]['Average_Messages_Per_Day']}</p>
                </div>
                <div class="col-lg-3">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-1">Total Words</h5>
                    <p class="font-weight-bold heading text-blue">${formatNumber(data[i]['Total_Words'])}</p>
                </div>
                <div class="col-lg-3">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-1">Average Words per Message</h5>
                    <p class="font-weight-bold heading text-blue">${data[i]['Average_Words_Per_Message']}</p>
                </div>
                </div>
                <!-- End Basic -->
                <hr>
                <div class="row mt-3 text-center">
                <div class="col-lg-4">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-2">Top Authors</h5>
                    <canvas id="authors${data[i]['year']}"></canvas>
                </div>
                <div class="col-lg-4">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-2">Most Active Times</h5>
                    <canvas id="timesYear${data[i]['year']}"></canvas>
                </div>
                <div class="col-lg-4">
                    <h5 class="text-xs font-weight-bold text-blue text-uppercase mb-2">Top Messages</h5>
                    <table class="table" id="messages${data[i]['year']}">
                    
                    </table>
                </div>
                </div>
            </div>
            </div>
        </div>
        `
        html = html + child;
    }

    parent.innerHTML = html;
}

function makeYearCharts(data){
    for(i=0; i<data.length; i++){

        // Most Active Hours
        var hoursDict = data[i]['Most_Active_Times']
        let hoursKeys = Object.keys(hoursDict).sort();
        let hoursValues = [];

        hoursKeys.forEach(element => {
            hoursValues.push(hoursDict[element]) 
        });

        var topHoursYear = document.getElementById(`timesYear${data[i]['year']}`).getContext('2d');
        var topHoursYearChart = new Chart(topHoursYear, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: hoursKeys,
                datasets: [{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: blueShades[1],
                    data: hoursValues
                }]
            },

            // Configuration options go here
            options: {
            legend: {
                display: false
            }
            }
        });
    
        // Top Authors
        var top10Authors = document.getElementById(`authors${data[i]['year']}`).getContext('2d');
        var topAuthorsChart = new Chart(top10Authors, {
            // The type of chart we want to create
            type: 'horizontalBar',

            // The data for our dataset
            data: {
                labels: Object.keys(data[i]['Top_Authors']),
                datasets: [{
                    backgroundColor: blueShades.slice(0,Object.keys(data[i]['Top_Authors']).length),
                    // borderColor: 'rgb(255, 99, 132)',
                    data: Object.values(data[i]['Top_Authors'])
                }]
            },

            // Configuration options go here
            options: {
            legend: {
                display: false
            },
            }
        });

        // Top Messages
        var topMessagesTable = document.getElementById(`messages${data[i]['year']}`);
        var topMessages = data[i]['Top_Messages'];
        var topMessages = Object.entries(data[i]['Top_Messages']);
        for (let i = 0; i < topMessages.length; i++) {
            var row = topMessagesTable.insertRow();
            rank = row.insertCell();
            rank.textContent = `${i+1}.`;
            for (let e = 0; e < topMessages[i].length; e++) {
            cell = row.insertCell();
            if(e == 1){
                cell.textContent = `${topMessages[i][e]}`;
            } else {
                cell.textContent = topMessages[i][e];
            }
            }
        }
    }
    
}