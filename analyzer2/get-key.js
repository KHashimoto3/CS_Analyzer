const fs = require("fs");
const path = require("path");

// ファイル名をプログラム引数として取得
const fileName = process.argv[2];

if (!fileName) {
  console.log("ファイル名を指定してください");
  process.exit(1);
}

//１回分のvaluesを出力
const printKeyDatas = (keyDatas, startTime) => {
  const valueCount = keyDatas.length;
  let endTime = 0;
  let inputCount = 0; //入力文字数
  let removedCout = 0; //削除文字数
  let inputDataCount = 0; //入力データ数
  let removedDataCount = 0; //削除データ数
  let adjustedKeyDatas = [];
  keyDatas.map((keyData) => {
    if (keyData.inputSize > 0) {
      inputCount = inputCount + keyData.inputSize;
      inputDataCount++;
    }
    if (keyData.removedSize > 0) {
      removedCout = removedCout + keyData.removedSize;
      removedDataCount++;
    }
    const timestamp = keyData.timestamp - startTime;

    const adjustedKeyData = {
      timestamp: timestamp,
      inputSize: keyData.inputSize,
      input: keyData.input,
      removedSize: keyData.removedSize,
      removed: keyData.removed,
    };
    adjustedKeyDatas.push(adjustedKeyData);

    endTime = timestamp;
  });
  const typePerSec = valueCount / (endTime / 1000);
  /* TODO: 以下の情報を、直接printではなく、objectとして返すように変更 */
  console.log("\n=======集計結果=======");
  console.log("データ数: ", keyDatas.length);
  console.log("入力文字数: ", inputCount);
  console.log("削除文字数: ", removedCout);
  console.log("入力データ数: ", inputDataCount);
  console.log("削除データ数: ", removedDataCount);
  console.log("合計時間: ", endTime, "ms");
  console.log("打鍵速度: ", Number.parseFloat(typePerSec).toFixed(3), "個/秒");

  //集計結果を返す
  const result = {
    datasCount: keyDatas.length,
    inputCharLength: inputCount,
    removedCharLength: removedCout,
    inputDataCount: inputDataCount,
    removedDataCount: removedDataCount,
    totalTime: endTime, //ms
    typePerSec: typePerSec, //個/秒
    adjustedKeyDatas: adjustedKeyDatas,
  };
  return result;
};

//valueの中身を取り出す
const getkeyDatas = (values) => {
  let keyDatas = [];
  values.map((value) => {
    const timestamp = value.timestamp;
    const input = value.changeData.text;
    const inputSize = countInputSize(input);
    const removed = value.changeData.removed;
    const removedSize = countRemovedSize(removed);
    const keyData = {
      timestamp: timestamp,
      input: input,
      inputSize: inputSize,
      removed: removed,
      removedSize: removedSize,
    };
    keyDatas.push(keyData);
  });
  return keyDatas;
};

//入力文字数のカウント
const countInputSize = (input) => {
  let size = 0;
  input.map((t) => {
    size += t.length;
  });
  return size;
};

//削除文字数のカウント
const countRemovedSize = (removed) => {
  let size = 0;
  removed.map((t) => {
    size += t.length;
  });
  return size;
};

//ファイルを読み込む（同期）
try {
  console.log("読み込むファイル名: ", fileName);
  //ファイルを読み込む
  const jsonString = fs.readFileSync(fileName, "utf8");
  //JSON形式に変換
  const obj = JSON.parse(jsonString);
  console.log("読み込んだファイルのヘッダー: ", obj.header);
  const values = obj.value;
  const startTime = obj.header.timeStampStart;

  const keyDatas = getkeyDatas(values);
  const result = printKeyDatas(keyDatas, startTime);

  console.log("分析完了しました！！！！");
  console.log("以下をファイルに書き込みました。 ");
  console.log(result);

  //出力するファイル名
  const WriteFileName = `${obj.header.name}_${obj.header.title}_1.json`;

  //出力するファイルのパス
  const filePath = path.join("get-key-result-files", WriteFileName);

  const fileString = JSON.stringify(result, null, 2);

  //ファイル書き込み
  fs.writeFileSync(filePath, fileString);
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
