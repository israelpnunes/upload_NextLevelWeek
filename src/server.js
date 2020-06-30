const express = require("express")
const server = express()

// pegar o banco de dados

const db = require("./database/db.js")
//configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", function (req, res) {
    return res.render("index.html")
})

server.get("/create-point", function (req, res) {

    // req.query: Query Strings da nossa url
    // console.log(req.query)
    return res.render("create-point.html")

})

server.post("/savePoint", function (req, res) {

    //console.log(req.query)
    //req.body: O corpo do nosso formulario
    //console.log(req.body)

    //inserir dados no banco de dados

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            //return res.send("Erro no cadastro!")
            return res.render("create-point.html", {error: true})
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)

})



server.get("/search", function (req, res) {

    const search = req.query.search

    //pesquisa vazia
    // if(search == ""){
    //    return res.render("search-results.html", {total: 0})
    //  }
    // pegar os dados do banco de dados

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length
        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total })
    })

})
server.listen(3000)

