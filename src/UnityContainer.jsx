import React, {useCallback, useEffect, useState} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
export function UnityContainer() {

    const [score, setScore] = useState(0);

    const { unityProvider, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl: "/build/out.loader.js",
        dataUrl: "/build/out.data.gz",
        frameworkUrl: "/build/out.framework.js.gz",
        codeUrl: "/build/out.wasm.gz",
    });

    const handleScoreUpdate = useCallback((score)=>{
        setScore(score);
    });

    useEffect(() => {
        addEventListener("OnScoreUpdate", handleScoreUpdate);
        return () => {
            removeEventListener("OnScoreUpdate", handleScoreUpdate);
        };
    }, [addEventListener, removeEventListener, handleScoreUpdate]);

    return <Unity unityProvider={unityProvider} style={{width: "100vw", height: "100vh", overflow: "hidden", zIndex: 0}} />;
}