var interest_rate = 8;
var amount = 5000;
var period = 15;
var useSameAmount = false;
var recurrIn = 'yearly';
var final_amount = {
    monthly:0,
    quarterly:0,
    half_yearly:0,
    yearly:0
};
let tot_investment = {
    monthly:12*amount*period,
    quarterly:4*amount*period,
    half_yearly:2*amount*period,
    yearly:1*amount*period
};
var order = ['monthly','quarterly','half_yearly','yearly'];
var amount_arr = [amount,amount,amount,amount];
var yearByYearInterest;
var yearByYearAmount = [];

function calc(amnt,incBy){
    let current = 0;
    if(incBy=="monthly")
        var divisor = 1;
    else if(incBy=="quarterly")
        divisor = 3;
    else if(incBy=="half_yearly")
        divisor = 6;
    else if(incBy=="yearly")
        divisor = 12;
    for(let i=0;i<12;i++){
        current += (final_amount[incBy]+(amnt*(Math.floor(i/divisor)+1)))*(interest_rate/12)/100;
    }
    if(incBy=="yearly"){
        yearByYearAmount.push(yearByYearAmount[yearByYearAmount.length-1]+amnt);
    }
    yearByYearInterest[incBy].push(yearByYearInterest[incBy][yearByYearInterest[incBy].length-1]+Math.round(current));
    return (12/divisor)*amnt+Math.round(current);
}

function commas(fig){
    return fig.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
}

function int_earned(by){
    return (final_amount[by]-tot_investment[by]);
}

function roi(by){
    return (((final_amount[by]-tot_investment[by])/tot_investment[by])*100).toFixed(2);
}

function showGraph(bool){
    if(bool){
        document.getElementById('graph-tab').classList.add('active');
        document.getElementById('table-tab').classList.remove('active');
        document.getElementById('graph').style.display = 'block';
        document.getElementById('graph2').style.display = 'block';
        document.getElementById('table').style.display = 'none';
    }
    else{
        document.getElementById('table-tab').classList.add('active');
        document.getElementById('graph-tab').classList.remove('active');
        document.getElementById('table').style.display = 'block';
        document.getElementById('graph').style.display = 'none';
        document.getElementById('graph2').style.display = 'none';
    }
    
}

function calculate(){
    amount = parseInt(document.getElementById('amount').value);
    interest_rate = parseFloat(document.getElementById('interest').value);
    period = parseInt(document.getElementById('period').value);
    recurrIn = document.getElementById('recurrence').value;
    amount_arr = [amount,amount,amount,amount];
    yearByYearInterest = {
        monthly:[0],
        quarterly:[0],
        half_yearly:[0],
        yearly:[0]
    };
    yearByYearAmount = [0];
    useSameAmount = false;  //just make this true to keep the amount constant over the years
    if(!useSameAmount){
        if(recurrIn == 'yearly')
            amount /= 12;
        else if(recurrIn == "half_yearly")
            amount /= 6;
        else if(recurrIn == "quarterly")
            amount /= 3;

        amount_arr = [amount,amount*3,amount*6,amount*12];
    }
    tot_investment = {
        monthly:parseInt(12*amount_arr[0]*period),
        quarterly:parseInt(4*amount_arr[1]*period),
        half_yearly:parseInt(2*amount_arr[2]*period),
        yearly:parseInt(1*amount_arr[3]*period)
    };
    final_amount = {
        monthly:0,
        quarterly:0,
        half_yearly:0,
        yearly:0
    };
    for(let i=0;i<period;i++){
        for(let j=0;j<order.length;j++){
            final_amount[order[j]] += calc(amount_arr[j],order[j]);
            if(order[j]=='yearly'){
                // console.log(final_amount[order[j]]);
            }
        }
    }
    yearByYearAmount.shift();
    document.getElementById('finalAmnt').innerHTML = `<th scope="row">Final amount(&#8377;)</th>`;
    document.getElementById('tot_investment').innerHTML = `<th scope="row">Your investment(&#8377;)</th>`;
    document.getElementById('int_earned').innerHTML = `<th scope="row">Interest earned(&#8377;)</th>`;
    document.getElementById('roi').innerHTML = `<th scope="row">ROI(%)</th>`;
    
    for(let i=0;i<order.length;i++){
        document.getElementById('finalAmnt').innerHTML += `<td>${commas(final_amount[order[i]])}</td>`;
        document.getElementById('tot_investment').innerHTML += `<td>${commas(tot_investment[order[i]])}</td>`;
        document.getElementById('int_earned').innerHTML += `<td>${commas(int_earned(order[i]))}</td>`;
        document.getElementById('roi').innerHTML += `<td>${roi(order[i])}</td>`;
        yearByYearInterest[order[i]].shift();
    }

    document.getElementById('results').style.display = 'block';
    loadChart();
}

function loadChart(){
    Highcharts.chart('graph', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Difference of interest earned by different Recurrences'
        },
        xAxis: {
            categories: ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly']
        },
        yAxis: {
            title: {
                text: 'Amount in Rupees'
            },
            stackLabels: {
                enabled: true
            },
            min:int_earned('monthly')
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Interest earned',
            data: [int_earned('monthly'),int_earned('quarterly'),int_earned('half_yearly'),int_earned('yearly')]
        }]
    });
    Highcharts.chart('graph2', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Growth over years'
        },
        subtitle:{
            text: 'When recurrence is '+recurrIn
        },
        xAxis: {
            categories: [...Array(period).keys()].map(i=>i+1)
        },
        yAxis: {
            title: {
                text: 'Amount in Rupees'
            },
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Interest earned',
            data: yearByYearInterest[recurrIn]
        }, {
            name: 'Your investment',
            data: yearByYearAmount
        }]
    });
}
