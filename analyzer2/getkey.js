const fs = require("fs");

// ファイル名をプログラム引数として取得
const fileName = process.argv[2];

if (!fileName) {
  console.log("ファイル名を指定してください");
  process.exit(1);
}

//１回分のvaluesを出力
const printKeyDatas = (keyDatas, startTime) => {
  keyDatas.map((keyData) => {
    const timestamp = keyData.timestamp - startTime;
    //inputおよびremovedのそれぞれの文字を''で囲み、カンマ区切りに整形
    const inputText = keyData.input.map((t) => `'${t}'`).join(", ");
    const removedText = keyData.removed.map((t) => `'${t}'`).join(", ");
    console.log(
      ` ${timestamp}\t\t${keyData.inputSize}\t${inputText}\t\t\t${keyData.removedSize}\t${removedText}`
    );
  });
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

//３回分の記録（values）を３つに分ける
const splitValuesInto3 = (values) => {
  let valueIdx = 0;

  //最後のvalueは分析に使わないので削除
  values.pop();

  //１つ目の終了を探す
  while (valueIdx < values.length) {
    //１回分の終わりかどうか
    if (isTerminalPoint(valueIdx, values)) {
      break;
    }
    valueIdx++;
  }
  //valuesの最初からvalues1の終了位置までをvalues1に格納
  const values1 = values.slice(0, valueIdx);

  /***２つ目の処理ここから=======================***/
  const values2StartIdx = valueIdx + 3;
  valueIdx = values2StartIdx;
  //２つ目の開始位置のtimestampを取得
  const timeStampStartValues2 = values[valueIdx].timestamp;

  //２つ目の終了を探す
  while (valueIdx < values.length) {
    //１回分の終わりかどうか
    if (isTerminalPoint(valueIdx, values)) {
      break;
    }
    valueIdx++;
  }
  //values2の開始位置からvalues2の終了位置までをvalues2に格納
  const values2 = values.slice(values2StartIdx, valueIdx);

  /***３つ目の処理ここから=======================***/
  const values3StartIdx = valueIdx + 3;
  //３つ目の開始位置のtimestampを取得
  const timeStampStartValues3 = values[values3StartIdx].timestamp;
  //３つ目（valuesの最後までをvalues3に格納）
  const values3 = values.slice(values3StartIdx);

  if (values1.length === 0 || values2.length === 0 || values3.length === 0) {
    console.log("valuesの分割に失敗しました。データを確認してください。");
    process.exit(1);
  }

  const dividedValues = {
    values1: values1,
    values2: values2,
    values3: values3,
    timeStampStartValues2: timeStampStartValues2,
    timeStampStartValues3: timeStampStartValues3,
  };

  return dividedValues;
};

//各回の終了場所かどうか　TODO: 時間がある時にもっとスマートに書き直す
const isTerminalPoint = (valueIdx, values) => {
  if (
    values[valueIdx].changeData.text.length === 2 &&
    values[valueIdx].changeData.text[0] === "" &&
    values[valueIdx].changeData.text[1] === ""
  ) {
    if (
      values[valueIdx + 1].changeData.text.length === 2 &&
      values[valueIdx + 1].changeData.text[0] === "" &&
      values[valueIdx + 1].changeData.text[1] === ""
    ) {
      if (
        values[valueIdx + 2].changeData.text.length === 2 &&
        values[valueIdx + 2].changeData.text[0] === "" &&
        values[valueIdx + 2].changeData.text[1] === ""
      ) {
        if (
          values[valueIdx + 3].changeData.text.length === 2 &&
          values[valueIdx + 3].changeData.text[0] === "" &&
          values[valueIdx + 3].changeData.text[1] === ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//ファイルを読み込む（同期）
try {
  console.log("読み込むファイル名: ", fileName);
  //ファイルを読み込む
  const jsonString = fs.readFileSync("record-files/" + fileName, "utf8");
  //JSON形式に変換
  const obj = JSON.parse(jsonString);
  console.log("読み込んだファイルのヘッダー: ", obj.header);
  //３回分のvaluesを３つの配列に分ける
  const splitedValues = splitValuesInto3(obj.value);
  const values1 = splitedValues.values1;
  const values2 = splitedValues.values2;
  const values3 = splitedValues.values3;
  const timeStampStartValues2 = splitedValues.timeStampStartValues2;
  const timeStampStartValues3 = splitedValues.timeStampStartValues3;

  console.log("\n読み込んだファイルのvalue: \n");

  console.log("1回目の入力");
  const keyDatas1 = getkeyDatas(values1);
  printKeyDatas(keyDatas1, 0);
  console.log("\n");

  console.log("2回目の入力");
  const keyDatas2 = getkeyDatas(values2);
  printKeyDatas(keyDatas2, timeStampStartValues2);
  console.log("\n");

  console.log("3回目の入力");
  const keyDatas3 = getkeyDatas(values3);
  printKeyDatas(keyDatas3, timeStampStartValues3);
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
