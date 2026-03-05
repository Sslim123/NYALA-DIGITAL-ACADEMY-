require('dotenv').config();
const express = require('express');
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const authRoutes = require('./Routes/authRoutes');
const applyRoutes = require('./Routes/applyRoutes');
const StudentCourses = require("./Routes/StudentCourses");
const submissionsRoutes = require("./Routes/submissions");
const supabaseConfig = require('./Routes/supabaseMaterials');

const app = express();

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

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.listen(PORT, () => console.log(`Bridge running on port ${PORT}`));

