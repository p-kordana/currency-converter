// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rate, setRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchConversion() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${inputValue}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with the request.");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          console.log(data);
          setRate(data?.rates[toCurrency]);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (fromCurrency === toCurrency) {
        setRate(inputValue);
        setError("");
        return;
      }

      if (inputValue === 0) {
        setRate(0);
        setError("");
        return;
      }

      fetchConversion();

      return function () {
        controller.abort();
      };
    },
    [inputValue, fromCurrency, toCurrency]
  );

  return (
    <div className="container">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(Number(e.target.value))}
        // disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {/* <button onClick={() =>}>Submit</button> */}
      <p>
        {isLoading && <>Loading...</>}
        {error && <>{error}</>}
        {!isLoading && !error && (
          <>
            {inputValue} {fromCurrency} {"->"} {rate} {toCurrency}
          </>
        )}
      </p>
    </div>
  );
}

export default App;
