import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, shareReplay, tap} from "rxjs";
import {Router} from "@angular/router";

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
  api_key = 'M4QG84LQ6MXGD3SF';
  stock_show_chart = false;
  currency_show_chart = false;
  data_observer: Observable<any> = of(null);
  stock_chart_data: Object = [];
  searchable = ''
  stock_search_results: any[] = [];
  forex_list: any[] = [];
  crypto_list: any[] = [];
  from_currency = ''
  to_currency = ''
  forex_chart_data :Object = [];
  forex_search_result: any[] = [];
  forex_details_data :Object = [];

  constructor(private router : Router ,private http: HttpClient) { } // used to access the service methods

  generate_stock_chart(){
   // console.log("generateStockUrl() called");
    this.url = this.starter_url + 'TIME_SERIES_INTRADAY&symbol=' + this.stock_symbol + '&interval=5min&apikey=' + this.api_key;
  //  console.log("URL", this.url)
  //
  //   this.data_observer = this.http.get(this.url).pipe(
  //     tap(data => this.stock_chart_data = data),
  //     shareReplay(1)
  //   );
    this.http.get(this.url).subscribe(data => {
     // console.log("CHART DATA: ", data);
      this.stock_chart_data = data;
      this.router.navigate(['/data/' + this.stock_symbol], {state : { stock_chart_data : this.stock_chart_data}})
    });
    console.log("stockchart", this.stock_chart_data)
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
        //console.log("trim", cols[1])
        this.forex_list.push({code: cols[0], name: cols[1].trim()})
      })

      //console.log("forex list", this.forex_list)
    })

  }

  generate_forex_chart() {
    const forex_chart_data_url = this.starter_url + 'FX_DAILY&from_symbol=' + this.from_currency + '&to_symbol=' + this.to_currency + '&apikey=' + this.api_key;
    const forex_details_url = this.starter_url + 'CURRENCY_EXCHANGE_RATE&from_currency=' + this.from_currency + '&to_currency=' + this.to_currency + '&apikey=' + this.api_key;
    console.log("forex_details_url", forex_details_url)
    this.http.get(forex_chart_data_url).subscribe((data) => {
      this.forex_chart_data = data;
      console.log("app forex_chart_data: ", this.forex_chart_data);

      this.http.get(forex_details_url).subscribe((data) => {
        this.forex_details_data = data;
        console.log("app forex_details_data: ", this.forex_details_data)
        //this.currency_show_chart = true;
        this.router.navigate(['/data/' + this.from_currency + 'to' + this.to_currency], {state : { forex_chart_data : this.forex_chart_data, forex_details_data : this.forex_details_data }})
      })
    })



  }

}
