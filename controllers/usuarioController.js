const usuarioReqDto = require("../dtos/usuarioReqDto");
const usuarioResDto = require("../dtos/usuarioResDto");
const { Usuario } = require("../models");
const { where } = require("sequelize");
const bcrypt = require('bcrypt');

exports.criarUsuario = async (req, res) => {
    try {
        const dados = usuarioReqDto.toEntity(req.body);
        const usuarioExistente = await Usuario.findOne({ where: {email: dados.email}});
        if (usuarioExistente) {
            res.status(409).json({ erro: 'Já existe um usuário com esse e-mail!' })
        }
        const senhaHash = await bcrypt.hash(dados.senha, 12);
        dados.senha = senhaHash;

        const usuario = await Usuario.create(dados); //sequelize
        res.status(201).json(usuarioResDto.fromEntity(usuario));
    } catch (e) {
        res.status(400).json({ erro: e.message });
    }
}

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll(); //sequelize
        const resultado = usuarios.map(usuarioResDto.fromEntity);
        res.json(resultado);
    } catch (e) {
        res.status(400).json({ erro: e.message });
    }
}
