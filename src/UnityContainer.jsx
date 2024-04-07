import React, {useCallback, useEffect, useState} from "react";
import {Unity, useUnityContext, UnityEvent} from "react-unity-webgl";

export function UnityContainer() {

    const [score, setScore] = useState(0);

    const {unityProvider, addEventListener, removeEventListener, sendMessage} = useUnityContext({
        loaderUrl: "/build/out.loader.js",
        dataUrl: "/build/out.data.gz",
        frameworkUrl: "/build/out.framework.js.gz",
        codeUrl: "/build/out.wasm.gz",
    });


    const handleScoreUpdate = useCallback((score) => {
        setScore(score);
    });

    useEffect(() => {
        addEventListener("OnScoreUpdate", handleScoreUpdate);
        return () => {
            removeEventListener("OnScoreUpdate", handleScoreUpdate);
        };
    }, [addEventListener, removeEventListener, handleScoreUpdate]);

    const roundStart = () => {
        const gameParameters = {
            playerCards: [
                1, 2, 3
            ],
            world: {
                a2: {
                    card: [1, 2],
                    player: 2
                }
            }
        }
        sendMessage("GameController", "roundStart", JSON.stringify(gameParameters));
    }
    const gameEnd = () => {
        const gameParameters = {
            playerScore: 123
        }
        sendMessage("GameController", "roundStart", JSON.stringify(gameParameters));
    }
    const gameEndToPlayers = () => {
        const gameParameters =
            [
                {
                    playerId: 123,
                    playerScore: 123
                }
            ]


        sendMessage("GameController", "gameEndToPlayers", JSON.stringify(gameParameters));
    }

    const playerTurnEnd = () => {
        const gameParameters = {
            // оставшиеся карточки для другого игрока
            playerCards: [
                1, 2, 3
            ],
            // сделанный ход игроком
            world: {
                a2: {
                    card: [1, 2],
                    player: 2
                }
            }
        }
        // вызов из юнити реакт
        // sendMessage("GameController", "roundStart", JSON.stringify(gameParameters));
    }


    const callUnity = useCallback(() => {
        sendMessage("GameController", "SpawnEnemies", 100);
    }, [sendMessage]);
    return <div>
        <button onClick={callUnity}>call unity</button>
        <Unity unityProvider={unityProvider} style={{width: "100vw", height: "100vh", overflow: "hidden", zIndex: 0}}/>;
    </div>
}