import React, { useState } from 'react';
import axios from 'axios';

const COLORMAPS = [
    { id: 'magma', name: 'Cosmic Magma' },
    { id: 'inferno', name: 'Inferno' },
    { id: 'plasma', name: 'Plasma Nebula' },
    { id: 'viridis', name: 'Emerald' },
    { id: 'gray', name: 'Monochrome Gray' },
    { id: 'bone', name: 'Stellar Bone' },
    { id: 'hot', name: 'Solar Heat' },
];

const FitsViewer = () => {
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [colormap, setColormap] = useState('magma');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`/fits/upload?colormap=${colormap}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setInfo(response.data);
        } catch (error) {
            console.error(error);
            alert('Error processing FITS file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass-panel p-6 overflow-hidden">
            <h2 className="card-title flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-space-highlight animate-pulse shadow-[0_0_10px_#00F0FF]"></span>
                FITS Image Inspector
            </h2>

            <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-space-highlight/50 transition-all bg-white/5">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".fits"
                        className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-space-accent/20 file:text-space-accent
                            hover:file:bg-space-accent/30 transition-all cursor-pointer
                        "
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-grow">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Colormap</label>
                        <select
                            value={colormap}
                            onChange={(e) => setColormap(e.target.value)}
                            className="input-field w-full text-sm py-2 px-3 h-10"
                        >
                            {COLORMAPS.map(cm => (
                                <option key={cm.id} value={cm.id} className="bg-space-900">{cm.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !file}
                            className="btn-primary h-10 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Processing...' : 'Analyze'}
                        </button>
                    </div>
                </div>
            </div>

            {info && (
                <div className="mt-8 space-y-6 animate-fade-in">
                    {info.image_url && (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-space-highlight to-space-accent rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative rounded-xl overflow-hidden border border-white/20 bg-black aspect-square flex items-center justify-center">
                                <img
                                    src={info.image_url}
                                    alt="FITS Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 font-mono tracking-tighter">
                            <span>RESOLUTION</span>
                            <span className="text-space-highlight font-bold">{info.shape ? `${info.shape[1]} x ${info.shape[0]}` : 'N/A'}</span>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-black/40 overflow-hidden">
                            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 tracking-widest">HEADER METADATA</span>
                                <span className="text-[10px] text-gray-600 font-mono">{info.filename}</span>
                            </div>
                            <div className="p-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-white/10">
                                {Object.entries(info.header_summary || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between items-center px-2 py-1.5 hover:bg-white/5 rounded transition-colors group">
                                        <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-300">{k}</span>
                                        <span className="text-[11px] font-mono text-space-highlight truncate ml-4 max-w-[150px]" title={v}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FitsViewer;

