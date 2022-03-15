import React, { useEffect, useState, useRef } from 'react';
import Input from './Components/Input';
import Button from './Components/Button';
import LineChart from './Components/LineChart';
import './index.css';

function App () {

  //Ref Hook
  const inputRef = useRef(null);
  
  //State Hooks
  const [values, setValues] = useState(() => []);
  const [dates, setDates] = useState(() => []);
  const [stockName, setStockName] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [renderIt, setRenderIt] = useState(false);

  //Helper Functions ->
  function handleClick() {
    setButtonClicked(!buttonClicked);
    setRenderIt(true);
    inputRef.current.value = '';
  }
  
  function handleChange(e) {
    setStockName(e.target.value);
    setRenderIt(false);
  }
  //<- Helper Functions

  //UseEffect hook 
  useEffect(() => {
    const fetchStocks = async () => {
      let datesArray = [];
      let valuesArray = [];
      const API_Key = 'DHE289O3YLGE9ZLP';
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockName}&interval=60min&apikey=${API_Key}`);
        if(response.ok) {
          const data = await response.json();
          const arrayOfAllValues = (Object.keys(Object.entries(data)[1][1]));
          datesArray.push(arrayOfAllValues[0]);
          //setDates(datesArray);
          for(let i = 10; i >= 1; i--) {
            datesArray.push(arrayOfAllValues[Math.floor((arrayOfAllValues.length - 1) / i)]);
          }
          for(let i = 0; i <= 10; i++) {
            valuesArray.push(parseFloat(data['Time Series (60min)'][datesArray[i]]['1. open']));
          }
          
        } else {
            throw new Error('Request Failed');
        }
      } catch(error) {
          console.log("eroare in catch");
      }

      //Call the state changing functions.
      setValues(valuesArray);
      setDates(datesArray);
    }
    fetchStocks(); //Call the above implemented function
    return () => { //unmounting phase.
      setDates([]);
      setValues([]);
    }
  }, [buttonClicked]); //only call UseEffect on mounting and when the buttonClicked state changes.

  
  return (<div>
    <div className='infoDiv'>
      <label htmlFor="inputBox" className = "header">Search For a Stock</label>
      <div className='searchDiv'>
        <Input name = "inputBox" id="inputBox" onChange={handleChange} ref={inputRef}/>
        <Button id="button" onClick={handleClick}/>
      </div>
      
      <h1>You'll be searching for: <span>{stockName}</span></h1>
    </div>
    <LineChart render={renderIt} dates={dates} values={values} inputName={stockName}/>
  </div>);
}

export default App;
