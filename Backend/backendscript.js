const path = require("path");
const express = require('express'); // framework express
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const sqlite3 = require('sqlite3').verbose();
const DBPATH = "MRV.db"
const DBSOURCE = "MRV.db"


const hostname = '127.0.0.1';// endereço
const port = 1330;// porta do site
const app = express();// app faz o manuseio do express

app.use("/public", express.static(path.join(__dirname, "../Frontend"), {
	// Aqui estamos configurando o cache dos arquivos estáticos... Muito
	// útil em ambientes de produção, mas deve-se ter cuidado durante a
	// fase de desenvolvimento.
	cacheControl: true,
	etag: false,
	maxAge: "30d"
}));

/* Definição dos endpoints */
app.use(express.json());

/*
========================================================================================
//           			       Rotas de redireção					                   //
//                                de páginas                                          //
========================================================================================
*/

app.get('/', function (req, res) {
	// On getting the home route request,
	// the user will be redirected to GFG website
	res.redirect('/public');
});

app.get('/principal', function (req, res) {
	// On getting the home route request,
	// the user will be redirected to GFG website
	res.redirect('/public/HTML/paginaObras.html');
});

app.get('/voltaChamados', function (req, res) {
	// A pagina será direcionada para url correspondente
	res.redirect('/public/HTML/Chamados.html');
});

app.get('/voltaContratos', function (req, res) {
	// A pagina será direcionada para url correspondente
	res.redirect('/public/HTML/contratos.html');
});

app.get('/voltaObras', function (req, res) {
	// A pagina será direcionada para url correspondente
	res.redirect('/public/HTML/historicoObras.html');
});

app.get('/voltaDadosEmpresa', function (req, res) {
	// A pagina será direcionada para url correspondente
	res.redirect('/public/HTML/pagina.html');
});


//get, post, put, delete methods
/*
========================================================================================
//                  Endpoints relacionados à tabela Chamados                          //
//                                COMPLETO                                            //
========================================================================================
*/
//READ

var horario = new Date
var data = `Dia ${horario.getDate()}/${horario.getMonth()+1}   às ${horario.getHours()}:${horario.getMinutes()}`
var status


app.get("/readChamado", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Chamados ORDER BY cod_chamados COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarChamado', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Chamados (data, status, descricao, titulo) VALUES ('" + data + "', '" + status + "', '" + req.body.descricao + "', '" + req.body.titulo + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.redirect('/voltaChamados');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaChamado', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Chamados WHERE cod_chamados=" + req.query.cod_chamados;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaChamado', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Chamados SET status = '" + req.body.status + "' , descricao='" + req.body.descricao + "' , titulo='" + req.body.titulo + "' WHERE cod_chamados='" + req.query.cod_chamados + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.redirect('/voltaChamados');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteChamado", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Chamados WHERE cod_chamados='" + req.query.cod_chamados + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.redirect('/voltaChamados');
		res.end();
	});
	db.close(); // Fecha o banco
});


