import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const StarChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/stars?limit=500&search=${search}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching stars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [search]);

    // Prepare data for Plotly
    // H-R Diagram: X-axis is Temperature (reversed), Y-axis is Luminosity (log scale usually)
    // Or Absolute Magnitude vs Spectral Class.
    // Based on your previous notebook, let's use Temperature vs Absolute Magnitude or Luminosity

    const temps = data.map(d => d['Temperature (K)']);
    const luminosities = data.map(d => d['Luminosity(L/Lo)']);
    const colors = data.map(d => {
        const color = d['Star color'].toLowerCase();
        if (color.includes('red')) return '#FF4d4d';
        if (color.includes('blue')) return '#4d4dFF';
        if (color.includes('white')) return '#FFFFF0';
        if (color.includes('yellow')) return '#FFFF00';
        return '#ccc';
    });

    const texts = data.map(d =>
        `Type: ${d['Star type']}<br>Temp: ${d['Temperature (K)']}K<br>Lum: ${d['Luminosity(L/Lo)']}`
    );

    return (
        <div className="glass-panel p-6 h-full w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="card-title mb-0">Hertzsprung–Russell Diagram</h2>
                <input
                    type="text"
                    placeholder="Filter by Color/Class..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field text-sm w-48"
                />
            </div>
            {loading ? <div className="flex-grow flex items-center justify-center animate-pulse">Scanning Star System...</div> :
                <div className="flex-grow w-full h-[500px]">
                    <Plot
                        data={[
                            {
                                x: temps,
                                y: luminosities,
                                mode: 'markers',
                                type: 'scatter',
                                text: texts,
                                marker: {
                                    color: colors,
                                    size: 8,
                                    opacity: 0.8,
                                    line: { color: 'white', width: 0.5 }
                                },
                            },
                        ]}
                        layout={{
                            autosize: true,
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            font: { color: '#ccc' },
                            xaxis: {
                                title: 'Temperature (K)',
                                autorange: 'reversed', // H-R diagrams have hot (high temp) on left
                                gridcolor: '#333'
                            },
                            yaxis: {
                                title: 'Luminosity (L/Lo)',
                                type: 'log',
                                gridcolor: '#333'
                            },
                            hovermode: 'closest',
                            margin: { l: 50, r: 20, t: 30, b: 50 }
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>}
        </div>
    );
};

export default StarChart;
