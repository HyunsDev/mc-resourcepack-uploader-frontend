import React from "react";
import { OpizeWrapper } from "opize-design-system";
import { Router } from "./page/router";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "opize-design-system/dist/style/font.css";

function App() {
    return (
        <div className="App">
            <OpizeWrapper>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    draggable
                    transition={Flip}
                />
                <Router />
            </OpizeWrapper>
        </div>
    );
}

export default App;