/*
========================================================================================
//                  Endpoints relacionados à tabela Comunicacao                       //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readComunicacao", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Comunicacao ORDER BY cod_comunicacao COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarComunicacao', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Comunicacao (telefone, celular, email, fax) VALUES ('" + req.body.telefone + "', '" + req.body.celular + "', '" + req.body.email + "', '" + req.body.fax + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>MEIOS DE COMUNICACAO INSERIDOS COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaComunicacao', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Comunicacao WHERE cod_comunicacao=" + req.query.cod_comunicacao;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaComunicacao', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Comunicacao SET telefone='" + req.body.telefone + "', celular = '" + req.body.celular + "' , email='" + req.body.email + "' , fax='" + req.body.fax + "' WHERE cod_comunicacao='" + req.body.cod_comunicacao + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>MEIOS DE COMUNICACAO ATUALIZADOS COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteComunicacao", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Comunicacao WHERE cod_comunicacao='" + req.query.cod_comunicacao + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>MEIOS DE COMUNICACAO DELETADOS COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//                  Endpoints relacionados à tabela Contratos                         //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readContrato", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Contratos ORDER BY cod_contratos COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarContrato', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Contratos (endereco, funcionario, data) VALUES ('" + req.body.endereco + "', '" + req.body.funcionario + "', '" + req.body.data + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.redirect('/voltaContratos');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaContrato', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Contrato WHERE cod_contratos=" + req.query.cod_contratos;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaContrato', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Contratos SET data='" + req.body.data + "', status='" + req.body.status + "' WHERE cod_contratos='" + req.body.cod_contratos + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.redirect('/voltaContratos');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteContrato", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Contratos WHERE cod_contratos='" + req.query.cod_contratos + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.redirect('/voltaContratos');
		res.end();
	});
	db.close(); // Fecha o banco
});


/*
========================================================================================
//                  Endpoints relacionados à tabela Dados Principais                  //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readDados", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM DadosPrincipais ORDER BY codDadosPrincipais COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarDados', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO DadosPrincipais (cnpj, razaoSocial, nomeFantasia, departamento, senha, email) VALUES ('" + req.body.cnpj + "', '" + req.body.razaoSocial + "', '" + req.body.nomeFantasia + "', '" + req.body.departamento + "', '" + req.body.senha + "', '" + req.body.email + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.redirect('/principal');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaDados', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM DadosPrincipais WHERE codDadosPrincipais=" + req.query.codDadosPrincipais;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaDados', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE DadosPrincipais SET cnpj='" + req.body.cnpj + "', razaoSocial = '" + req.body.razaoSocial + "' , nomeFantasia='" + req.body.nomeFantasia + "' , departamento='" + req.body.departamento + "', email = '" + req.body.email + "' WHERE codDadosPrincipais='" + req.query.codDadosPrincipais + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.redirect('/voltaDadosEmpresa');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteDados", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM DadosPrincipais WHERE codDadosPrincipais='" + req.query.codDadosPrincipais + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.redirect('/voltaDadosEmpresa');
		res.end();
	});
	db.close(); // Fecha o banco
});

app.get("/deleteEmpreiteira", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM DadosPrincipais WHERE codDadosPrincipais='" + req.query.codDadosPrincipais + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.redirect('/public/HTML/empreiteira.html');
		res.end();
	});
	db.close(); // Fecha o banco
});
/*
========================================================================================
//                  Endpoints relacionados à tabela Empreiteiro                       //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readEmpreiteiro", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Empreiteiro ORDER BY cod_empreiteiro COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarEmpreiteiro', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Empreiteiro (nome, email, telefone, senha, cnpj, razaoSocial, departamento, nomeFantasia) VALUES ('" + req.body.nome + "','" + req.body.email + "', '" + req.body.telefone + "', '" + req.body.senha + "', '" + req.body.cnpj + "', '" + req.body.razaoSocial + "', '" + req.body.departamento + "', '" + req.body.nomeFantasia + "' )";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>EMPREITEIRO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaEmpreiteiro', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Empreiteiro WHERE cod_empreiteiro=" + req.query.cod_empreiteiro;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaEmpreiteiro', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Empreiteiro SET nome='" + req.body.nome + "', email= '" + req.body.email + "', telefone= '" + req.body.telefone + "', senha= '" + req.body.senha + "', cnpj= '" + req.body.cnpj + "', razaoSocial= '" + req.body.razaoSocial + "', departamento= '" + req.body.departamento + "', nomeFantasia= '" + req.body.nomeFantasia + "'"
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>EMPREITEIRO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteEmpreiteiro", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Empreiteiro WHERE cod_empreiteiro='" + req.query.cod_empreiteiro + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>EMPREITEIRO DELETADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//                  Endpoints relacionados à tabela Endereço                          //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readEndereco", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Endereco ORDER BY cod_endereco COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarEndereco', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Endereco (cep, rua, numero, bairro, cidade) VALUES ('" + req.body.cep + "', '" + req.body.rua + "', '" + req.body.numero + "', '" + req.body.bairro + "', '" + req.body.cidade + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>ENDERECO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaEndereco', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Endereco WHERE cod_endereco=" + req.query.cod_endereco;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaEndereco', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Endereco SET cep='" + req.body.cep + "', rua = '" + req.body.rua + "' , numero='" + req.body.numero + "' , bairro='" + req.body.bairro + "' ,  cidade='" + req.body.cidade + "' WHERE cod_endereco='" + req.body.cod_endereco + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>ENDERECO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteEndereco", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Endereco WHERE cod_endereco='" + req.query.cod_endereco + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>ENDERECO DELETADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//                  Endpoints relacionados à tabela Funcionário                       //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readFuncionario", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Funcionario ORDER BY cod_func COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarFuncionario', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Funcionario (cod_login_func, nome_func, cargo) VALUES ('" + req.body.cod_login_func + "', '" + req.body.nome_func + "', '" + req.body.cargo + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>FUNCIONARIO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaFuncionario', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Funcionario WHERE cod_func=" + req.query.cod_func;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaFuncionario', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Funcionario SET cod_login_func='" + req.body.cod_login_func + "', nome_func = '" + req.body.nome_func + "' ,  cargo='" + req.body.cargo + "' WHERE cod_func='" + req.body.cod_func + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>FUNCIONARIO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteFuncionario", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Funcionario WHERE cod_func='" + req.query.cod_func + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>FUNCIONARIO DELETADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//             Endpoints relacionados à tabela Informações Bancárias                  //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readInfo", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM InfoBancarios ORDER BY cod_dadosbancarios COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarInfo', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO InfoBancarios (agencia, conta, comprovante_banc) VALUES ('" + req.body.agencia + "', '" + req.body.conta + "', '" + req.body.comprovante_banc + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>INFORMACOES BANCARIAS INSERIDAS COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaInfo', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM InfoBancarios WHERE cod_dadosbancarios=" + req.query.cod_dadosbancarios;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaInfo', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE InfoBancarios SET agencia='" + req.body.agencia + "', conta = '" + req.body.conta + "' ,  comprovante_banc='" + req.body.comprovante_banc + "' WHERE cod_dadosbancarios='" + req.body.cod_dadosbancarios + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>DADOS BANCARIOS ATUALIZADOS COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteInfo", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM InfoBancarios WHERE cod_dadosbancarios='" + req.query.cod_dadosbancarios + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>DADOS BANCARIOS DELETADOS COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//                  Endpoints relacionados à tabela Login                             //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readLogin", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Login ORDER BY cod_login COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarLogin', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Login (cod_login_empreiteiro, cod_login_func, email, senha) VALUES ('" + req.body.cod_login_empreiteiro + "', '" + req.body.cod_login_func + "', '" + req.body.email + "', '" + req.body.senha + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>LOGIN INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaLogin', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Login WHERE cod_login=" + req.query.cod_login;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaLogin', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Login SET cod_login_empreiteiro='" + req.body.cod_login_empreiteiro + "', cod_login_func = '" + req.body.cod_login_func + "' , email = '" + req.body.email + "'   senha='" + req.body.senha + "' WHERE cod_login='" + req.body.cod_login + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>LOGIN ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteLogin", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Login WHERE cod_login='" + req.query.cod_login + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>LOGIN DELETADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});

/*
========================================================================================
//                  Endpoints relacionados à tabela Cadastro                          //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readCadastro", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM Cadastro ORDER BY cod_dadosbancarios COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarCadastro', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO Cadastro (cod_login_empreiteiro, cod_dados_principais, cod_comunicacao_, cod_endereco, cod_dados_bancarios) VALUES ('" + req.body.cod_login_empreiteiro + "', '" + req.body.cod_dados_principais + "', '" + req.body.cod_comunicacao + "', '" + req.body.cod_endereco + "', '" + req.body.cod_dadosbancarios + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.write('<p>CADASTRO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaCadastro', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM Cadastro WHERE cod_cadastro=" + req.query.cod_cadastro;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaCadastro', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE Cadastro SET cod_login_empreiteiro='" + req.body.cod_login_empreiteiro + "', rua = '" + req.body.cod_dados_principais + "' , cod_comunicacao='" + req.body.cod_comunicacao + "' , cod_endereco='" + req.body.cod_endereco + "' ,  cod_dadosbancarios='" + req.body.cod_dadosbancarios + "' WHERE cod_cadastro='" + req.body.cod_cadastro + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.write('<p>CADASTRO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteCadastro", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM Cadastro WHERE cod_cadastro='" + req.query.cod_cadastro + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.write('<p>CADASTRO DELETADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
		res.end();
	});
	db.close(); // Fecha o banco
});


/*
========================================================================================
//                  Endpoints relacionados à tabela Obras                             //
//                                COMPLETO                                            //
========================================================================================
*/
//READ
app.get("/readidObras", (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	var sql = 'SELECT * FROM idObras ORDER BY cod_cadastro_obra COLLATE NOCASE';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

//CREATE
app.post('/registrarObras', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO idObras (nome_obra, localizacao, tamanho, setor_requisitado, vagas_requeridas, data_inicio, data_fim, descricao) VALUES ('" + req.body.nome_obra + "', '" + req.body.localizacao + "', '" + req.body.tamanho + "', '" + req.body.setor_requisitado + "', '" + req.body.vagas_requeridas + "', '" + req.body.data_inicio + "', '" + req.body.data_fim + "', '" + req.body.descricao + "')";
	console.log(sql);
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
	});
	res.redirect('/voltaObras');
	db.close(); // Fecha o banco
	res.end();
});

