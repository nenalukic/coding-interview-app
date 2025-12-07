import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const Editor = ({ socket, roomId, initialCode, initialLanguage }) => {
    const [code, setCode] = useState(initialCode || '');
    const [language, setLanguage] = useState(initialLanguage || 'javascript');
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const pyodideRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('code-update', (newCode) => {
            setCode(newCode);
        });

        socket.on('language-update', (newLang) => {
            setLanguage(newLang);
        });

        socket.on('output-update', (newOutput) => {
            setOutput(newOutput);
        });

        return () => {
            socket.off('code-update');
            socket.off('language-update');
            socket.off('output-update');
        };
    }, [socket]);

    // Initialize Pyodide
    useEffect(() => {
        const loadPyodide = async () => {
            if (window.loadPyodide && !pyodideRef.current) {
                try {
                    pyodideRef.current = await window.loadPyodide();
                    console.log("Pyodide loaded");
                } catch (e) {
                    console.error("Failed to load Pyodide", e);
                }
            }
        };
        loadPyodide();
    }, []);

    const onChange = (value) => {
        setCode(value);
        if (socket) {
            socket.emit('code-change', { roomId, code: value });
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (socket) {
            socket.emit('language-change', { roomId, language: newLang });
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput([]); // Clear previous output

        // Don't run if code is empty
        if (!code.trim()) {
            setIsRunning(false);
            return;
        }

        try {
            if (language === 'javascript') {
                // Execute JS via simple Eval in a try-catch block (Note: real "sandbox" is complex, simple eval shown here per req constraints for simplicity, ideally Web Worker)
                // To support console.log, we override it momentarily or use a helper
                const log = [];
                const originalConsoleLog = console.log;
                console.log = (...args) => {
                    log.push(args.join(' '));
                };

                try {
                    // Wrap in async function to allow await
                    await eval(`(async () => { ${code} })()`);
                } catch (e) {
                    log.push(`Error: ${e.message}`);
                } finally {
                    console.log = originalConsoleLog;
                    setOutput(log);
                    // Broadcast output to other users in room
                    if (socket) {
                        socket.emit('code-output', { roomId, output: log });
                    }
                }

            } else if (language === 'python') {
                if (!pyodideRef.current) {
                    setOutput(['Pyodide is loading... please wait.']);
                    return;
                }
                try {
                    // Capture stdout
                    const pythonOutput = [];
                    pyodideRef.current.setStdout({ batched: (msg) => {
                        pythonOutput.push(msg);
                        setOutput(prev => [...prev, msg]);
                    }});
                    await pyodideRef.current.runPythonAsync(code);
                    // Broadcast output to other users in room
                    if (socket) {
                        socket.emit('code-output', { roomId, output: pythonOutput });
                    }
                } catch (e) {
                    const errorMsg = `Error: ${e.message}`;
                    setOutput(prev => [...prev, errorMsg]);
                    // Broadcast error to other users
                    if (socket) {
                        socket.emit('code-output', { roomId, output: [...pythonOutput, errorMsg] });
                    }
                }
            }
        } catch (e) {
            setOutput([`Execution failed: ${e.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    const getExtensions = () => {
        return language === 'javascript' ? [javascript()] : [python()];
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>
                </div>
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center px-4 py-1.5 rounded text-sm font-semibold transition-colors ${isRunning
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white shadow-sm'
                        }`}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>

            {/* Split View: Editor & Console */}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 border-r border-gray-700 overflow-auto">
                    <CodeMirror
                        value={code}
                        height="100%"
                        theme={vscodeDark}
                        extensions={getExtensions()}
                        onChange={onChange}
                        className="text-base"
                    />
                </div>

                {/* Console Output */}
                <div className="w-1/3 bg-black flex flex-col min-w-[250px]">
                    <div className="px-3 py-2 bg-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                        Output
                    </div>
                    <div className="flex-1 p-3 font-mono text-sm overflow-auto text-gray-300 whitespace-pre-wrap">
                        {output.length === 0 ? (
                            <span className="text-gray-600 italic">Run code to see output...</span>
                        ) : (
                            output.map((line, i) => (
                                <div key={i}>{line}</div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
