import React from 'react';
import {Unity, useUnityContext} from "react-unity-webgl";

function UnityComponent() {
    const { unityProvider } = useUnityContext({
        loaderUrl: "Build/web.loader.js",
        dataUrl: "Build/web.data",
        frameworkUrl: "Build/web.framework.js",
        codeUrl: "Build/web.wasm",
    });

    return (
        <Unity unityProvider={unityProvider} />
    );
}

export default UnityComponent;