// IP Location Data Formatter
function formatLocationData(response) {
    if (response.statusCode !== 200) {
        $done(null);
        return;
    }

    // Format the title (emoji flag + location)
    const title = formatTitle(response);
    
    // Format the subtitle (timezone + ISP + IP)
    const subtitle = formatSubtitle(response);
    
    // Create the final output object
    const result = {
        title: title,
        subtitle: subtitle,
        ip: response.query,
        description: formatDescription(response)
    };

    $done(result);
}

function formatTitle(data) {
    // Convert country code to flag emoji
    const flag = countryCodeToFlag(data.countryCode);
    
    // Build location string, filtering out duplicates
    const locations = [data.country, data.regionName, data.city]
        .filter((item, index, arr) => {
            // Remove empty values and duplicates
            return item && item.trim() && arr.indexOf(item) === index;
        });
    
    return `${flag} ${locations.join(' ')}`;
}

function formatSubtitle(data) {
    const parts = [
        formatTimezone(data.timezone),
        formatISP(data.as),
        data.query
    ].filter(Boolean);
    
    return parts.join(' · ');
}

function formatDescription(data) {
    const description = [
        '-----------------------------------',
        '',
        `${data.country} ${data.regionName} ${data.city}`.trim(),
        '',
        data.timezone,
        '',
        data.query,
        '',
        `Longitude: ${data.lon}  Latitude: ${data.lat}`,
        '',
        [data.isp, data.org].filter(Boolean).join('\n\n')
    ].join('\n');

    return description;
}

function countryCodeToFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function formatTimezone(timezone) {
    return timezone.split('/').pop().replace(/_/g, ' ');
}

function formatISP(asInfo) {
    return asInfo.split(' ')[1] || asInfo;
}

// Example usage with the provided sample data
const sampleResponse = {
    query: "107.175.57.184",
    status: "success",
    country: "United States",
    countryCode: "US",
    regionName: "New York",
    city: "Buffalo",
    timezone: "America/New_York",
    isp: "HostPapa",
    org: "ColoCrossing",
    as: "AS36352 HostPapa",
    lat: 42.8856,
    lon: -78.8736
};

formatLocationData(sampleResponse);
