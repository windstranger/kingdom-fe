import './App.css'
import {UnityContainer} from "./UnityContainer.jsx";
import {StartScreen} from "./components/StartScreen/StartScreen.jsx";
import {Route, BrowserRouter as Router, Routes, Link} from "react-router-dom";

function App() {
    return (
        <>
            <Router>
                <div className={"flex gap-4"}>
                    <Link to={"/"}>home</Link>
                    <Link to={"/game"}>game</Link>
                </div>
                <Routes>
                    <Route path={"/game"} element={<UnityContainer/>}></Route>
                    <Route path={"/room"} element={<UnityContainer/>}></Route>
                    <Route path={"/"} element={<StartScreen/>}></Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
