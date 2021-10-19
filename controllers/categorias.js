const { response } = require("express");
const { Categoria } = require('../models/index')


//Obtener Categorias - paginado - total - populate
const obtenerCategorias = async ( req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const status = { estado: true};

    const [ total, categorias ] = await Promise.all([ //Coleccion de promesas
        Categoria.countDocuments(status),   //total es resultado de la 1º promesa
        Categoria.find(status)              //categorias es resultado de la 2º promesa
            .populate('usuario','nombre')  //Para ver el usuario que hace la peticion
            .skip( Number(desde))
            .limit(Number (limite))
    ]);


    res.json({
        total,
        categorias
    });
    
    //Mi forma de hacerlo
   /*  const totalCategoriasBD = await Categoria.countDocuments();

    const status = { estado: true };

    const todasCategorias = await Categoria.find(status);

    res.json({
        totalCategoriasBD,
        todasCategorias
    }); */
}


//Obtener Categoria - populate {Regresa el objeto de la categoria}
const obtenerCategoria = async (req, res = response) =>{

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json(categoria);
}


//Crear Categoria
const crearCategoria = async ( req, res = response) => {
//Grabamos el nombre que viene en el body de la peticion de crear categoria en mayusculas
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre}); 

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya esta creada`
        })
    }

    //Generar la data que se va a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    //El id de mongo del usuario que esta haciendo la peticion para crear la categoria 
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}


//Actualizar categoria
const actualizarCategoria = async ( req,res = response) => {
//Sabemos que tiene que venir un id
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    //Para que no puedan cambiar al enviar ni el estado ni el usuario

//El nombre viene en la data y cambia, pero puede ser una const porque la data no cambia(cambia la propiedad nombre de su interior)
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id; //El usuario que realiza la peticion de actualizar

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    //Actualizamos el id que nos viene en la req y le introducimos la data actualizada
    //new: true Para que los cambios aparezcan al hacer la peticion

    res.json( categoria );
}


//Borrar categoria
const borrarCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false}, { new: true});

    res.status( 200 ).json( categoriaBorrada );
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}