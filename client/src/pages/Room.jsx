import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Editor from '../components/Editor';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch room existence
        const checkRoom = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
                await axios.get(`${apiUrl}/rooms/${roomId}`);
            } catch (e) {
                alert("Room not found");
                navigate('/');
                return false;
            }
            return true;
        };

        checkRoom().then((exists) => {
            if (exists) {
                const socketUrl = process.env.REACT_APP_SOCKET_URL || window.location.origin;
                const newSocket = io(socketUrl);
                setSocket(newSocket);

                newSocket.emit('join-room', roomId);

                setLoading(false);

                return () => {
                    newSocket.disconnect();
                }
            }
        });
    }, [roomId, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700 shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1
                        onClick={() => navigate('/')}
                        className="text-xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 hover:opacity-80 transition-opacity"
                    >
                        CodeConnect
                    </h1>
                    <span className="text-gray-500">|</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-900 px-3 py-1 rounded border border-gray-700">
                        <span>Room ID:</span>
                        <span className="font-mono text-white select-all">{roomId}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                    }}
                    className="text-sm bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded transition-colors font-medium border border-teal-400 border-opacity-30"
                >
                    Share Link
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden p-4">
                <Editor socket={socket} roomId={roomId} />
            </main>
        </div>
    );
};

export default Room;
