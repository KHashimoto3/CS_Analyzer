import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import data from "./result-merged.json";

function App() {
  return (
    <>
      <h1>Analyze-viewer</h1>
      <p>分析結果のビューア</p>
      <p>分析のリスト</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>title</TableCell>
              <TableCell>recNumber</TableCell>
              <TableCell>datasCount</TableCell>
              <TableCell>inputDataCount</TableCell>
              <TableCell>removedDataCount</TableCell>
              <TableCell>missTypeRate</TableCell>
              <TableCell>totalTime</TableCell>
              <TableCell>typePerSec</TableCell>
              <TableCell>totalReInputCnt</TableCell>
              <TableCell>totalReInputTime</TableCell>
              <TableCell>reInputRate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.header.name}>
                <TableCell component="th" scope="row">
                  {row.header.name}
                </TableCell>
                <TableCell>{row.header.title}</TableCell>
                <TableCell>{row.header.recNumber}</TableCell>
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
