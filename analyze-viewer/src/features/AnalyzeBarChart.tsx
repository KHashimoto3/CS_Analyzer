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
import analyzeClumnList from "./analyze-list.json";

import { useState } from "react";
import { BarChart } from "../components/BarChart";

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export const AnalyzeBarChart = () => {
  const [checkedCollaborator, setCheckedCollaborator] = useState<string[]>([]);
  const [checkedCollaboratorData, setCheckedCollaboratorData] =
    useState<any>(data);
  const [analyzeTarget, setAnalyzeTarget] = useState<string>("all");
  const [checkedAnalyzeClumn, setCheckedAnalyzeClumn] =
    useState<string>("datasCount");

  //棒グラフのデータ
  const [barChartData, setBarChartData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });

  //棒グラフのデータを更新する関数
  //分析対象、分析項目、協力者リストを使ってデータをフィルタリングして、barChartDataを更新する
  const updateBarChartData = () => {
    const labels = checkedCollaborator;
    const datasets: number[] = [];

    //checkedCollaboratorの各要素に対応するデータを取得
    console.log(checkedCollaborator);

    checkedCollaborator.map((name) => {
      const d = getCollaboratorData(name);
      if (d) {
        //datasets.push(d.result[checkedAnalyzeClumn]);
        datasets.push(Number(d.result[checkedAnalyzeClumn]));
      }
    });

    console.log(datasets);

    const barChartDataObj = {
      labels,
      datasets: [
        {
          label: getLabelJa(checkedAnalyzeClumn),
          data: datasets,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };

    setBarChartData(barChartDataObj);
  };

  //渡された協力者に対応するデータを取得する関数
  const getCollaboratorData = (name: string) => {
    return checkedCollaboratorData.find((d) => d.header.name === name);
  };

  //ラベルを英語名から日本語名に変換する関数
  const getLabelJa = (label: string) => {
    const target = analyzeClumnList.find((c) => c.label === label);
    if (target) {
      return target.labelJa;
    }
    return label;
  };

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
      <h2>分析結果をリスト表示</h2>
      <p>協力者の選択</p>
      <div>
        {collaborator.map((c) => (
          <>
            <input
              type="checkbox"
              value={c.name}
              checked={checkedCollaborator.includes(c.name)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={c.name}>{c.name}</label>
          </>
        ))}
      </div>
      <p>分析対象（問題）の選択</p>
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
      <button onClick={filterData}>フィルターして表示</button>
      <h2>グラフに抽出</h2>
      <p>グラフに抽出する分析項目を選択してください。</p>
      <p style={{ color: "red" }}>
        先に、協力者と分析対象を選択してから選択してください。
      </p>
      <div>
        {analyzeClumnList.map((c) => (
          <>
            <input
              type="radio"
              name="analyzeClumn"
              value={c.label}
              checked={checkedAnalyzeClumn.includes(c.label)}
              onChange={handleAnalyzeClumnChange}
            />
            <label htmlFor={c.label}>{c.labelJa}</label>
          </>
        ))}
      </div>
      <button onClick={updateBarChartData}>グラフの描画</button>
      <h2>分析結果のリスト</h2>

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
              <TableCell>平均入力し直し時間</TableCell>
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
                <TableCell>
                  {parseFloat(row.result.averageReInputTime.toFixed(3))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h2>グラフ</h2>
      <BarChart
        titleText={getLabelJa(checkedAnalyzeClumn)}
        labels={barChartData.labels}
        datasets={barChartData.datasets}
      />
    </>
  );
};
