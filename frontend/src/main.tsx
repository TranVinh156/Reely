// // frontend/src/main.tsx (snippet)
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import FeedPage from "@/pages/FeedPage";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<FeedPage />} />
//         {/* other routes */}
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import IndexPage from "./pages/index";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IndexPage />
  </React.StrictMode>
);
