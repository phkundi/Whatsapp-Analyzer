const monthNames = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const weekdayNames = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}

const colors = [
  'rgba(11, 102, 35, 1)',
  'rgba(157, 193, 131, 1)',
  'rgba(112, 130, 56, 1)',
  'rgba(199, 234, 70, 1)',
  'rgba(63, 122, 77, 1)',
  'rgba(0, 168, 107, 1)',
  'rgba(143, 151, 121, 1)',
  'rgba(79, 121, 66, 1)',
  'rgba(41, 171, 135, 1)',
  'rgba(169, 186, 157, 1)',
  'rgba(138, 154, 91, 1)',
  'rgba(152, 251, 152, 1)',
  'rgba(1, 121, 111, 1)',
  'rgba(208, 240, 192, 1)',
  'rgba(0, 165, 114, 1)',
  'rgba(75, 83, 32, 1)',
  'rgba(80, 220, 100, 1)',
  'rgba(76, 187, 23, 1)',
  'rgba(57, 255, 20, 1)',
  'rgba(68, 76, 56, 1)',
  'rgba(0, 78, 56, 1)',
  'rgba(103, 146, 103, 1)',
  'rgba(46, 139, 87, 1)',
  'rgba(80, 200, 120, 1)'
]

const blueShades = [
  '#026aa7',
  '#0079bf',
  '#298fca',
  '#5ba4cf',
  '#8bbdd9',
  '#bcd9ea',
  '#e4f0f6',

  '#026aa7',
  '#0079bf',
  '#298fca',
  '#5ba4cf',
  '#8bbdd9',
  '#bcd9ea',
  '#e4f0f6',

  '#026aa7',
  '#0079bf',
  '#298fca',
  '#5ba4cf',
  '#8bbdd9',
  '#bcd9ea',
  '#e4f0f6',
]

function formatNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setCharts(jsonData){

    // Top Cards
    var tmCard = document.getElementById('total-messages');
    tmCard.textContent = formatNumber(jsonData['Total_Messages']);
    var admCard = document.getElementById('average-daily');
    admCard.textContent = jsonData['Average_Messages_Per_Day'];
    var twCard = document.getElementById('total-words');
    twCard.textContent = formatNumber(jsonData['Total_Word_Count']);
    var awmCard = document.getElementById('average-words-message');
    awmCard.textContent = jsonData['Average_Words_Per_Message'];

    // Top 10 Authors
    var top10Authors = document.getElementById('top_10_authors').getContext('2d');
    top10Authors.canvas.height = 240;
    var topAuthorsChart = new Chart(top10Authors, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: Object.keys(jsonData['Top_10_Authors']),
            datasets: [{
                backgroundColor: blueShades.slice(0,Object.keys(jsonData['Top_10_Authors']).length),
                // borderColor: 'rgb(255, 99, 132)',
                data: Object.values(jsonData['Top_10_Authors'])
            }]
        },

        // Configuration options go here
        options: {
          legend: {
            display: false
          },
        }
    });

    // // Messages by Author
    var table = document.getElementById('authorCountTable');
    var authorValueCounts = jsonData['Author_Value_Counts'];
    var messagesByAuthor = Object.entries(jsonData['Author_Value_Counts']);

    for (let i = 0; i < messagesByAuthor.length; i++) {
        var row = table.insertRow();
        rank = row.insertCell();
        rank.textContent = `${i+1}.`;
        for (let e = 0; e < messagesByAuthor[i].length; e++) {
          cell = row.insertCell();
          if(e==1){
            cell.textContent = formatNumber(messagesByAuthor[i][e]);
          } else {
            cell.textContent = messagesByAuthor[i][e];
          }

        }
        var percent = row.insertCell();
        var p = Number.parseFloat((messagesByAuthor[i][1] / jsonData['Total_Messages'])*100).toFixed(2);
        percent.textContent = `${p}%`
            
    }

  // Most Active Years
  var topYears = document.getElementById('mostActiveYears').getContext('2d');
    var topYearsChart = new Chart(topYears, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: Object.keys(jsonData['Messages_Per_Year']),
            datasets: [{
                backgroundColor: blueShades.slice(0,Object.keys(jsonData['Messages_Per_Year']).length),
                data: Object.values(jsonData['Messages_Per_Year'])
            }]
        },

        // Configuration options go here
        options: {
          legend: {
            display: false
          }
        }
    });

  // Most Active Months
  

  var topMonths = document.getElementById('mostActiveMonths').getContext('2d');
    var topMonthsChart = new Chart(topMonths, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: Object.keys(jsonData['Most_Active_Month']).map(x => monthNames[x]),
            datasets: [{
                backgroundColor: blueShades.slice(0,Object.keys(jsonData['Most_Active_Month']).length),
                data: Object.values(jsonData['Most_Active_Month'])
            }]
        },

        // Configuration options go here
        options: {
          legend: {
            display: false
          }
        }
    });

    // Most Active Weekdays
    
    var topWeekdays = document.getElementById('mostActiveWeekdays').getContext('2d');
    var topWeekdaysChart = new Chart(topWeekdays, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: Object.keys(jsonData['Most_Active_Weekday']).map(x => weekdayNames[x]),
            datasets: [{
                backgroundColor: blueShades.slice(0,Object.keys(jsonData['Most_Active_Weekday']).length),
                data: Object.values(jsonData['Most_Active_Weekday'])
            }]
        },

        // Configuration options go here
        options: {
          legend: {
            display: false
          }
        }
    });

    // Most Active Hours
    var hoursDict = jsonData['Most_Active_Hour']
    let hoursKeys = Object.keys(hoursDict).sort();
    let hoursValues = [];

    hoursKeys.forEach(element => {
        hoursValues.push(hoursDict[element]) 
    });

    var topHours = document.getElementById('mostActiveHours').getContext('2d');
    topHours.canvas.height = 40;
    var topHoursChart = new Chart(topHours, {
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

    // Most Active Days Ever
    var topDaysTable = document.getElementById('topDaysTable');
    var topDays = jsonData['Top_10_Days_By_Messages'];
    var topDays = Object.entries(jsonData['Top_10_Days_By_Messages']).slice(0,10);

    for (let i = 0; i < topDays.length; i++) {
        var row = topDaysTable.insertRow();
        rank = row.insertCell();
        rank.textContent = `${i+1}.`;
        for (let e = 0; e < topDays[i].length; e++) {
          cell = row.insertCell();
          if(e == 1){
            cell.textContent = `${topDays[i][e]} Messages`;
          } else {
              cell.textContent = topDays[i][e];
          }
        }
    }

     // Least Active Days Ever
     var worstDaysTable = document.getElementById('worstDaysTable');
     var worstDays = jsonData['Worst_10_Days_By_Messages'];
     var worstDays = Object.entries(jsonData['Worst_10_Days_By_Messages']).reverse().slice(0,10);
 
     for (let i = 0; i < worstDays.length; i++) {
         var row = worstDaysTable.insertRow();
         rank = row.insertCell();
         rank.textContent = `${i+1}.`;
         for (let e = 0; e < worstDays[i].length; e++) {
           cell = row.insertCell();
           if(e == 1){
             cell.textContent = `${worstDays[i][e]} Messages`;
           } else {
               cell.textContent = worstDays[i][e];
           }
         }
     }

     // Most Common Messages
     var topMessagesTable = document.getElementById('topMessagesTable');
     var topMessages = jsonData['Most_Common_Messages'];
     var topMessages = Object.entries(jsonData['Most_Common_Messages']).slice(0,10);
     for (let i = 0; i < topMessages.length; i++) {
         var row = topMessagesTable.insertRow();
         rank = row.insertCell();
         rank.textContent = `${i+1}.`;
         for (let e = 0; e < topMessages[i].length; e++) {
           cell = row.insertCell();
           if(e == 1){
             cell.textContent = formatNumber(topMessages[i][e]);
           } else {
               cell.textContent = topMessages[i][e];
           }
         }
     }

     // Most Common Emojis
     var topEmojisTable = document.getElementById('topEmojisTable');
     var topEmojis = jsonData['Most_Common_Emojis'];
     var topEmojis = Object.entries(jsonData['Most_Common_Emojis']).slice(0,10);
     for (let i = 0; i < topEmojis.length; i++) {
         var row = topEmojisTable.insertRow();
         rank = row.insertCell();
         rank.textContent = `${i+1}.`;
         for (let e = 0; e < topEmojis[i].length; e++) {
           cell = row.insertCell();
           if(e == 1){
            cell.textContent = formatNumber(topEmojis[i][1][e]);
           } else {
            cell.textContent = topEmojis[i][1][e];
           }
           
         }
     }

  } // set charts
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