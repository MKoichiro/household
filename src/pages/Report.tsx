import { Grid, Paper, Typography } from "@mui/material"
import TransactionTable from "../components/TransactionTable"
import BarChart from "../components/BarChart"
import CategoryChart from "../components/CategoryChart"
import MonthSelector from "../components/MonthSelector"
import { useState } from "react"
import { formatMonth } from "../utils/formatting"
import { useAppContext } from "../context/AppContext"

const NoData = () => {
  return (
    <Typography sx={{display: "inline-block", m: "auto"}}>
      データがありません。
    </Typography>
  )
}

const commonPaperStyle = {
  height: "400px",
  display: "flex",
  flexDirection: "column",
  px: 2,
  py: 1,
}

const Report = () => {

  const {transactions, isLoading, handleDeleteTransaction} = useAppContext()
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const monthlyTransactions = transactions.filter(t => (
    t.date.startsWith(formatMonth(selectedMonth))
  ))

  return (
    <>
      <Grid container spacing={2}>

        {/* 月選択部分 */}
        <Grid size={{xs: 12}} >
          <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        </Grid>

        {/* 円グラフ */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={commonPaperStyle}>
            {monthlyTransactions.length > 0 ? (
              <CategoryChart monthlyTransactions={monthlyTransactions}/>
            ) : (
                <NoData />
            )}
          </Paper>
        </Grid>

        {/* 棒グラフ */}
        <Grid size={{xs: 12, md: 8}}>
          <Paper sx={commonPaperStyle}>
            {monthlyTransactions.length > 0 ? (
              <BarChart monthlyTransactions={monthlyTransactions} isLoading={isLoading} />
            ) : (
              <NoData />
            )}
          </Paper>
        </Grid>

        {/* 表 */}
        <Grid size={{xs: 12}} >
          <TransactionTable monthlyTransactions={monthlyTransactions} onDeleteTransaction={handleDeleteTransaction}/>
        </Grid>

      </Grid>

      {/* fontWeightのテスト */}
      {/* 
        <Typography fontWeight="fontWeightRegular">
          Typographyのフォントウェイトは400です。
        </Typography>
        <Typography fontWeight="fontWeightMedium">
          Typographyのフォントウェイトは500です。
        </Typography>
        <Typography fontWeight="fontWeightBold">
          Typographyのフォントウェイトは700です。
        </Typography>
        <Box sx={{ fontWeight: "fontWeightMedium" }}>
          Boxのフォントウェイトは500です。
        </Box>
        <Box fontWeight="fontWeightBold">
          Boxのフォントウェイトは700です。
        </Box>
      */}
    </>
  )
}

export default Report
