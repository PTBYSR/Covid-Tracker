import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'
import { useState, useEffect } from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
// import LineGraph from './LineGraph'
import './Table.css'
import { sortData, prettyPrintStat } from './util'
import 'leaflet/dist/leaflet.css'


function App() {
  const[countries, setCountries] = useState([])
  const[countryInfo, setCountryInfo] = useState([])
  const[tableData, setTableData] = useState([])
  const[country, setCountry] = useState('worldwide')
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  })
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then(res => res.json())
        .then(data => {
          setCountryInfo(data)
        }) 
  })

  useEffect(() => {
    const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }

        ))
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries)
        setMapCountries(data)
      })
  }
  getCountriesData();
  }, []);
  
  
  const changeCountry = async (e) => {
    const countryCode = e.target.value
    // console.log

    const url = countryCode ==='worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
      
      
    }
  
return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={changeCountry} value={country}>
              <MenuItem  value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
        
              <MenuItem value={country.value}>{country.name}</MenuItem>
        
              ))}
        
              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">option</MenuItem>
              <MenuItem value="worldwide">option</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
              <InfoBox
                isRed 
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                total={prettyPrintStat(countryInfo.cases)}
                cases={prettyPrintStat(countryInfo.todayCases)} 
                title="Coronavirus Cases"/>
              <InfoBox
              isGreen
                active={casesType === "recovered"} 
                onClick={(e) => setCasesType("recovered")}
                total={prettyPrintStat(countryInfo.recovered)} 
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                title="Recovered"/>
              <InfoBox
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")} 
                total={prettyPrintStat(countryInfo.deaths)} 
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                title="Deaths"/>
        </div>
        <Map 
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <br/>
          <br/>
          <h3>Worldwide new cases</h3>
          {/* <LineGraph casesType={casesType} /> */}
          <InfoBox
                isAll 
                // active={casesType === "cases"}
                // onClick={(e) => setCasesType("cases")}
                total={countryInfo.cases}
                cases={prettyPrintStat(countryInfo.todayCases)} 
                title="Coronavirus Cases"/>
        </CardContent>      
      </Card>
    </div>
  );
}

export default App;
