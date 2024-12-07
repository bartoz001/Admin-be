import express from 'express'
import cors from 'cors'
import connectDB from './db/db.js'
import Authrouter from './routes/Auth.js'
import cookieParser from 'cookie-parser'
import Adminroutr from './routes/Admin.js'

const app = express()
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}
))
app.use(cookieParser())
app.use(express.json())
const port = 3000
connectDB()


app.use('/auth', Authrouter)
app.use('/admin', Adminroutr)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})