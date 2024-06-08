console.log("hello from getkey.js");

const fs = require("fs");

const fileName = "A01_sample_video.json";

const printValue = (value) => {
  console.log("読み込んだファイルの内容: ");
  value.map((v) => {
    console.log(JSON.stringify(v, null, "  "));
  });
};

//ファイルを読み込む（同期）
try {
  const jsonString = fs.readFileSync("record-files/" + fileName, "utf8");
  const obj = JSON.parse(jsonString);
  printValue(obj.value);
  console.log("読み込んだファイルの内容: ", obj.header);
} catch (error) {
  console.log("エラーが発生しました: ", error);
}
