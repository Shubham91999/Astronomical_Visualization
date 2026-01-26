import React, { useState } from 'react';
import axios from 'axios';

const HabitabilityCalc = () => {
    const [starIndex, setStarIndex] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        try {
            setError('');
            setResult(null);
            const response = await axios.get(`/habitability/${starIndex}`);
            setResult(response.data);
        } catch (err) {
            setError('Star not found or invalid data.');
        }
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="card-title">Goldilocks Zone Calculator</h2>
            <div className="flex gap-4 mb-6">
                <input
                    type="number"
                    placeholder="Enter Star Index (0-200)"
                    value={starIndex}
                    onChange={(e) => setStarIndex(e.target.value)}
                    className="input-field flex-grow"
                />
                <button onClick={handleCalculate} className="btn-primary">
                    Calculate
                </button>
            </div>

            {error && <p className="text-red-400">{error}</p>}

            {result && (
                <div className="mt-4 space-y-3 animate-fade-in">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-lg font-semibold text-space-highlight">
                            {result.star_name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-300">
                            <div>Luminosity: <span className="text-white">{result.luminosity} Lo</span></div>
                            <div>Inner Boundary: <span className="text-green-400">{result.habitable_zone_inner_au} AU</span></div>
                            <div>Outer Boundary: <span className="text-blue-400">{result.habitable_zone_outer_au} AU</span></div>
                        </div>
                    </div>

                    {/* Simple Visual Representation */}
                    <div className="relative h-12 bg-gray-700 rounded-full mt-6 overflow-hidden flex items-center">
                        <div className="absolute left-0 h-full bg-yellow-500 w-[10%]" title="Star"></div>
                        {/* Mock visualization - strictly illustrative since AU scaling is hard in simplified divs */}
                        <div className="absolute left-[30%] right-[30%] h-full bg-green-500/30 border-x-2 border-green-500 flex items-center justify-center text-xs font-bold text-green-100">
                            Habitable Zone
                        </div>
                        <div className="absolute left-[40%] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#4d4dff]" title="Planet"></div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">*Visualization is illustrative only</p>
                </div>
            )}
        </div>
    );
};

export default HabitabilityCalc;
