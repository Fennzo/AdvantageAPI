import { Component, Input, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  @Input() stock_data: any;
  chart_name = '';
  timeSeriesData = [];
  @Input() forex_data: any;
  forex_info = '';

  constructor() {
    if(!this.stock_data)
      return;
    else{
      console.log("constrcutor CALLED")
      this.initalize()
    }
  }

  initalize(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  drawChart(): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Time');
    dataTable.addColumn('number', 'Open');
    dataTable.addColumn('number', 'High');
    dataTable.addColumn('number', 'Low');
    dataTable.addColumn('number', 'Close');
    dataTable.addRows(this.parseChartData());

    const chartOptions = {
      title: this.chart_name,
      height: 500,
      width: 900,
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.CandlestickChart(document.getElementById('chartContainer'));
    chart.draw(dataTable, chartOptions);
  }

  parseChartData(): any[] {
    const timeSeries = [];
    console.log("data", this.stock_data);
    console.log("forex_data", this.forex_data)

    // stock
    if ('Time Series (5min)' in this.stock_data){
      this.chart_name = this.stock_data["Meta Data"]["2. Symbol"] + ' stock price'
    this.timeSeriesData = this.stock_data['Time Series (5min)'];}
    // forex
    else if ('Time Series FX (Daily)' in this.stock_data){
      this.forex_info = "1 " + this.stock_data["Meta Data"]["2. From Symbol"] + " to " + this.stock_data["Meta Data"]["3. To Symbol"] + this.forex_data["Realtime Currency Exchange Rate"]["5. Exchange Rate"] + " " + this.forex_data["Realtime Currency Exchange Rate"]["6. Last Refreshed"] + " " + this.forex_data["Realtime Currency Exchange Rate"]["7. Time Zone"]
      this.chart_name = this.stock_data["Meta Data"]["2. From Symbol"] + ' To ' + this.stock_data["Meta Data"]["3. To Symbol"]
      this.timeSeriesData = this.stock_data['Time Series FX (Daily)'];
      console.log("forex_info", this.forex_info)
      console.log("chart_name", this.chart_name)
    }
    else if('Error Message'){
      this.forex_info = "Not available! Please choose another option"
    }

    for (const key in this.timeSeriesData) {
      if (this.timeSeriesData.hasOwnProperty(key)) {
        const time = new Date(key).toISOString();
        const open = parseFloat(this.timeSeriesData[key]['1. open']);
        const high = parseFloat(this.timeSeriesData[key]['2. high']);
        const low = parseFloat(this.timeSeriesData[key]['3. low']);
        const close = parseFloat(this.timeSeriesData[key]['4. close']);

        timeSeries.push([time, open, high, low, close]);
      }
    }

    return timeSeries;
  }
}
