const fs = require("fs");
const path = require("path");

// ファイル名をプログラム引数として取得
const fileName = process.argv[2];

if (!fileName) {
  console.log("ファイル名を指定してください");
  process.exit(1);
}

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

//各回の終了場所かどうか →今の場所は３行空行の場所かどうか　TODO: 時間がある時にもっとスマートに書き直す
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

  //１回目
  const file1Obj = {
    header: {
      ...obj.header,
      recNumber: 1,
      timeStampStart: 0,
    },
    value: values1,
  };

  const file2Obj = {
    header: {
      ...obj.header,
      recNumber: 2,
      timeStampStart: timeStampStartValues2,
    },
    value: values2,
  };

  const file3Obj = {
    header: {
      ...obj.header,
      recNumber: 3,
      timeStampStart: timeStampStartValues3,
    },
    value: values3,
  };

  //出力するファイル名
  const file1Name = `${obj.header.name}_${obj.header.title}_1.json`;
  const file2Name = `${obj.header.name}_${obj.header.title}_2.json`;
  const file3Name = `${obj.header.name}_${obj.header.title}_3.json`;

  //出力するファイルのパス
  const file1Path = path.join("divided-record-files", file1Name);
  const file2Path = path.join("divided-record-files", file2Name);
  const file3Path = path.join("divided-record-files", file3Name);

  const file1String = JSON.stringify(file1Obj, null, 2);
  const file2String = JSON.stringify(file2Obj, null, 2);
  const file3String = JSON.stringify(file3Obj, null, 2);

  //ファイルを書き込む
  fs.writeFile(file1Path, file1String, (err) => {
    if (err) {
      console.log("エラーが発生しました: ", err);
    } else {
      console.log("１回目のファイルを書き込みました: ", file1Path);
    }
  });

  fs.writeFile(file2Path, file2String, (err) => {
    if (err) {
      console.log("エラーが発生しました: ", err);
    } else {
      console.log("２回目のファイルを書き込みました: ", file2Path);
    }
  });

  fs.writeFile(file3Path, file3String, (err) => {
    if (err) {
      console.log("エラーが発生しました: ", err);
    } else {
      console.log("３回目のファイルを書き込みました: ", file3Path);
    }
  });

  console.log("ファイルの分割が完了しました！！");
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
