import { Component, Input, OnInit } from '@angular/core';
import {Router} from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  stock_chart: any;
  chart_name = '';
  timeSeriesData = [];
  forex_chart: any;
  forex_details : any;
  forex_chart_label =''

  constructor(private router : Router) {
    this.stock_chart = this.router.getCurrentNavigation()?.extras.state?.['stock_chart_data'];
    console.log("stock_chart", this.stock_chart)
    if ( typeof this.stock_chart === 'undefined' ){
      this.forex_chart = this.router.getCurrentNavigation()?.extras.state?.['forex_chart_data'];
      this.forex_details = this.router.getCurrentNavigation()?.extras.state?.['forex_details_data'];

      console.log("forex_chart", this.forex_chart)
      console.log("forex_deta", this.forex_details)
      this.handleForexChart()
    }
   else{
      this.handleStockChart()

    }
    console.log("constrcutor CALLED")
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

  handleStockChart(){
    this.chart_name = this.stock_chart["Meta Data"]["2. Symbol"] + ' stock price'
    this.timeSeriesData = this.stock_chart['Time Series (5min)']
    this.initalize()
  }

  handleForexChart(){
    this.forex_chart_label = "1 " +
      this.forex_chart["Meta Data"]["2. From Symbol"] + " to " +
      this.forex_chart["Meta Data"]["3. To Symbol"] + " " +
      this.forex_details["Realtime Currency Exchange Rate"]["5. Exchange Rate"] + " " +
      this.forex_details["Realtime Currency Exchange Rate"]["6. Last Refreshed"] + " " +
      this.forex_details["Realtime Currency Exchange Rate"]["7. Time Zone"]
    this.chart_name = this.forex_chart["Meta Data"]["2. From Symbol"] + ' To ' + this.forex_chart["Meta Data"]["3. To Symbol"]
    this.timeSeriesData = this.forex_chart['Time Series FX (Daily)'];
    console.log("timeseries", this.timeSeriesData)
    this.initalize()
  }
  parseChartData(): any[] {
    console.log("timeseries", this.timeSeriesData)
    const timeSeries = [];
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
