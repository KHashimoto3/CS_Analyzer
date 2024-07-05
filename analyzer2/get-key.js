const fs = require("fs");
const path = require("path");

// ファイル名をプログラム引数として取得
const readFileName = process.argv[2];

if (!readFileName) {
  console.log("ファイル名を指定してください");
  process.exit(1);
}

//１回分のvaluesを出力
const printKeyDatas = (keyDatas) => {
  const valueCount = keyDatas.length;
  let endTime = 0;
  let inputCount = 0; //入力文字数
  let removedCout = 0; //削除文字数
  let inputDataCount = 0; //入力データ数
  let removedDataCount = 0; //削除データ数
  let adjustedKeyDatas = [];

  //削除して、同じ文字数入力し直す場合の情報
  let middleRemovedStart = 0;
  let reInputEnd = 0;
  let middleRemoveLevel = 0; //書き直しのレベル
  let totalReInputCnt = 0; //書き直しの回数
  let totalReInputTime = 0; //書き直しにかかった時間

  keyDatas.map((keyData) => {
    if (middleRemoveLevel > 0) {
      if (keyData.inputSize > 0) {
        inputCount = inputCount + keyData.inputSize;
        inputDataCount++;
        middleRemoveLevel--; //１つ書き直した
      }
      if (keyData.removedSize > 0) {
        removedCout = removedCout + keyData.removedSize;
        removedDataCount++;
        middleRemoveLevel++; //書き直しのレベルをカウント
      }

      if (middleRemoveLevel <= 0) {
        //書き直しにかかった時間を計算
        reInputEnd = keyData.timestamp; //書き直しの終了時間
        const reInputTime = reInputEnd - middleRemovedStart;
        totalReInputTime += reInputTime;
        totalReInputCnt++;
        middleRemovedStart = 0;
        reInputEnd = 0;
      }
    } else {
      if (keyData.inputSize > 0) {
        inputCount = inputCount + keyData.inputSize;
        inputDataCount++;
      }
      if (keyData.removedSize > 0) {
        removedCout = removedCout + keyData.removedSize;
        removedDataCount++;
        middleRemoveLevel++; //書き直しのレベルをカウント
        middleRemovedStart = keyData.timestamp; //書き直しの開始時間
      }
    }

    const adjustedKeyData = {
      timestamp: keyData.timestamp,
      inputSize: keyData.inputSize,
      input: keyData.input,
      removedSize: keyData.removedSize,
      removed: keyData.removed,
    };
    adjustedKeyDatas.push(adjustedKeyData);

    endTime = keyData.timestamp;
  });
  const typePerSec = valueCount / (endTime / 1000);
  /* TODO: 以下の情報を、直接printではなく、objectとして返すように変更 */
  /*console.log("\n=======集計結果=======");
  console.log("データ数: ", keyDatas.length);
  console.log("入力文字数: ", inputCount);
  console.log("削除文字数: ", removedCout);
  console.log("入力データ数: ", inputDataCount);
  console.log("削除データ数: ", removedDataCount);
  console.log("合計時間: ", endTime, "ms");
  console.log("打鍵速度: ", Number.parseFloat(typePerSec).toFixed(3), "個/秒");*/

  //分析項目：入力ミス率
  const missTypeRate = removedCout / (inputCount + removedCout);
  //分析項目：書き直した時間の割合
  const reInputRate = totalReInputTime / endTime;

  //集計結果を返す
  const result = {
    datasCount: keyDatas.length,
    inputCharLength: inputCount,
    removedCharLength: removedCout,
    inputDataCount: inputDataCount,
    removedDataCount: removedDataCount,
    missTypeRate: Number.parseFloat(missTypeRate), //入力ミス率
    totalTime: endTime, //ms
    typePerSec: typePerSec, //個/秒
    totalReInputCnt: totalReInputCnt, //書き直しの回数
    totalReInputTime: totalReInputTime, //書き直しにかかった時間
    reInputRate: Number.parseFloat(reInputRate), //書き直した時間の割合
    adjustedKeyDatas: adjustedKeyDatas,
  };
  return result;
};

//valueの中身を取り出す（startTimeで引いた時間をtimestampとする）
const getkeyDatas = (values, startTime) => {
  let keyDatas = [];
  values.map((value) => {
    const timestamp = value.timestamp - startTime;
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
  //console.log("読み込むファイル名: ", readFileName);
  //ファイルを読み込む
  const jsonString = fs.readFileSync(readFileName, "utf8");
  //JSON形式に変換
  const obj = JSON.parse(jsonString);
  //console.log("読み込んだファイルのヘッダー: ", obj.header);
  const values = obj.value;
  const startTime = obj.header.timeStampStart;

  const keyDatas = getkeyDatas(values, startTime);
  const result = printKeyDatas(keyDatas);

  //console.log("分析完了しました！！！！");

  //出力するファイル名
  //readFileName先頭の「divided-record-files/」を取り除く
  const WriteFileName = readFileName.replace("divided-record-files/", "");

  //出力するファイルのパス
  const filePath = path.join("get-key-result-files", WriteFileName);

  const fileString = JSON.stringify(result, null, 2);

  //ファイル書き込み
  fs.writeFileSync(filePath, fileString);
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
