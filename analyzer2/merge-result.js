const fs = require("fs");
const path = require("path");

// JSONファイルが保存されているディレクトリを指定
const jsonDirectory = path.join(__dirname, "get-key-result-files");

// 出力ファイルのパスを指定
const outputFile = path.join(__dirname, "result-merged.json");

// ディレクトリ内のすべてのJSONファイルを読み込んで結合
fs.readdir(jsonDirectory, (err, files) => {
  if (err) {
    console.error("ディレクトリをスキャンできません: " + err);
    return;
  }

  const results = [];

  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(jsonDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(fileContent);

      const outputObj = {
        header: jsonData.header,
        result: jsonData.result,
      };

      results.push(outputObj);
    }
  });

  // 配列のまま書き出す
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf8");
  console.log("結合されたJSONが", outputFile, "に書き出されました");
});
