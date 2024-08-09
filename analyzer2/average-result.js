const fs = require("fs");
const path = require("path");

// 協力者名とタイトルをプログラム引数として取得
const collaboratorName = process.argv[2];
const titleName = process.argv[3];

if (!collaboratorName || !titleName) {
  console.log("協力者名とタイトルを指定してください");
  process.exit(1);
}

const fileDirectory = path.join(__dirname, "get-key-result-files");
//２回目の結果ファイル名
const readFileName2 = collaboratorName + "_" + titleName + "_2.json";
//３回目の結果ファイル名
const readFileName3 = collaboratorName + "_" + titleName + "_3.json";

//ファイルパスの指定
const filePath2 = path.join(fileDirectory, readFileName2);
const filePath3 = path.join(fileDirectory, readFileName3);

//ファイルの読み込み
const fileContent2 = fs.readFileSync(filePath2, "utf8");
const fileContent3 = fs.readFileSync(filePath3, "utf8");

//エラー処理
if (!fileContent2 || !fileContent3) {
  console.error("いずれかのファイルが読み込めませんでした");
  process.exit(1);
}

const jsonData2 = JSON.parse(fileContent2);
const jsonData3 = JSON.parse(fileContent3);

//結果を合計して変数へ格納
const datasCountSum = jsonData2.result.datasCount + jsonData3.result.datasCount;
const inputCharLengthSum =
  jsonData2.result.inputCharLength + jsonData3.result.inputCharLength;
const removedCharLengthSum =
  jsonData2.result.removedCharLength + jsonData3.result.removedCharLength;
const inputDataCountSum =
  jsonData2.result.inputDataCount + jsonData3.result.inputDataCount;
const removedDataCountSum =
  jsonData2.result.removedDataCount + jsonData3.result.removedDataCount;
const missTypeRateSum =
  jsonData2.result.missTypeRate + jsonData3.result.missTypeRate;
const totalTimeSum = jsonData2.result.totalTime + jsonData3.result.totalTime;
const typePerSecondSum =
  jsonData2.result.typePerSec + jsonData3.result.typePerSec;
const totalReInputCntSum =
  jsonData2.result.totalReInputCnt + jsonData3.result.totalReInputCnt;
const totalReInputTimeSum =
  jsonData2.result.totalReInputTime + jsonData3.result.totalReInputTime;
const reInputRateSum =
  jsonData2.result.reInputRate + jsonData3.result.reInputRate;
const averageReInputTimeSum =
  jsonData2.result.averageReInputTime + jsonData3.result.averageReInputTime;

//平均値を求めて変数へ格納
const datasCountAverage = datasCountSum / 2;
const inputCharLengthAverage = inputCharLengthSum / 2;
const removedCharLengthAverage = removedCharLengthSum / 2;
const inputDataCountAverage = inputDataCountSum / 2;
const removedDataCountAverage = removedDataCountSum / 2;
const missTypeRateAverage = missTypeRateSum / 2;
const totalTimeAverage = totalTimeSum / 2;
const typePerSecondAverage = typePerSecondSum / 2;
const totalReInputCntAverage = totalReInputCntSum / 2;
const totalReInputTimeAverage = totalReInputTimeSum / 2;
const reInputRateAverage = reInputRateSum / 2;
const averageReInputTimeAverage = averageReInputTimeSum / 2;

//結果をオブジェクトに格納
const outputObj = {
  header: jsonData2.header,
  resultAverage: {
    datasCount: datasCountAverage,
    inputCharLength: inputCharLengthAverage,
    removedCharLength: removedCharLengthAverage,
    inputDataCount: inputDataCountAverage,
    removedDataCount: removedDataCountAverage,
    missTypeRate: missTypeRateAverage,
    totalTime: totalTimeAverage,
    typePerSec: typePerSecondAverage,
    totalReInputCnt: totalReInputCntAverage,
    totalReInputTime: totalReInputTimeAverage,
    reInputRate: reInputRateAverage,
    averageReInputTime: averageReInputTimeAverage,
  },
};

//出力するファイルのパス
const WriteFileName = collaboratorName + "_" + titleName + "_average.json";
const filePath = path.join("average-result-files", WriteFileName);

const fileString = JSON.stringify(outputObj, null, 2);

//ファイル書き込み
fs.writeFileSync(filePath, fileString);

console.log("平均値を求めた結果が", filePath, "に書き出されました");