// UPDATE
app.get('/atualizaObras', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "SELECT * FROM idObras WHERE cod_cadastro_obra=" + req.query.cod_cadastro_obra;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

// UPDATE
app.post('/atualizaObras', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	sql = "UPDATE idObras SET nome_obra='" + req.body.nome_obra + "', localizacao = '" + req.body.localizacao + "' , tamanho='" + req.body.tamanho + "' , setor_requisitado='" + req.body.setor_requisitado + "', vagas_requeridas= '" + req.body.vagas_requeridas + "', data_inicio= '" + req.body.data_inicio + "', data_fim= '" + req.body.data_fim + "', descricao= '" + req.body.descricao + "' WHERE cod_cadastro_obra='" + req.query.cod_cadastro_obra + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.end();
	});
	res.redirect('/voltaObras');
	db.close(); // Fecha o banco
});

//DELETE
app.get("/deleteObras", urlencodedParser, (req, res) => { //Deleta uma obra do banco de dados
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

	sql = "DELETE FROM idObras WHERE cod_cadastro_obra='" + req.query.cod_cadastro_obra + "'";
	console.log(sql);
	var db = new sqlite3.Database(DBSOURCE); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
			throw err;
		}
		res.redirect('/voltaObras');
		res.end();
	});
	db.close(); // Fecha o banco
});

// INNER JOIN
app.get('/loginEmpreiteiro', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	console.log(req.body)
	var sql = `SELECT Empreiteiro.nome_empreiteiro, Login.email, Login.senha, Login.cod_login FROM Login INNER JOIN Empreiteiro ON Login.cod_login = Empreiteiro.cod_empreiteiro`;
	console.log(sql);
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
	db.close(); // Fecha o banco
});

app.listen(port, hostname, () => {
	console.log(`Servidor rodando em http://${hostname}:${port}/`);
});


