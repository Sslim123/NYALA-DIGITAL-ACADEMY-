require('dotenv').config();
const express = require('express');
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const compressions = require("compression");
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const authRoutes = require('./Routes/authRoutes');
const applyRoutes = require('./Routes/applyRoutes');

const StudentCourses = require("./Routes/StudentCourses");
const supabaseConfig = require('./Routes/uploadsMaterials');
const submissionsRoutes = require("./Routes/getCourseMaterials");

const examAttempts = require('./Routes/exam/examAttempts');
const examAutoSaves = require('./Routes/exam/examAutoSaves');
const examStart = require('./Routes/exam/examStart');
const examSubmit = require('./Routes/exam/examSubmit');

const certificateRoutes = require('./Routes/certificate/CertifcatesRoutes');
const generateCode = require('./Routes/certificate/GenerateCode');
const app = express();
app.use(compressions());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PUT","PATCH", "DELETE"],
    allowedHeaders: ['Authorization', 'Content-Type', 'cache-control'],
    credentials: true,
  })
)

app.use(express.json());
app.use(
  session({
    name: "seb.sid",
    secret: "seb-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    },
  })
);

app.use('/api', authRoutes);  
app.use('/api', StudentCourses);
app.use("/api", submissionsRoutes);
app.use('/api', applyRoutes); 
app.use('/api', supabaseConfig);
app.use('/api', certificateRoutes);
app.use('/api', generateCode);
app.use('/api', examAttempts)
app.use('/api', examAutoSaves)
app.use('/api', examStart);
app.use('/api', examSubmit);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.listen(PORT, () => console.log(`Bridge running on port ${PORT}`));

