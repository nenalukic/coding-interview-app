import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL?.trim() || window.location.origin;
            const response = await axios.post(`${apiUrl}/rooms`);
            const { roomId } = response.data;
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.error("Failed to create room", error);
            alert("Failed to create room");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="text-center space-y-6 max-w-lg w-full">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                    CodeConnect
                </h1>
                <p className="text-gray-400 text-lg">
                    Real-time collaborative coding interviews.
                </p>

                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                    <button
                        onClick={createRoom}
                        className="w-full py-4 text-lg font-semibold bg-teal-600 hover:bg-teal-500 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg active:scale-95"
                    >
                        Create New Interview Room
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        Generates a unique link to share with candidates.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 text-left">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-teal-400 mb-2">Multi-Language</h3>
                        <p className="text-sm text-gray-400">Support for JavaScript and Python with syntax highlighting.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-cyan-400 mb-2">Live Execution</h3>
                        <p className="text-sm text-gray-400">Run code safely in the browser with instant output.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;
