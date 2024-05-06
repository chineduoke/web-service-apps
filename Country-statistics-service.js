const axios = require('axios');

async function getPopulationData() {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,population,area,unMember,currencies');
        const populationData = response.data.map(country => ({
            name: country.name.common,
            population: country.population,
            area: country.area, 
            unMember: country.unMember,
            currencies: country.currencies
        }));
        return populationData;
    } catch (error) {
        console.error('Error message:', error.message);
        return null;
    }
}

// Calculate population density for each country 
function calculatePopulationDensity(populationData) {
    const populationDensity = populationData.map(country => ({
        name: country.name,
        density: country.population / country.area 
    }));
    return populationDensity;
}

// Calculate mean, median, and standard deviation of population density
function calculateStatistics(populationDensity) {
    const densities = populationDensity.map(country => country.density);
    const meanDensity = densities.reduce((acc, curr) => acc + curr, 0) / densities.length;
    const medianDensity = calculateMedian(densities);
    const stdDevDensity = calculateStandardDeviation(densities, meanDensity);
    return { meanDensity, medianDensity, stdDevDensity };
}

function calculateMedian(array) {
    const sortedArr = array.slice().sort((a, b) => a - b);
    const midIndex = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 === 0 ? (sortedArr[midIndex - 1] + sortedArr[midIndex]) / 2 : sortedArr[midIndex];
}

function calculateStandardDeviation(array, mean) {
    const squaredDifferences = array.map(val => (val - mean) ** 2);
    const variance = squaredDifferences.reduce((acc, curr) => acc + curr, 0) / array.length;
    return Math.sqrt(variance);
}

// number of UN member countries and countries using Euro as currency
function calculateUNMemberAndEuroCountries(data) {
    let unMembers = 0;
    let euroCountries = 0;

    data.forEach(country => {
        if (country.unMember) {
            unMembers++;
        }

        if ('EUR' in country.currencies) {
            euroCountries++;
        }
    });

    return { unMembers, euroCountries };
}

// Main function
async function main() {
    // Fetch world population data
    const populationData = await getPopulationData();
    

    // Calculate population density
    const populationDensity = calculatePopulationDensity(populationData);

    // Calculate statistics
    const { meanDensity, medianDensity, stdDevDensity } = calculateStatistics(populationDensity);

    // Calculate the number of UN member countries and countries using Euro as currency
    const { unMembers, euroCountries } = calculateUNMemberAndEuroCountries(populationData);


    // Display results 
    console.log("Country\t\t\t\tPopulation Density");
    populationDensity.forEach(country => {
        console.log(`${country.name}\t\t\t\t${country.density.toFixed(3)}`);
    });

    console.log("\nMean Population Density:", meanDensity.toFixed(2));
    console.log("Median Population Density:", medianDensity.toFixed(2));
    console.log("Standard Deviation of Population Density:", stdDevDensity.toFixed(2));

    console.log('Number of UN Member Countries:', unMembers);
    console.log('Number of Countries Using Euro:', euroCountries);
}

main();
