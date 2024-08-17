import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnalyzeBarChartPage } from "./pages/AnalyzeBarChartPage";
import { HomePage } from "./pages/HomePage";
import { AnalyzeScatterPage } from "./pages/AnalyzeScatterPage";

function App() {
  return (
    <div>
      <h1>Analyze-viewer</h1>
      <p>分析結果のビューア</p>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bar-chart" element={<AnalyzeBarChartPage />} />
          <Route path="/scatter" element={<AnalyzeScatterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
