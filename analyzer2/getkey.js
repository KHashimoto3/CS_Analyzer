const fs = require("fs");

// ファイル名をプログラム引数として取得
const fileName = process.argv[2];

if (!fileName) {
  console.log("ファイル名を指定してください");
  process.exit(1);
}

const printValue = (values) => {
  console.log("読み込んだファイルの内容: ");
  //最後のvalueは分析に使わないので削除
  values.pop();
  values.map((value) => {
    const keyData = getkeyData(value);
    const inputText = keyData.input.map((t) => `'${t}'`).join(", ");
    const removedText = keyData.removed.map((t) => `'${t}'`).join(", ");
    console.log(
      ` ${keyData.timestamp}\t\t${keyData.inputSize}\t${inputText}\t\t\t${keyData.removedSize}\t${removedText}`
    );
  });
};

//valueの中身を取り出す
const getkeyData = (valueObj) => {
  const timestamp = valueObj.timestamp;
  const input = valueObj.changeData.text;
  const inputSize = countInputSize(input);
  const removed = valueObj.changeData.removed;
  const removedSize = countRemovedSize(removed);
  const keyData = {
    timestamp: timestamp,
    input: input,
    inputSize: inputSize,
    removed: removed,
    removedSize: removedSize,
  };
  return keyData;
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
  console.log("読み込んだファイル名: ", fileName);
  const jsonString = fs.readFileSync("record-files/" + fileName, "utf8");
  const obj = JSON.parse(jsonString);
  console.log("読み込んだファイルの内容: ", obj.header);
  printValue(obj.value);
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
