// particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff' // White color
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#e91e63', // Pink color
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

sheetId = "2PACX-1vQZUuS8wyPIU-GgtZqngmQxkloBQgBfk3LZkh-QhAJRghyfwxnbFXR5xkB-P0w2fvY_ItZMFYxnjQbB";
async function fetchGoogleSheetCSV(sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const csvData = await response.text();
            return csvData;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchAndParseGoogleSheet(sheetId) {
    const csvData = await fetchGoogleSheetCSV(sheetId);
    const jsonData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        transformHeader: header =>
            header
                .toLowerCase()
                .replace(/\W/g, '_')
    }).data;
    return jsonData;
}



function plotMedsOverTime(data) {
    
    // Convert 'Timestamp' strings to Date objects and sort the data by date
    data.forEach(item => item.timestamp = new Date(item.timestamp));
    data.sort((a, b) => a.timestamp - b.timestamp);

    // Create arrays of dates and 'Meds' values
    const dates = data.map(item => item.timestamp);
    const meds = data.map(item => item.meds ? 1 : 0);

    // Create the trace for the bar graph
    const trace = {
        x: dates,
        y: meds,
        type: 'bar'
    };

    // Create the data array for the plot
    const plotData = [trace];

    // Define the layout
    const layout = {
        title: 'Meds Over Time',
        xaxis: {
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            title: 'Meds',
            type: 'linear',
            tickvals: [0, 1],
            ticktext: ['No', 'Yes']
        }
    };

    // Create the plot
    Plotly.newPlot('BarChart', plotData, layout);
}

function calculateStreak(data) {

    // Convert 'Timestamp' strings to Date objects and sort the data by date
    data.forEach(item => item.timestamp = new Date(item.timestamp));
    data.sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order

    let streak = 0;
    let currentDate = new Date();

    // Set the time of currentDate to 00:00:00
    currentDate.setHours(0, 0, 0, 0);

    for (let item of data) {
        // Set the time of item.timestamp to 00:00:00
        item.timestamp.setHours(0, 0, 0, 0);

        if (+item.timestamp === +currentDate) {
            streak++;
            // Subtract one day from currentDate
            currentDate.setDate(currentDate.getDate());
        } else if (+item.timestamp < +currentDate) {
            break;
        }
    }

    return streak;
}

function plotEventTimes(data) {

    // Extract the times of the events
    const times = data.map(item => {
        const date = new Date(item.timestamp);
        return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    });

    // Define the data for the plot
    var plotData = [
        {
            y: times,
            type: 'box',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8
        }
    ];

    // Define the layout for the plot
    var layout = {
        title: 'Time of Taking Meds',
        yaxis: {
            title: 'Time of Day (in hours)',
            range: [0, 24],
            tickmode: 'linear',
            tick0: 0,
            dtick: 1
        }
    };

    // Create the plot
    Plotly.newPlot('BoxChart', plotData, layout);
}

async function fetchData(sheetId){
    const data = await fetchAndParseGoogleSheet(sheetId);
    console.log(data);
    plotMedsOverTime(data);
    
    plotEventTimes(data);
    streakCounter = document.getElementById("streakCounter");
    streakCounter.innerHTML = `\n \n \n Streak of ${calculateStreak(data)} days!`;

}

fetchData(sheetId);