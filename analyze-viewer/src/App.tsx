import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import data from "./average-result-merged.json";
import collaborator from "./collaborator-list.json";
import { useState } from "react";

function App() {
  const [checkedCollaborator, setCheckedCollaborator] = useState<string[]>([]);
  const [checkedCollaboratorData, setCheckedCollaboratorData] =
    useState<any>(data);
  const [analyzeTarget, setAnalyzeTarget] = useState<string>("all");
  const [checkedAnalyzeClumn, setCheckedAnalyzeClumn] =
    useState<string>("datasCount");

  const handleAnalyzeClumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAnalyzeClumn(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCheckedCollaborator([...checkedCollaborator, e.target.value]);
    } else {
      setCheckedCollaborator(
        checkedCollaborator.filter((name) => name !== e.target.value)
      );
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalyzeTarget(e.target.value);
  };

  /*const filterData = () => {
    if (checkedCollaborator.length === 0) {
      setCheckedCollaboratorData(data);
      return;
    }
    const filteredData = data.filter((d) =>
      checkedCollaborator.includes(d.header.name)
    );
    setCheckedCollaboratorData(filteredData);
  };*/

  //checkedCollaboratorとanalyzeTargetを使ってdataをフィルタリングする

  const filterData = () => {
    if (checkedCollaborator.length === 0) {
      setCheckedCollaboratorData(data);
      return;
    }
    const filteredData = data.filter((d) =>
      checkedCollaborator.includes(d.header.name)
    );
    if (analyzeTarget === "all") {
      setCheckedCollaboratorData(filteredData);
    } else {
      console.log("analyzeTargetでフィルタリング");
      const filteredData2 = filteredData.filter(
        (d) => d.header.title === analyzeTarget
      );
      setCheckedCollaboratorData(filteredData2);
    }
  };

  return (
    <>
      <h1>Analyze-viewer</h1>
      <p>分析結果のビューア</p>
      <h2>協力者リスト</h2>
      {collaborator.map((c) => (
        <div>
          <input
            type="checkbox"
            value={c.name}
            checked={checkedCollaborator.includes(c.name)}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={c.name}>{c.name}</label>
        </div>
      ))}
      <h2>分析対象</h2>
      <div>
        <input
          type="radio"
          name="analyzeTarget"
          value="all"
          checked={analyzeTarget === "all"}
          onChange={handleRadioChange}
        />
        <label htmlFor="all">全体</label>
        <input
          type="radio"
          name="analyzeTarget"
          value="A"
          checked={analyzeTarget === "A"}
          onChange={handleRadioChange}
        />
        <label htmlFor="A">A</label>
        <input
          type="radio"
          name="analyzeTarget"
          value="B"
          checked={analyzeTarget === "B"}
          onChange={handleRadioChange}
        />
        <label htmlFor="B">B</label>
        <input
          type="radio"
          name="analyzeTarget"
          value="C"
          checked={analyzeTarget === "C"}
          onChange={handleRadioChange}
        />
        <label htmlFor="C">C</label>
        <input
          type="radio"
          name="analyzeTarget"
          value="D"
          checked={analyzeTarget === "D"}
          onChange={handleRadioChange}
        />
        <label htmlFor="D">D</label>
      </div>
      <h2>分析項目</h2>
      <p>分析項目を選択してください</p>
      {checkedAnalyzeClumn}
      <div>
        <input
          type="radio"
          name="analyzeClumn"
          value="datasCount"
          checked={checkedAnalyzeClumn.includes("datasCount")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="datasCount">データ数</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="inputDataCount"
          checked={checkedAnalyzeClumn.includes("inputDataCount")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="inputDataCount">入力データ数</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="removedDataCount"
          checked={checkedAnalyzeClumn.includes("removedDataCount")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="removedDataCount">削除データ数</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="missTypeRate"
          checked={checkedAnalyzeClumn.includes("missTypeRate")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="missTypeRate">タイプミス率</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="totalTime"
          checked={checkedAnalyzeClumn.includes("totalTime")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="totalTime">合計時間</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="typePerSec"
          checked={checkedAnalyzeClumn.includes("typePerSec")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="typePerSec">打鍵速度[個/秒]</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="totalReInputCnt"
          checked={checkedAnalyzeClumn.includes("totalReInputCnt")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="totalReInputCnt">合計入力し直し数</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="totalReInputTime"
          checked={checkedAnalyzeClumn.includes("totalReInputTime")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="totalReInputTime">合計入力し直し時間</label>
        <input
          type="radio"
          name="analyzeClumn"
          value="reInputRate"
          checked={checkedAnalyzeClumn.includes("reInputRate")}
          onChange={handleAnalyzeClumnChange}
        />
        <label htmlFor="reInputRate">入力し直し率</label>
      </div>
      <button onClick={filterData}>フィルターして表示</button>
      <h2>分析のリスト</h2>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>データ数</TableCell>
              <TableCell>入力データ数</TableCell>
              <TableCell>削除データ数</TableCell>
              <TableCell>タイプミス率</TableCell>
              <TableCell>合計時間</TableCell>
              <TableCell>打鍵速度[個/秒]</TableCell>
              <TableCell>合計入力し直し数</TableCell>
              <TableCell>合計入力し直し時間</TableCell>
              <TableCell>入力し直し率</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkedCollaboratorData.map((row: any) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {row.header.name}
                </TableCell>
                <TableCell>{row.header.title}</TableCell>
                <TableCell>{row.result.datasCount}</TableCell>
                <TableCell>{row.result.inputDataCount}</TableCell>
                <TableCell>{row.result.removedDataCount}</TableCell>
                <TableCell>
                  {parseFloat(row.result.missTypeRate.toFixed(3))}
                </TableCell>
                <TableCell>{row.result.totalTime}</TableCell>
                <TableCell>
                  {parseFloat(row.result.typePerSec.toFixed(3))}
                </TableCell>
                <TableCell>{row.result.totalReInputCnt}</TableCell>
                <TableCell>{row.result.totalReInputTime}</TableCell>
                <TableCell>
                  {parseFloat(row.result.reInputRate.toFixed(3))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
