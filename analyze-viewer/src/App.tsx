import data from "./result-merged.json";

function App() {
  return (
    <>
      <h1>Analyze-viewer</h1>
      <p>分析結果のビューア</p>
      <textarea
        rows={30}
        cols={100}
        value={JSON.stringify(data, null, 2)}
        readOnly
      ></textarea>
    </>
  );
}

export default App;
