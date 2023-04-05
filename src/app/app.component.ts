import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Homework4';
  starter_url = 'https://www.alphavantage.co/query?function=';
  stock_search_url = 'SYMBOL_SEARCH&keywords=';
  stock_symbol = '';
  url = '';
  api_key = '5QKIUHUZF5KPBKR8';
  show_chart = false;
  chartData: Object = [];
  searchable = ''
  stock_search_results: any[] = [];
  forex_list: any[] = [];
  crypto_list: any[] = [];
  from_currency = ''
  to_currency = ''
  currency_info :Object = [];
  forex_search_result: any[] = [];

  constructor(private http: HttpClient) { } // used to access the service methods

  generate_stock_chart(){
   // console.log("generateStockUrl() called");
    this.url = this.starter_url + 'TIME_SERIES_INTRADAY&symbol=' + this.stock_symbol + '&interval=5min&apikey=' + this.api_key;
  //  console.log("URL", this.url)

    this.http.get(this.url).subscribe((data) => {
      this.chartData = data;
      console.log("CHART DATA: ", this.chartData);
      this.show_chart = true;

  });
}

  forex_search(event: any) {

   // console.log("forex list2", this.forex_list)
    let input = event.target.value;
   // console.log("input forex", input)
    this.forex_search_result = this.forex_list.filter((match: any) => {
      return match.code.toLowerCase().startsWith(input.toLowerCase()) ||
        match.name.toLowerCase().startsWith(input.toLowerCase())
    });
  }

  symbol_search(event: any) {
    let input = event.target.value;
    let final_search_url = this.starter_url + this.stock_search_url + input + '&apikey=' + this.api_key;
   // console.log("url: ", final_search_url);
  //  console.log("input: ", input);
    this.http.get(final_search_url).subscribe((data: any) => {
      this.stock_search_results = data.bestMatches.map((match: any) => {
        return {
          symbol: match['1. symbol'],
          name: match['2. name']
        };
      });
    });
 //   console.log(this.stock_search_results)
  }

  ngOnInit(){
    this.http.get('assets/csv/digital_currency_list.csv', {responseType: 'text'}).subscribe(data => {
      const rows = data.split('\n');
      rows.shift()
      this.crypto_list = rows.map((row : any) => {
        const cols = row.split(',');
        return {
          code: cols[0],
          name: cols[1].trim()
        }
      })
    })

    this.http.get('assets/csv/physical_currency_list.csv', {responseType: 'text'}).subscribe(data => {
      const rows = data.split('\n');
      rows.shift()
      rows.map((row : any) => {
        const cols = row.split(',');
        this.forex_list.push({code: cols[0], name: cols[1].trim()})
      })

      console.log("forex list", this.forex_list)
    })

  }

  generate_forex_chart() {
    const chart_url = this.starter_url + 'FX_DAILY&from_symbol=' + this.from_currency + '&to_symbol=' + this.to_currency + '&apikey=' + this.api_key;
    const exchange_rate_url = this.starter_url + 'CURRENCY_EXCHANGE_RATE&from_currency=' + this.from_currency + '&to_currency=' + this.to_currency + '&apikey=' + this.api_key;

    this.http.get(chart_url).subscribe((data) => {
      this.chartData = data;
      console.log("CHART DATA: ", this.chartData);

    });

    this.http.get(exchange_rate_url).subscribe((data) => {
      this.currency_info = data;
      console.log("currency_info", this.currency_info)
      this.show_chart = true;

    })
  }

}
