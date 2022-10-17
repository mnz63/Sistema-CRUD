import express from "express";
import authorizationRoute from "./routes/authorization.route";
import usersRoute from "./routes/user.route";
import config  from "./config.json";

const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(usersRoute);
app.use(authorizationRoute);

app.use('/admin',express.json(), authorizationRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
