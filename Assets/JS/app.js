"using strict";

(() => {
    // Fetch countries from API
    const getCountries = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
        return await response.json();
    };

    const totalCountriesElement = document.getElementById('totalCountries');
    const totalPopulationElement = document.getElementById('totalPopulation');
    const averagePopulationElement = document.getElementById('averagePopulation');

    // Generate HTML table rows for countries
    const generateHTMLTable = (countries) => {
        return countries.map((country) => {
            const { name, population } = country;
            return `
                <tr>
                    <td>${name.common}</td>
                    <td>${population}</td>
                </tr>
            `;
        }).join('');
    };

    // Render table rows for countries
    const renderHTML = (html) => {
        document.getElementById("countryInfo").innerHTML = html;
    };

    // Calculate and display statistics
    const calculateStatistics = (countries) => {
        const totalCountries = countries.length;
        const totalPopulation = countries.reduce((sum, country) => sum + (country.population || 0), 0);
        const averagePopulation = totalPopulation / totalCountries;

        // Update statistics in the DOM
        totalCountriesElement.textContent = `Total countries result: ${totalCountries}`;
        totalPopulationElement.textContent = `Total Countries Population: ${totalPopulation}`;
        averagePopulationElement.textContent = `Average Population: ${Math.round(averagePopulation)}`;
    };

    // Count countries by region
    const countCountriesByRegion = (countries) => {
        return countries.reduce((acc, country) => {
            const region = country.region || "Unknown";
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});
    };

    // Generate HTML table rows for regions
    const generateRegionTable = (regionCounts) => {
        return Object.entries(regionCounts)
            .map(([region, count]) => {
                return `
                    <tr>
                        <td>${region}</td>
                        <td>${count}</td>
                    </tr>
                `;
            })
            .join('');
    };

    // Render the region table
    const renderRegionTable = (html) => {
        document.getElementById("regionInfo").innerHTML = html;
    };

    // Count countries by currency
    const countCountriesByCurrency = (countries) => {
        return countries.reduce((acc, country) => {
            if (country.currencies) {
                Object.keys(country.currencies).forEach((currency) => {
                    acc[currency] = (acc[currency] || 0) + 1;
                });
            }
            return acc;
        }, {});
    };

    // Generate HTML for the currency table
    const generateCurrencyTable = (currencyCounts) => {
        return Object.entries(currencyCounts)
            .map(([currency, count]) => {
                return `
                    <tr>
                        <td>${currency}</td>
                        <td>${count}</td>
                    </tr>
                `;
            })
            .join('');
    };

    // Render the currency table
    const renderCurrencyTable = (html) => {
        document.getElementById("currencyInfo").innerHTML = html;
    };

    // Event listener for fetching all countries
    document.getElementById('getAllCountry').addEventListener('click', async () => {
        try {
            const countries = await getCountries('https://restcountries.com/v3.1/all');
            
            // Generate and render country table
            const newHTML = generateHTMLTable(countries);
            renderHTML(newHTML);

            // Calculate and display statistics
            calculateStatistics(countries);

            // Generate and render region table
            const regionCounts = countCountriesByRegion(countries);
            const regionHTML = generateRegionTable(regionCounts);
            renderRegionTable(regionHTML);

            // Generate and render currency table
            const currencyCounts = countCountriesByCurrency(countries);
            const currencyHTML = generateCurrencyTable(currencyCounts);
            renderCurrencyTable(currencyHTML);
        } catch (err) {
            console.error("Error:", err);
        }
    });

    // Event listener for searching specific country
    document.getElementById('searchCountry').addEventListener('click', async (event) => {
        event.preventDefault();
        const countryName = document.getElementById('countryName').value;
        try {
            const countries = await getCountries(`https://restcountries.com/v3.1/name/${countryName}`);

            // Generate and render country table
            const newHTML = generateHTMLTable(countries);
            renderHTML(newHTML);

            // Calculate and display statistics
            calculateStatistics(countries);

            // Generate and render region table
            const regionCounts = countCountriesByRegion(countries);
            const regionHTML = generateRegionTable(regionCounts);
            renderRegionTable(regionHTML);

            // Generate and render currency table
            const currencyCounts = countCountriesByCurrency(countries);
            const currencyHTML = generateCurrencyTable(currencyCounts);
            renderCurrencyTable(currencyHTML);
        } catch (err) {
            console.error("Error:", err);
        }
    });
})();